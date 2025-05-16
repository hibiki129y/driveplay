import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { GAME_TYPES } from '../lib/constants';
import Button from '../components/Button';
import QRCode from 'react-qr-code';

const CreateRoom: React.FC = () => {
  const { socket } = useSocket();
  const [roomId, setRoomId] = useState('');
  const [selectedGame, setSelectedGame] = useState(GAME_TYPES.INTRO_DON);
  const [qrValue, setQrValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gameParam = params.get('game');
    if (gameParam && Object.values(GAME_TYPES).includes(gameParam)) {
      setSelectedGame(gameParam);
    }

    if (!socket) return;

    socket.emit('create_room', { gameType: selectedGame });

    socket.on('room_created', ({ roomId }) => {
      setRoomId(roomId);
      setQrValue(`${window.location.origin}/join?roomId=${roomId}`);
    });

    return () => {
      socket.off('room_created');
    };
  }, [socket, selectedGame, location.search]);

  const handleStartGame = () => {
    if (!socket || !roomId) return;
    socket.emit('start_game', { roomId });
    navigate(`/game/${roomId}?host=true`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Create Room</h1>
        
        <div className="text-center mb-6">
          <p className="text-xl font-semibold">Room ID</p>
          <p className="text-2xl font-bold my-2">{roomId || 'Generating...'}</p>
        </div>
        
        {qrValue && (
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <QRCode value={qrValue} size={200} />
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Select Game</h2>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(GAME_TYPES).map((game) => (
              <Button
                key={game}
                variant={selectedGame === game ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => setSelectedGame(game)}
              >
                {game}
              </Button>
            ))}
          </div>
        </div>
        
        <Button
          fullWidth
          size="lg"
          onClick={handleStartGame}
          disabled={!roomId}
        >
          Start Game
        </Button>
        
        <p className="text-center mt-6 text-red-500 font-semibold">
          You are the host (please proceed by voice)
        </p>
      </div>
    </div>
  );
};

export default CreateRoom;
