import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Listen for connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for "message" events from the client
  socket.on('message', (msg) => {
    console.log('Message received:', msg);

    // Send a response back to the client
    // socket.emit('message', `Server received: ${msg}`);
    // socket.broadcast.emit('message', `Server received: ${msg}`);
    io.emit('message', `Server received: ${msg}`);

    socket.on('transcription', (data) => {
      console.log('Transcription received:', data);
      socket.broadcast.emit('transcription', data);
    })
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the HTTP server
httpServer.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});