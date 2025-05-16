import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCENES, PARTICIPANTS } from '../lib/constants';
import Button from '../components/Button';

const Home: React.FC = () => {
  const [scene, setScene] = useState('');
  const [participants, setParticipants] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/create');
  };

  const handleJoinRoom = () => {
    navigate('/join');
  };

  const handlePlayRecommended = () => {
    navigate('/create?game=Intro Don');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">DrivePlay</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Scene</h2>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(SCENES).map((sceneOption) => (
              <Button
                key={sceneOption}
                variant={scene === sceneOption ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => setScene(sceneOption)}
              >
                {sceneOption}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Number of Participants</h2>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(PARTICIPANTS).map((participantOption) => (
              <Button
                key={participantOption}
                variant={participants === participantOption ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => setParticipants(participantOption)}
              >
                {participantOption}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Game Selection</h2>
          <div className="grid grid-cols-1 gap-3">
            <Button fullWidth onClick={handleCreateRoom}>
              Create Room
            </Button>
            <Button fullWidth variant="secondary" onClick={handleJoinRoom}>
              Join Room
            </Button>
            <Button fullWidth variant="accent" onClick={handlePlayRecommended}>
              Play recommended game (Intro Don)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
