from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from recorder import record_screen, stop_recording
import threading
import os
from pymongo import MongoClient
import config
import datetime

app = Flask(__name__)
CORS(app)

client = MongoClient(config.MONGO_URI)
db = client[config.DB_NAME]
recordings_collection = db[config.COLLECTION_NAME]

is_recording = False
recording_thread = None

if not os.path.exists('recordings'):
    os.makedirs('recordings')

@app.route('/start', methods=['POST'])
def start_recording():
    global is_recording, recording_thread
    if not is_recording:
        is_recording = True
        filename = f"recording_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.avi"  # Unique filename

        recording_thread = threading.Thread(target=record_screen, args=(filename,))
        recording_thread.start()

        return jsonify({"message": "Recording started", "filename": filename})
    return jsonify({"message": "Already recording"})

@app.route('/stop', methods=['POST'])
def stop_recording_endpoint():
    global is_recording
    if is_recording:
        is_recording = False
        recording_thread.join()  # Ensure the thread completes
        return jsonify({"message": "Recording stopped"})
    return jsonify({"message": "Not recording"})

@app.route('/recordings', methods=['GET'])
def get_recordings():
    recordings = list(recordings_collection.find({}, {"_id": 0}))
    for recording in recordings:
        recording['start_time'] = recording['start_time'].strftime('%Y-%m-%d %H:%M:%S')
        recording['end_time'] = recording['end_time'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify(recordings)

@app.route('/recordings/<filename>', methods=['GET'])
def get_recording_file(filename):
    return send_from_directory('recordings', filename)

if __name__ == '__main__':
    app.run(debug=True)
