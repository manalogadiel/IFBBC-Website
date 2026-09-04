import { createClient } from '@supabase/supabase-js';

const url = 'https://fzaiakulrtsqqrsbrcju.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6YWlha3VscnRzcXFyc2JyY2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA3MzYsImV4cCI6MjEwNDA2NjczNn0.TKabX6o1b3l3lIUoII7P0BIz7ViC8GawMajJvDe2Tko';

const supabase = createClient(url, key);

async function testOps() {
  console.log('1. Testing insert with category church...');
  const { data: inserted, error: insertError } = await supabase.from('prayers').insert([{
    category: 'church',
    category_label: 'Church Provision',
    request: 'Verification Test Prayer',
    author: 'Tester',
    is_anonymous: false,
    duration: '7d',
    duration_label: '1 Week',
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    prayed_count: 1,
    is_approved: true
  }]).select().single();

  if (insertError) {
    console.error('Insert error:', insertError);
    return;
  }
  console.log('Insert SUCCESS:', inserted.id);

  console.log('2. Testing increment_prayed_count RPC...');
  const { data: rpcData, error: rpcError } = await supabase.rpc('increment_prayed_count', {
    prayer_id: inserted.id,
    delta: 1
  });
  if (rpcError) {
    console.warn('RPC Error (optional, fallback handles this anyway):', rpcError);
  } else {
    console.log('RPC SUCCESS, new prayed count:', rpcData);
  }

  console.log('3. Cleaning up test row...');
  await supabase.from('prayers').delete().eq('id', inserted.id);
  console.log('Cleanup finished!');
}

testOps();
