import React, { useState } from 'react';
import { Weather, Visibility, NewDiaryEntry } from '../types';

interface Props {
  onSubmit: (entry: NewDiaryEntry) => Promise<void>;
}

const NewDiaryForm: React.FC<Props> = ({ onSubmit }) => {
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
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
      setVisibility(Visibility.Great);
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date</label>
        <input 
          type="date" 
          value={date} 
          id="date" 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>

      <div>
        <h4>Weather</h4>
        {Object.values(Weather).map(w => (
          <label key={w}>
            <input
              type="radio"
              name='weather'
              value={w}
              checked={weather === w} 
              onChange={() => setWeather(w)}
            />
            {w}
          </label>
        ))}
      </div>

      <div>
        <h4>Visibility</h4>
        {Object.values(Visibility).map(v => (
          <label key={v}>
            <input
              type="radio"
              name='visibility'
              value={v}
              checked={visibility === v}
              onChange={() => setVisibility(v)}
            />
            {v}
          </label>
        ))}
      </div>

      <div>
        <label>Comment</label>
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