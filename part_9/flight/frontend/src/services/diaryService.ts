import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = '/api/diaries';

export const getDiaries = async (): Promise<DiaryEntry[]> => {
  const res = await fetch(baseUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch diaries: ${res.statusText}`);
  }
  const data: DiaryEntry[] = await res.json();
  return data;
};

export const addDiary = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error (`Failed to add diary: ${text}`);
  }

  const data: DiaryEntry = await res.json();
  return data;
};