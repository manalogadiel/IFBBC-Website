import { createClient } from '@supabase/supabase-js';

const url = 'https://fzaiakulrtsqqrsbrcju.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6YWlha3VscnRzcXFyc2JyY2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA3MzYsImV4cCI6MjEwNDA2NjczNn0.TKabX6o1b3l3lIUoII7P0BIz7ViC8GawMajJvDe2Tko';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('prayers').select('*');
  if (error) {
    console.error('Query Error:', error);
  } else {
    console.log('SUCCESS! Prayers table found. Total rows:', data.length);
    console.log('Data:', JSON.stringify(data, null, 2));
  }
}

test();
