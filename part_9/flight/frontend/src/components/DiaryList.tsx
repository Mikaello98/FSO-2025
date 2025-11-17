import React from 'react';
import { DiaryEntry } from '../types';

interface Props {
  diaries: DiaryEntry[];
}

const DiaryList: React.FC<Props> = ({ diaries }) => {
  if (diaries.length === 0) {
    return <p>No diary entries yet.</p>
  }

  return (
    <ul className='diary-list'>
      {diaries.map((d) => (
        <li key={d.id} className='diary-item'>
          <div className='diary-meta'>
            <strong>{d.date}</strong> - {d.weather} / {d.visibility}
          </div>
          <p className='diary-comment'>{d.comment}</p>
        </li>
      ))}
    </ul>
  );
};

export default DiaryList;