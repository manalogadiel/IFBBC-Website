import { createClient } from '@supabase/supabase-js';

const url = 'https://fzaiakulrtsqqrsbrcju.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6YWlha3VscnRzcXFyc2JyY2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA3MzYsImV4cCI6MjEwNDA2NjczNn0.TKabX6o1b3l3lIUoII7P0BIz7ViC8GawMajJvDe2Tko';

const supabase = createClient(url, key);

async function listPrayers() {
  const { data, error } = await supabase
    .from('prayers')
    .select('id, request, author, category_label, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prayers:', error);
    return;
  }

  console.log('\n--- ACTIVE PRAYERS IN DATABASE ---');
  data.forEach((p, idx) => {
    console.log(`[${idx + 1}] ID: ${p.id}`);
    console.log(`    Author: ${p.author} | Category: ${p.category_label}`);
    console.log(`    Request: "${p.request}"\n`);
  });
}

listPrayers();
