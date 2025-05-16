import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Button from '../components/Button';

interface Player {
  id: string;
  nickname: string;
  playerNumber: number;
}

interface Score {
  [playerId: string]: number;
}

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket } = useSocket();
  const location = useLocation();
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Score>({});
  const [buzzedPlayer, setBuzzedPlayer] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [correctPlayer, setCorrectPlayer] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsHost(params.get('host') === 'true');
  }, [location.search]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on('player_joined', ({ players }) => {
      setPlayers(players);
    });

    socket.on('player_buzzed', ({ playerId, playerNickname }) => {
      setBuzzedPlayer(playerNickname);
    });

    socket.on('answer_result', ({ playerId, playerNickname, correct, scores }) => {
      if (correct) {
        setCorrectPlayer(playerNickname);
        setScores(scores);
      }
      setTimeout(() => {
        setBuzzedPlayer(null);
        setCorrectPlayer(null);
      }, 3000);
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_buzzed');
      socket.off('answer_result');
    };
  }, [socket, roomId]);

  const handleBuzz = () => {
    if (!socket || !roomId) return;
    socket.emit('buzz', { roomId });
  };

  const handleSubmitAnswer = () => {
    if (!socket || !roomId || !answer) return;
    socket.emit('submit_answer', { roomId, answer });
    setAnswer('');
  };

  const renderHostView = () => (
    <div className="pointer-events-none">
      <div className="mb-6 text-center">
        <div className="inline-block bg-gray-800 text-white py-2 px-4 rounded-lg">
          <p className="text-lg">Now Playing...</p>
        </div>
        <p className="text-xl mt-4 font-bold">Shout out the song you know!</p>
      </div>

      {buzzedPlayer && (
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold">{buzzedPlayer} buzzed in!</p>
        </div>
      )}

      {correctPlayer && (
        <div className="mb-6 text-center animate-pulse">
          <p className="text-2xl font-bold text-green-600">{correctPlayer} is correct!</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Scores</h2>
        <ul className="divide-y divide-gray-200">
          {players.map((player) => (
            <li key={player.id} className="py-2 flex justify-between">
              <span>{player.nickname}</span>
              <span className="font-bold">{scores[player.id] || 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderPlayerView = () => (
    <div>
      {correctPlayer ? (
        <div className="mb-6 text-center animate-pulse">
          <p className="text-2xl font-bold text-green-600">{correctPlayer} is correct!</p>
        </div>
      ) : buzzedPlayer ? (
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2">Submit your answer:</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Song name"
            />
            <Button onClick={handleSubmitAnswer} disabled={!answer}>
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6">
          <Button 
            size="lg" 
            fullWidth 
            className="py-12 text-2xl"
            onClick={handleBuzz}
          >
            BUZZ
          </Button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Scores</h2>
        <ul className="divide-y divide-gray-200">
          {players.map((player) => (
            <li key={player.id} className="py-2 flex justify-between">
              <span>{player.nickname}</span>
              <span className="font-bold">{scores[player.id] || 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-2">Intro Don</h1>
        <p className="text-center mb-6">Room: {roomId}</p>
        
        {isHost ? renderHostView() : renderPlayerView()}
        
        {isHost && (
          <div className="mt-6 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-center text-red-600 font-semibold">
              You are the host (please proceed by voice only)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
