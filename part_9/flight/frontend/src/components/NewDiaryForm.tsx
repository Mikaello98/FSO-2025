import React, { useState } from 'react';
import { Weather, Visibility, NewDiaryEntry } from '../types';

interface Props {
  onSubmit: (entry: NewDiaryEntry) => Promise<void>;
}

const NewDiaryForm: React.FC<Props> = ({ onSubmit }) => {
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    try {
      await onSubmit(newEntry);
      setDate('');
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Good);
      setComment('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='new-diary-form'>
      <div className='form-row'>
        <label htmlFor="date">Date</label>
        <input 
          type="date" 
          value={date} 
          id="date" 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>

      <div className='form-row'>
        <label htmlFor="weather">Weather</label>
        <select value={weather} id="weather" onChange={(e) => setWeather(e.target.value as Weather)}>
          {Object.values(Weather).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div className='form-row'>
        <label htmlFor="visibility">Visibility</label>
        <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
          {Object.values(Visibility).map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className='form-row'>
        <label htmlFor="comment">Comment</label>
        <textarea 
          id="comment" 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          required 
          rows={3}
        />
      </div>

      {error && <div className='error'>{error}</div>}

      <button type='submit' disabled={submitting}>
        {submitting ? 'Adding...' : 'Add diary'}
      </button>
    </form>
  );
};

export default NewDiaryForm