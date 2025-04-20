import cv2
import numpy as np
import os
import uuid
from tensorflow.keras.models import load_model

violence_model = load_model("models/violence_detection_model.h5")

CONFIDENCE_THRESHOLD = 0.99  # Set high threshold to avoid false positives

def process_video(video_path, save_dir):
    cap = cv2.VideoCapture(video_path)
    buffer = []
    flagged_frames = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        resized = cv2.resize(frame, (64, 64))
        img_array = resized.astype(np.float32) / 255.0
        buffer.append(img_array)

        if len(buffer) == 10:
            sequence = np.stack(buffer, axis=0)
            sequence = np.expand_dims(sequence, axis=0)
            prediction = violence_model.predict(sequence, verbose=0)
            confidence = prediction[0][0]

            print(f"🤖 Confidence: {confidence:.4f}")

            if confidence >= CONFIDENCE_THRESHOLD:
                filename = f"flagged_{uuid.uuid4().hex}.jpg"
                save_path = os.path.join(save_dir, filename)
                cv2.imwrite(save_path, frame)
                print("✅ Frame flagged and saved:", filename)

                flagged_frames.append({
                    "filename": filename,
                    "timestamp": cap.get(cv2.CAP_PROP_POS_MSEC),
                    "gps": "37.7749,-122.4194",
                    "severity": "high"
                })
            else:
                print("⚪ Not flagged (below threshold)")

            buffer.pop(0)

    cap.release()
    return flagged_frames

def generate_live_frames():
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

if __name__ == '__main__':
    flags = process_video('../../static/static/sample_test.mp4', '../../static/static/flagged_frames')
    print("Flagged frames:", flags)
