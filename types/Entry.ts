export type SleepRecord = {
  id: number;
  weekday: string;
  sleep_hours_string: string;
  sleep_hours_short: string;
  date: string; // Formato "YYYY-MM-DD"
  age: number;
  gender: 'Male' | 'Female' | 'Other' | string; // Permite valores comuns, mas também outros strings
  sleep_start_time: string; // Formato "HH:MM:SS"
  sleep_end_time: string;   // Formato "HH:MM:SS"
  total_sleep_hours: number;
  sleep_quality: number | null;
  exercise: number | null; // Assumindo que pode ser a duração em minutos
  caffeine_intake: number | null;
  screen_time: number | null;
  work_hours: number | null;
  productivity_score: number | null;
  mood_score: number | null;
  stress_level: number | null;
  created_at: string; // Formato ISO 8601
  updated_at: string; // Formato ISO 8601
  author: number; // ID do usuário autor
};