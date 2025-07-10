import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Room, GameState } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface Participant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
}

export function useRoom(roomId: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { gameState, setPlayers, setCurrentGame, setGameData } = useGameStore();

  const fetchParticipants = useCallback(async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', roomId);

    if (!error && data) {
      setParticipants(data);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    fetchParticipants();

    const subscription = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          const updatedRoom = payload.new as Room;
          setRoom(updatedRoom);
          
          if (updatedRoom.game_state) {
            setPlayers(updatedRoom.game_state.players);
            setCurrentGame(updatedRoom.game_state.currentGame);
            setGameData(updatedRoom.game_state.gameData);
          }
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` },
        () => {
          fetchParticipants();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, fetchParticipants]);

  const createRoom = useCallback(async (roomName: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: roomName,
          game_state: gameState
        })
        .select()
        .single();

      if (error) throw error;

      const { error: participantError } = await supabase
        .from('room_participants')
        .insert([{ room_id: data.id, user_id: (await supabase.auth.getUser()).data.user?.id }]);

      if (participantError) throw participantError;

      setRoom(data);
      return data.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  const joinRoom = useCallback(async (roomId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (error) throw error;

      const { error: participantError } = await supabase
        .from('room_participants')
        .insert([{ room_id: roomId, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select();

      if (participantError && participantError.code !== '23505') {
        throw participantError;
      }

      setRoom(data);
      
      if (data.game_state) {
        setPlayers(data.game_state.players);
        setCurrentGame(data.game_state.currentGame);
        setGameData(data.game_state.gameData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setPlayers, setCurrentGame, setGameData]);

  const updateRoomState = useCallback(async (newGameState: GameState) => {
    if (!roomId) return;
    
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ game_state: newGameState })
        .eq('id', roomId);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update room state:', err);
    }
  }, [roomId]);

  return {
    room,
    participants,
    loading,
    error,
    createRoom,
    joinRoom,
    updateRoomState
  };
}
