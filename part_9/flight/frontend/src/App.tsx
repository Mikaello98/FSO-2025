import React, { useEffect, useState } from 'react';
import DiaryList from './components/DiaryList';
import NewDiaryForm from './components/NewDiaryForm';
import { getDiaries, addDiary } from './services/diaryService';
import { DiaryEntry, NewDiaryEntry } from './types';

const App: React.FC = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setError(null);
      try {
        const data = await getDiaries();
        setDiaries(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const handleAdd = async (entry: NewDiaryEntry): Promise<void> => {
    const added = await addDiary(entry);
    setDiaries((prev) => [...prev, added]);
  };

  return (
    <div>
      <header>
        <h1>Ilari's Flight Diaries</h1>
      </header>
      <main>
        <section>
          <h2>Add entry</h2>
          <NewDiaryForm onSubmit={handleAdd} />
        </section>

        <section>
          <h2>Entries</h2>
          {loading && <p>Loading diaries...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && <DiaryList diaries={diaries} />}
        </section>
      </main>
    </div>
  );
};

export default App;