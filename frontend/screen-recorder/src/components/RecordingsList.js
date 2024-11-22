import React from 'react';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material';

function RecordingsList({ recordings }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Recorded Videos
      </Typography>
      <List>
        {recordings.map((recording, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={recording.filename}
              secondary={
                <>
                  <div>Duration: {recording.duration}s</div>
                  <div>Start Time: {recording.start_time}</div>
                  <div>End Time: {recording.end_time}</div>
                </>
              }
            />
            <Button
              variant="outlined"
              color="primary"
              href={`/recordings/${recording.filename}`}
              target="_blank"
            >
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default RecordingsList;
