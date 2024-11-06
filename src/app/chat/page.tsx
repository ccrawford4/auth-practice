"use client";

import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8001", {
  transports: ["websocket"],
  upgrade: false,
});

export default function ChatPage() {
  useEffect(() => {
    socket.on("connect", () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          const madiaRecorder = new MediaRecorder(stream);
          let audioChunks: Blob[] = [];

          madiaRecorder.addEventListener("dataavailable", function (event) {
            audioChunks.push(event.data);
          });

          madiaRecorder.addEventListener("stop", function () {
            const audioBlob = new Blob(audioChunks);
            audioChunks = [];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = function () {
              const base64String = fileReader.result;
              socket.emit("audioStream", base64String);
            };

            madiaRecorder.start();
            setTimeout(function () {
              madiaRecorder.stop();
            }, 1000);
          });

          madiaRecorder.start();
          setTimeout(function () {
            madiaRecorder.stop();
          }, 1000);
        })
        .catch((error) => {
          console.error("Error capturing audio.", error);
        });
    });

    socket.on("audioStream", (audioData) => {
      let newData = audioData.split(";");
      newData[0] = "data:audio/ogg;";
      newData = newData[0] + newData[1];

      const audio = new Audio(newData);
      if (!audio || document.hidden) {
        return;
      }
      audio.play();
    });
  }, []);

  return (
    <div>
      <h1>Chat Page</h1>
    </div>
  );
}
