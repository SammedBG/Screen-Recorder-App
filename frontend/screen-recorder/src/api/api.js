import axios from 'axios';
import API_BASE_URL from '../config';

export const startRecording = async (filename) => {
  return axios.post(`${API_BASE_URL}/start`, { filename });
};

export const stopRecording = async () => {
  return axios.post(`${API_BASE_URL}/stop`);
};

export const getRecordings = async () => {
  return axios.get(`${API_BASE_URL}/recordings`);
};

export const downloadRecording = (filename) => {
  // Returns the full download URL for the recording
  return `${API_BASE_URL}/recordings/${filename}`;
};
