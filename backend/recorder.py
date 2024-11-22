import cv2
import numpy as np
import pyautogui
import datetime
import os
import logging
from pymongo import MongoClient
import config

# Configure logging
logging.basicConfig(level=logging.INFO)

# MongoDB setup
client = MongoClient(config.MONGO_URI)
db = client[config.DB_NAME]
recordings_collection = db[config.COLLECTION_NAME]

is_recording = False  # Global flag

def record_screen(filename):
    global is_recording

    # Ensure the recordings directory exists
    if not os.path.exists("recordings"):
        os.makedirs("recordings")
        logging.info("Created 'recordings' directory")

    try:
        screen_size = pyautogui.size()
        fourcc = cv2.VideoWriter_fourcc(*"XVID")
        file_path = f"recordings/{filename}"
        out = cv2.VideoWriter(file_path, fourcc, 20.0, screen_size)

        logging.info(f"Started recording: {filename}")
        start_time = datetime.datetime.now()

        try:
            while is_recording:
                img = pyautogui.screenshot()
                frame = np.array(img)
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                out.write(frame)
        except Exception as e:
            logging.error(f"Error during recording: {e}")
        finally:
            out.release()

        end_time = datetime.datetime.now()
        duration = (end_time - start_time).total_seconds()

        # Save metadata to MongoDB
        try:
            result = recordings_collection.insert_one({
                "filename": filename,
                "file_path": file_path,
                "duration": duration,
                "start_time": start_time,
                "end_time": end_time
            })
            logging.info(f"Metadata saved to MongoDB with ID: {result.inserted_id}")
        except Exception as e:
            logging.error(f"Failed to save metadata to MongoDB: {e}")

    except Exception as e:
        logging.error(f"Failed to initialize recording: {e}")

def stop_recording():
    global is_recording
    is_recording = False
    logging.info("Stopped recording")
