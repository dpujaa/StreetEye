import os
import uuid
import cv2
from pathlib import Path

def process_images(image_folder: str, output_folder: str):
    Path(output_folder).mkdir(parents=True, exist_ok=True)

    # Clean the output folder
    for f in os.listdir(output_folder):
        os.remove(os.path.join(output_folder, f))

    flagged = []

    for i, img_name in enumerate(os.listdir(image_folder)):
        if not img_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue

        img_path = os.path.join(image_folder, img_name)
        img = cv2.imread(img_path)
        if img is None:
            continue

        out_name = f"{uuid.uuid4().hex}.jpg"
        out_path = os.path.join(output_folder, out_name)
        cv2.imwrite(out_path, img)

        flagged.append({
            'frame': out_name,
            'timestamp': f"img_{i}",
            'gps': "37.7749, -122.4194",
            'severity': "high" if i % 3 == 0 else "medium"
        })

    return flagged
