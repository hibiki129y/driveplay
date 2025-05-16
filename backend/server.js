const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory data storage
const rooms = {};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('create_room', ({ gameType }) => {
    const roomId = generateRoomId();
    rooms[roomId] = {
      host: socket.id,
      gameType,
      players: [],
      scores: {},
      currentSong: null,
      status: 'waiting'
    };
    
    socket.join(roomId);
    socket.emit('room_created', { roomId });
    console.log(`Room created: ${roomId}, Game: ${gameType}`);
  });

  // Join an existing room
  socket.on('join_room', ({ roomId, nickname }) => {
    const room = rooms[roomId];
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    const playerNumber = room.players.length + 1;
    const player = {
      id: socket.id,
      nickname,
      playerNumber
    };
    
    room.players.push(player);
    room.scores[socket.id] = 0;
    
    socket.join(roomId);
    socket.emit('room_joined', { roomId, playerInfo: player });
    io.to(roomId).emit('player_joined', { players: room.players });
    console.log(`Player ${nickname} joined room ${roomId}`);
  });

  // Start the game
  socket.on('start_game', ({ roomId }) => {
    const room = rooms[roomId];
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    if (room.host !== socket.id) {
      socket.emit('error', { message: 'Only host can start the game' });
      return;
    }
    
    room.status = 'playing';
    io.to(roomId).emit('game_started', { gameType: room.gameType });
    console.log(`Game started in room ${roomId}`);
  });

  // Handle buzz in Intro Don game
  socket.on('buzz', ({ roomId }) => {
    const room = rooms[roomId];
    
    if (!room || room.status !== 'playing') {
      return;
    }
    
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;
    
    io.to(roomId).emit('player_buzzed', { 
      playerId: socket.id,
      playerNickname: player.nickname 
    });
    console.log(`Player ${player.nickname} buzzed in room ${roomId}`);
  });

  // Handle answer submission
  socket.on('submit_answer', ({ roomId, answer }) => {
    const room = rooms[roomId];
    
    if (!room || room.status !== 'playing') {
      return;
    }
    
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;
    
    // In a real app, we would check if the answer is correct
    // For this MVP, we'll just assume it's correct
    room.scores[socket.id] += 1;
    
    io.to(roomId).emit('answer_result', { 
      playerId: socket.id,
      playerNickname: player.nickname,
      correct: true,
      scores: room.scores
    });
    console.log(`Player ${player.nickname} answered in room ${roomId}`);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from any rooms they were in
    for (const roomId in rooms) {
      const room = rooms[roomId];
      
      // If this was the host, remove the room
      if (room.host === socket.id) {
        io.to(roomId).emit('host_left');
        delete rooms[roomId];
        console.log(`Host left, room ${roomId} removed`);
        continue;
      }
      
      // If this was a player, remove them from the room
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        delete room.scores[socket.id];
        io.to(roomId).emit('player_left', { 
          players: room.players,
          scores: room.scores
        });
        console.log(`Player left room ${roomId}`);
      }
    }
  });
});

// Generate a random room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
