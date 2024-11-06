import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config();

const socket = io('http://localhost:3001');

const LiveTranscription = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Listen for transcription events from the server
    socket.on('transcription', (data) => {
      setTranscript((prev) => prev + ' ' + data);
    });

    return () => {
      socket.off('transcription');
    };
  }, []);

  const startListening = async () => {
    if (isListening) return;

    try {
      // STEP 1: Access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});

      const socket = new WebSocket('wss://api.deepgram.com/v1/listen?smart_format=true', ['token', process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY as string]);
    

      socket.onopen = () => {
        mediaRecorder.addEventListener('dataavailable', event => {
            socket.send(event.data);
        })
        mediaRecorder.start(250);
      }

      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcript = received.channel.alternatives[0].transcript;
        console.log('Transcript:', transcript);
      }
      setIsListening(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    if (!isListening) return;

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    setIsListening(false);
    // Optionally, close the Deepgram connection here if you keep a reference to it
  };

  return (
    <div>
      <h1>Live Transcription</h1>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div>
        <h2>Transcript:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default LiveTranscription;
