import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Room, GameState } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

export function useRoom(roomId: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { gameState, setPlayers, setCurrentGame, setGameData } = useGameStore();

  useEffect(() => {
    if (!roomId) return;

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
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, setPlayers, setCurrentGame, setGameData]);

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
    loading,
    error,
    createRoom,
    joinRoom,
    updateRoomState
  };
}
