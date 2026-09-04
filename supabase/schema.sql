-- ==============================================================================
-- IFBBC REAL-TIME PRAYER WALL SCHEMA & REALTIME SETUP (IDEMPOTENT & SAFE TO RE-RUN)
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Prayers Table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  request TEXT NOT NULL,
  author TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false NOT NULL,
  duration TEXT NOT NULL DEFAULT '30d',
  duration_label TEXT NOT NULL DEFAULT '1 Month',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  prayed_count INTEGER DEFAULT 0 NOT NULL,
  is_approved BOOLEAN DEFAULT true NOT NULL
);

-- 2. Safely ensure category & duration check constraints
ALTER TABLE public.prayers DROP CONSTRAINT IF EXISTS prayers_category_check;
ALTER TABLE public.prayers ADD CONSTRAINT prayers_category_check 
  CHECK (category IN ('church', 'provision', 'spiritual', 'healing', 'family', 'missions', 'thanksgiving', 'general'));

ALTER TABLE public.prayers DROP CONSTRAINT IF EXISTS prayers_duration_check;
ALTER TABLE public.prayers ADD CONSTRAINT prayers_duration_check 
  CHECK (duration IN ('7d', '30d', '365d'));

-- 3. Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_prayers_approved_expires 
  ON public.prayers (is_approved, expires_at DESC, created_at DESC);

-- 4. Atomic RPC function to increment / decrement prayer intercession counter
CREATE OR REPLACE FUNCTION public.increment_prayed_count(prayer_id UUID, delta INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.prayers
  SET prayed_count = GREATEST(0, prayed_count + delta)
  WHERE id = prayer_id
  RETURNING prayed_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they already exist (prevents Error 42710)
DROP POLICY IF EXISTS "Public can view active prayers" ON public.prayers;
DROP POLICY IF EXISTS "Public can insert prayer requests" ON public.prayers;

-- Recreate policies cleanly
CREATE POLICY "Public can view active prayers"
  ON public.prayers FOR SELECT
  USING (is_approved = true AND expires_at > now());

CREATE POLICY "Public can insert prayer requests"
  ON public.prayers FOR INSERT
  WITH CHECK (true);

-- 7. Safely enable Realtime updates broadcast (without duplicate error)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'prayers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.prayers;
  END IF;
END $$;

-- 8. Insert the initial Church Provision prayer if not already present
INSERT INTO public.prayers (
  category,
  category_label,
  request,
  author,
  is_anonymous,
  duration,
  duration_label,
  created_at,
  expires_at,
  prayed_count,
  is_approved
) 
SELECT 
  'church',
  'Church Provision',
  'Aircon Provision for IFBBC — Earnestly praying and trusting the Lord for the provision of air conditioning units in our IFBBC worship hall and sanctuary, creating a comfortable, welcoming, and conducive environment for all worshippers, families, and guests as they hear the Word of God.',
  'IFBBC',
  false,
  '365d',
  '1 Year',
  now(),
  now() + interval '365 days',
  0,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.prayers WHERE request LIKE 'Aircon Provision for IFBBC%'
);
