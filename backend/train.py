import os
import cv2
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import TimeDistributed, Conv2D, MaxPooling2D, Flatten, LSTM, Dense
from sklearn.model_selection import train_test_split

# === Dataset Paths ===
DATASET_DIR = "/violence_dataset/violence_dataset/violence_dataset"
FRAME_SIZE = (64, 64)
SEQUENCE_LENGTH = 10

def load_jpg_clips(folder_path, label):
    X, y = [], []
    all_files = sorted([f for f in os.listdir(folder_path) if f.endswith(".jpg")])
    print(f"📁 Found {len(all_files)} frames in {folder_path}")

    for i in range(0, len(all_files) - SEQUENCE_LENGTH + 1, SEQUENCE_LENGTH):
        clip = []
        for j in range(SEQUENCE_LENGTH):
            img_path = os.path.join(folder_path, all_files[i + j])
            img = cv2.imread(img_path)
            if img is None:
                print(f"⚠️ Skipped unreadable image: {img_path}")
                break
            img = cv2.resize(img, FRAME_SIZE)
            clip.append(img)
        if len(clip) == SEQUENCE_LENGTH:
            X.append(clip)
            y.append(label)
    return X, y

# === Load clips from frames ===
print("🔁 Processing image sequences...")
X_violence, y_violence = load_jpg_clips(os.path.join(DATASET_DIR, "violence"), 1)
X_nonviolence, y_nonviolence = load_jpg_clips(os.path.join(DATASET_DIR, "non_violence"), 0)

# === Merge and normalize ===
X = np.array(X_violence + X_nonviolence)
y = np.array(y_violence + y_nonviolence)

X = X / 255.0
print(f"🧠 Total samples (clips): {len(X)}")

if len(X) == 0:
    print("❌ No valid training samples found. Exiting.")
    exit()

# === Train/Test Split ===
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# === Model ===
model = Sequential([
    TimeDistributed(Conv2D(16, (3,3), activation='relu'), input_shape=(SEQUENCE_LENGTH, *FRAME_SIZE, 3)),
    TimeDistributed(MaxPooling2D(2,2)),
    TimeDistributed(Flatten()),
    LSTM(64),
    Dense(1, activation='sigmoid')
])
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# === Train ===
print("🚀 Training model...")
model.fit(X_train, y_train, epochs=10, batch_size=8, validation_data=(X_test, y_test))

# === Save Model ===
model.save("violence_detection_model.h5")
print("✅ Model saved as violence_detection_model.h5")
