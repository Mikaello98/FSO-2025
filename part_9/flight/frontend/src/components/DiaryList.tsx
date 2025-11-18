import React from 'react';
import { DiaryEntry } from '../types';

interface Props {
  diaries: DiaryEntry[];
}

const DiaryList: React.FC<Props> = ({ diaries }) => (
  <div>
    <h2>Diary entries</h2>
    {diaries.map(d => (
      <div key={d.id}>
        <p><strong>{d.date}</strong></p>
        <p>Weather: {d.weather}</p>
        <p>Visibility: {d.visibility}</p>
        <p>Comment: {d.comment}</p>
        <hr />
      </div>
    ))}
  </div>
);

export default DiaryList;