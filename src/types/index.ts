export type Theme = 'light' | 'dark';

export interface ServiceItem {
  id: string;
  time: string;
  name: string;
  category: string;
  description: string;
  location: string;
  room: string;
  features: string[];
  streaming: boolean;
  status: 'upcoming' | 'live' | 'completed';
}

export interface SermonItem {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  scripture: string;
  series: string;
  audioUrl: string;
  transcript: string;
  notesSummary: string[];
}

export interface MinistryItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  schedule: string;
  colSpan: string;
  details: string[];
}
