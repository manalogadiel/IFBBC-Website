-- ==============================================================================
-- IFBBC REAL-TIME PRAYER WALL SCHEMA & REALTIME SETUP
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Prayers Table
CREATE TABLE IF NOT EXISTS public.prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('spiritual', 'healing', 'family', 'missions', 'thanksgiving', 'general')),
  category_label TEXT NOT NULL,
  request TEXT NOT NULL,
  author TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false NOT NULL,
  duration TEXT NOT NULL DEFAULT '30d' CHECK (duration IN ('7d', '30d', '365d')),
  duration_label TEXT NOT NULL DEFAULT '1 Month',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  prayed_count INTEGER DEFAULT 0 NOT NULL,
  is_approved BOOLEAN DEFAULT true NOT NULL
);

-- 2. Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_prayers_approved_expires 
  ON public.prayers (is_approved, expires_at DESC, created_at DESC);

-- 3. Atomic RPC function to increment / decrement prayer intercession counter
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

-- 5. Policies for public prayer wall
-- Allow all visitors to view approved, active prayers
CREATE POLICY "Public can view active prayers"
  ON public.prayers FOR SELECT
  USING (is_approved = true AND expires_at > now());

-- Allow visitors to submit prayer requests
CREATE POLICY "Public can insert prayer requests"
  ON public.prayers FOR INSERT
  WITH CHECK (true);

-- 6. Enable Realtime updates broadcast for the prayers table
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayers;

-- 7. Insert the initial Church Provision prayer if not already present
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
  'general',
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
