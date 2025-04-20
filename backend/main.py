from flask import Flask, request, jsonify, send_from_directory, render_template, Response
from flask_cors import CORS
import os
import uuid
import cv2
import numpy as np
from collections import deque
from tensorflow.keras.models import load_model
from video_processor import process_video
from batch_processor import batch_process_videos
from rights_generator import generate_rights_summary

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/flagged_frames'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

camera = cv2.VideoCapture(0)
violence_model = load_model("models/violence_detection_model.h5")
frame_buffer = deque(maxlen=10)

def gen():
    global frame_buffer

    while True:
        success, frame = camera.read()
        if not success:
            break

        resized = cv2.resize(frame, (64, 64))
        img_array = resized.astype(np.float32) / 255.0
        frame_buffer.append(img_array)

        if len(frame_buffer) == 10:
            sequence = np.stack(frame_buffer, axis=0)
            sequence = np.expand_dims(sequence, axis=0)
            prediction = violence_model.predict(sequence, verbose=0)
            confidence = prediction[0][0]
        else:
            confidence = 0.0

        label = "⚠️ Violence Detected" if confidence >= 0.99 else "✅ Safe"
        color = (0, 0, 255) if confidence >= 0.99 else (0, 255, 0)
        thickness = 10 if confidence >= 0.99 else 2

        cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
        frame = cv2.rectangle(frame, (0, 0), (frame.shape[1], frame.shape[0]), color, thickness)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/static/flagged_frames/<filename>')
def serve_frame(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/upload', methods=['POST'])
def upload_video():
    print("📥 Upload hit")
    video = request.files.get('video')
    if not video:
        return jsonify({'error': 'No video file uploaded'}), 400

    temp_path = f'temp_{uuid.uuid4().hex}.mp4'
    video.save(temp_path)
    print(f"✅ Saved to {temp_path}")

    try:
        flagged_data = process_video(temp_path, UPLOAD_FOLDER)
        transcript = "Officer approached quickly and raised their voice at the civilian."
        summary = generate_rights_summary(transcript)
        os.remove(temp_path)
        return jsonify({
            'status': "⚠️ High Confidence Misconduct Detected" if flagged_data else "✅ No Threat Detected",
            'summary': summary,
            'flags': flagged_data
        })
    except Exception as e:
        print("❌ Error during processing:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/simulate-batch', methods=['GET'])
def simulate_batch_processing():
    flagged_data = batch_process_videos()
    summary = generate_rights_summary("Multiple violent incidents detected across batch videos.")
    return jsonify({
        'status': "⚠️ Batch Processing Complete",
        'summary': summary,
        'flags': flagged_data
    })

if __name__ == '__main__':
    app.run(debug=True)
