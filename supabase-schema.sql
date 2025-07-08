ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.room_participants ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  game_state JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.room_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

CREATE POLICY "Anyone can view rooms" ON public.rooms
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can create rooms" ON public.rooms
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Participants can update rooms" ON public.rooms
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.room_participants rp 
      WHERE rp.room_id = rooms.id AND rp.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view participants" ON public.room_participants
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can join rooms" ON public.room_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
