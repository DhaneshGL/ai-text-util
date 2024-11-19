import React, { useState, useRef } from "react";
import RecordRTC from "recordrtc";
import { AssemblyAI } from "assemblyai";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcriptText, setTranscriptText] = useState("");
  const recorderRef = useRef(null);
  const client = new AssemblyAI({ apiKey: "dd9778660e5549409fd1dae97f898c26" });

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new RecordRTC(stream, { type: "audio" });
        recorder.startRecording();
        recorderRef.current = recorder;
        setRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setAudioBlob(blob);
        setRecording(false);
        recorderRef.current = null;

         transcribeAudio(blob);
      });
    }
  };

  const transcribeAudio = async (blob) => {
    try {
      const response = await client.transcripts.transcribe({ audio: blob });
      setTranscriptText(response.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  return (
    <div>
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {audioBlob && (
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
        </audio>
      )}
      {transcriptText && <div>Transcript: {transcriptText}</div>}
    </div>
  );
};

export default AudioRecorder;