import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PrayerItem } from '../components/PrayerWallModal';

export const DEFAULT_PRAYERS: PrayerItem[] = [
  {
    id: 'p-aircon-provision',
    category: 'general',
    categoryLabel: 'Church Provision',
    request: 'Aircon Provision for IFBBC — Earnestly praying and trusting the Lord for the provision of air conditioning units in our IFBBC worship hall and sanctuary, creating a comfortable, welcoming, and conducive environment for all worshippers, families, and guests as they hear the Word of God.',
    author: 'IFBBC',
    isAnonymous: false,
    duration: '365d',
    durationLabel: '1 Year',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 363,
    prayedCount: 0,
  },
];

const LOCAL_STORAGE_KEY = 'ifbbc-prayer-wall-v3';
const USER_PRAYED_STORAGE_KEY = 'ifbbc-user-prayed-prayer-ids';

/**
 * Gets the list of prayer IDs that the current visitor has personally prayed for.
 */
export function getLocalUserPrayedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(USER_PRAYED_STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

/**
 * Saves the set of prayer IDs that the current visitor has prayed for.
 */
export function saveLocalUserPrayedIds(ids: Set<string>): void {
  try {
    localStorage.setItem(USER_PRAYED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (err) {
    console.error('Failed to save user prayed IDs to localStorage:', err);
  }
}

/**
 * Maps a Supabase DB row to our frontend PrayerItem model.
 */
function mapRowToPrayer(row: any, userPrayedSet: Set<string>): PrayerItem {
  return {
    id: row.id,
    category: row.category,
    categoryLabel: row.category_label,
    request: row.request,
    author: row.author,
    isAnonymous: row.is_anonymous,
    duration: row.duration,
    durationLabel: row.duration_label,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime(),
    prayedCount: Number(row.prayed_count) || 0,
    hasUserPrayed: userPrayedSet.has(row.id),
  };
}

/**
 * Fetch all active, approved prayers.
 * Uses Supabase when available, with automatic fallback to localStorage.
 */
export async function getPrayers(): Promise<PrayerItem[]> {
  const userPrayedSet = getLocalUserPrayedIds();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .eq('is_approved', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getPrayers error, falling back to local storage:', error.message);
      } else if (data && data.length > 0) {
        return data.map((row) => mapRowToPrayer(row, userPrayedSet));
      } else if (data && data.length === 0) {
        // Database is connected but empty; return default church petition
        return DEFAULT_PRAYERS.map((p) => ({
          ...p,
          hasUserPrayed: userPrayedSet.has(p.id),
        }));
      }
    } catch (err) {
      console.warn('Supabase connection failed, falling back to local storage:', err);
    }
  }

  // Fallback to localStorage
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed: PrayerItem[] = JSON.parse(saved);
      return parsed.map((item) => ({
        ...item,
        hasUserPrayed: userPrayedSet.has(item.id),
      }));
    }
  } catch (err) {
    console.error('Failed to load local prayers:', err);
  }

  return DEFAULT_PRAYERS.map((p) => ({
    ...p,
    hasUserPrayed: userPrayedSet.has(p.id),
  }));
}

/**
 * Submit a new prayer request.
 * Broadcasts to all users via Supabase, or saves locally if offline.
 */
export async function submitPrayer(newPrayer: {
  category: PrayerItem['category'];
  categoryLabel: string;
  request: string;
  author: string;
  isAnonymous: boolean;
  duration: '7d' | '30d' | '365d';
  durationLabel: string;
}): Promise<PrayerItem> {
  const now = Date.now();
  const durationDays = newPrayer.duration === '7d' ? 7 : newPrayer.duration === '30d' ? 30 : 365;
  const expiresAt = now + 1000 * 60 * 60 * 24 * durationDays;

  const userPrayedSet = getLocalUserPrayedIds();

  if (isSupabaseConfigured && supabase) {
    try {
      const insertPayload = {
        category: newPrayer.category,
        category_label: newPrayer.categoryLabel,
        request: newPrayer.request,
        author: newPrayer.author,
        is_anonymous: newPrayer.isAnonymous,
        duration: newPrayer.duration,
        duration_label: newPrayer.durationLabel,
        created_at: new Date(now).toISOString(),
        expires_at: new Date(expiresAt).toISOString(),
        prayed_count: 1, // Author starts with 1 prayer count
        is_approved: true,
      };

      const { data, error } = await supabase
        .from('prayers')
        .insert([insertPayload])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        userPrayedSet.add(data.id);
        saveLocalUserPrayedIds(userPrayedSet);
        return mapRowToPrayer(data, userPrayedSet);
      }
    } catch (err) {
      console.warn('Supabase submitPrayer failed, falling back to local storage:', err);
    }
  }

  // Local fallback
  const fallbackItem: PrayerItem = {
    id: `p-${now}-${Math.random().toString(36).substr(2, 4)}`,
    category: newPrayer.category,
    categoryLabel: newPrayer.categoryLabel,
    request: newPrayer.request,
    author: newPrayer.author,
    isAnonymous: newPrayer.isAnonymous,
    duration: newPrayer.duration,
    durationLabel: newPrayer.durationLabel,
    createdAt: now,
    expiresAt,
    prayedCount: 1,
    hasUserPrayed: true,
  };

  userPrayedSet.add(fallbackItem.id);
  saveLocalUserPrayedIds(userPrayedSet);

  return fallbackItem;
}

/**
 * Toggle "I Prayed for This" for a prayer item.
 * Increments or decrements count on the cloud database, and updates local state.
 */
export async function togglePrayedCount(
  prayerId: string,
  currentlyPrayed: boolean
): Promise<{ success: boolean; newCountDelta: number }> {
  const delta = currentlyPrayed ? -1 : 1;
  const userPrayedSet = getLocalUserPrayedIds();

  if (currentlyPrayed) {
    userPrayedSet.delete(prayerId);
  } else {
    userPrayedSet.add(prayerId);
  }
  saveLocalUserPrayedIds(userPrayedSet);

  if (isSupabaseConfigured && supabase) {
    try {
      // First attempt RPC function if present
      const { error: rpcError } = await supabase.rpc('increment_prayed_count', {
        prayer_id: prayerId,
        delta,
      });

      if (rpcError) {
        // Fallback: direct update
        const { data: currentItem } = await supabase
          .from('prayers')
          .select('prayed_count')
          .eq('id', prayerId)
          .single();

        if (currentItem) {
          const updatedCount = Math.max(0, (currentItem.prayed_count || 0) + delta);
          await supabase
            .from('prayers')
            .update({ prayed_count: updatedCount })
            .eq('id', prayerId);
        }
      }
      return { success: true, newCountDelta: delta };
    } catch (err) {
      console.warn('Supabase togglePrayedCount failed, returning local state:', err);
    }
  }

  return { success: true, newCountDelta: delta };
}

/**
 * Subscribe to real-time changes on the prayers table.
 * Returns an unsubscribe callback.
 */
export function subscribeToPrayers(
  onInsert: (item: PrayerItem) => void,
  onUpdate: (item: Partial<PrayerItem> & { id: string }) => void,
  onDelete: (deletedId: string) => void
): () => void {
  const client = supabase;
  if (!isSupabaseConfigured || !client) {
    return () => {};
  }

  const channel = client
    .channel('ifbbc-prayer-wall-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'prayers' },
      (payload) => {
        const userPrayedSet = getLocalUserPrayedIds();
        const item = mapRowToPrayer(payload.new, userPrayedSet);
        onInsert(item);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'prayers' },
      (payload) => {
        const updated = payload.new;
        onUpdate({
          id: updated.id,
          prayedCount: Number(updated.prayed_count) || 0,
          request: updated.request,
          category: updated.category,
          categoryLabel: updated.category_label,
          author: updated.author,
          isAnonymous: updated.is_anonymous,
          expiresAt: new Date(updated.expires_at).getTime(),
        });
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'prayers' },
      (payload) => {
        if (payload.old?.id) {
          onDelete(payload.old.id);
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
