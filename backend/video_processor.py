import cv2
import os
import uuid
from pathlib import Path

def process_video(video_path: str, output_folder: str):
    Path(output_folder).mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    flagged = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Simulate flagging every 60 frames
        if frame_count % 60 == 0:
            filename = f"{uuid.uuid4().hex}.jpg"
            full_path = os.path.join(output_folder, filename)
            cv2.imwrite(full_path, frame)

            flagged.append({
                "frame": filename,
                "timestamp": f"{frame_count // 30:02d}:{frame_count % 30:02d}",  # assuming 30fps
                "gps": "37.7749, -122.4194",
                "severity": "high" if frame_count % 180 == 0 else "medium"
            })

        frame_count += 1

    cap.release()
    return flagged
