import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Button from '../components/Button';

const JoinRoom: React.FC = () => {
  const { socket } = useSocket();
  const [roomId, setRoomId] = useState('');
  const [nickname, setNickname] = useState('');
  const [playerInfo, setPlayerInfo] = useState<{ playerNumber: number } | null>(null);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomParam = params.get('roomId');
    if (roomParam) {
      setRoomId(roomParam);
    }

    if (!socket) return;

    socket.on('room_joined', ({ roomId, playerInfo }) => {
      setPlayerInfo(playerInfo);
      setWaiting(true);
    });

    socket.on('game_started', ({ gameType }) => {
      navigate(`/game/${roomId}`);
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('room_joined');
      socket.off('game_started');
      socket.off('error');
    };
  }, [socket, navigate, roomId, location.search]);

  const handleJoinRoom = () => {
    if (!socket || !roomId || !nickname) return;
    socket.emit('join_room', { roomId, nickname });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Join Room</h1>
        
        {!waiting ? (
          <>
            <div className="mb-4">
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                Room Code
              </label>
              <input
                id="roomId"
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter room code"
                maxLength={6}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your nickname"
              />
            </div>
            
            <Button
              fullWidth
              size="lg"
              onClick={handleJoinRoom}
              disabled={!roomId || !nickname}
            >
              Join Game
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">
              You are Player {playerInfo?.playerNumber}
            </p>
            <p className="text-lg mb-6">Waiting for host to start the game...</p>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRoom;
