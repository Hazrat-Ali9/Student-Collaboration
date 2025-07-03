"use client";
import '../styles/audio.css';
import React, { useState, useRef } from 'react';

const AudioRecorder = ({ onAudioRecorded }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

      // Send the audio file back to ChatPopup
      onAudioRecorded(audioFile);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="audio-controls">
      {!recording ? (
        <button onClick={startRecording} aria-label="Start recording">🎙️</button>
      ) : (
        <button onClick={stopRecording} className="pulsing" aria-label="Stop recording">🛑</button>
      )}
    </div>
  );
};

export default AudioRecorder;
