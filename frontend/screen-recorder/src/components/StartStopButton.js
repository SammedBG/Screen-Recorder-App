// frontend/src/components/StartStopButton.js
import React from 'react';
import { Button } from '@mui/material';

const StartStopButton = ({ isRecording, onStart, onStop }) => {
    return (
        <Button 
            variant="contained" 
            color="primary" 
            onClick={isRecording ? onStop : onStart}
        >
            {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
        </Button>
    );
};

export default StartStopButton;
