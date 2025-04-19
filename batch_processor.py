import os
from video_processor import process_video

VIDEO_FOLDER = "/Users/varshathennarasu/PycharmProjects/StreetEye/data/real_life_violence_videos/Violence"
OUTPUT_FOLDER = "static/flagged_frames"

def batch_process_videos():
    all_flags = []

    for filename in os.listdir(VIDEO_FOLDER):
        if not filename.lower().endswith(".mp4"):
            continue

        print(f"Processing {filename}...")
        video_path = os.path.join(VIDEO_FOLDER, filename)

        try:
            flagged = process_video(video_path, OUTPUT_FOLDER)
            all_flags.extend(flagged)
        except Exception as e:
            print(f"⚠️ Error processing {filename}: {e}")

    print(f"✅ Done! Total flagged frames: {len(all_flags)}")
    return all_flags

if __name__ == "__main__":
    batch_process_videos()
