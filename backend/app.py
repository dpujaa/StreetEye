from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import uuid
from video_processor import process_video
from batch_processor import batch_process_videos

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/flagged_frames'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/simulate-batch', methods=['GET'])
def simulate_batch_processing():
    flagged_data = batch_process_videos()
    summary = generate_rights_summary("Multiple violent incidents detected across batch videos.")
    return jsonify({
        'status': "⚠️ Batch Processing Complete",
        'summary': summary,
        'flags': flagged_data
    })

@app.route('/upload', methods=['POST'])
def upload_video():
    video = request.files.get('video')
    if not video:
        return jsonify({'error': 'No video file uploaded'}), 400

    temp_path = f'temp_{uuid.uuid4().hex}.mp4'
    video.save(temp_path)

    flagged_data = process_video(temp_path, UPLOAD_FOLDER)

    transcript = "Officer approached quickly and raised their voice at the civilian."
    summary = generate_rights_summary(transcript)

    os.remove(temp_path)

    return jsonify({
        'status': "⚠️ Potential Misconduct Detected" if flagged_data else "No Threat Detected",
        'summary': summary,
        'flags': flagged_data
    })

@app.route('/static/flagged_frames/<filename>')
def serve_frame(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/')
def index():
    return "🎥 StreetEye backend is running! Use /upload or /simulate-batch"

if __name__ == '__main__':
    app.run(debug=True)
