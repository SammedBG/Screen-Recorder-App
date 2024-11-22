// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { startRecording, stopRecording, getRecordings } from './api/api';
import RecordingsList from './components/RecordingsList';
import StartStopButton from './components/StartStopButton';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0); // Timer for recording time

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000); // Increment time every second
    } else {
      clearInterval(timer);
      setRecordingTime(0); // Reset timer when not recording
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const loadRecordings = async () => {
    try {
      const response = await getRecordings(); // Assumes getRecordings() calls /recordings API
      console.log("Fetched recordings:", response.data);
      setRecordings(response.data);
    } catch (error) {
      console.error("Error loading recordings:", error);
    }
  };
  

  const handleStart = async () => {
    try {
      const filename = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.avi`;  // Generate unique filename
      await startRecording(filename);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording", error);
    }
  };
  

  const handleStop = async () => {
    try {
      await stopRecording();
      setIsRecording(false);
      loadRecordings();  // Refresh recordings list after stopping
    } catch (error) {
      console.error("Error stopping recording", error);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Screen Recorder
      </Typography>
      <Box textAlign="center" my={2}>
        <Typography variant="h6">
          {isRecording ? `Recording Time: ${recordingTime}s` : "Not Recording"}
        </Typography>
        <StartStopButton 
          isRecording={isRecording} 
          onStart={handleStart} 
          onStop={handleStop} 
        />
      </Box>
      <RecordingsList recordings={recordings} />
    </Container>
  );
}

export default App;
