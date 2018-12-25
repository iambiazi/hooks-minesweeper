import React, { useEffect } from 'react';

const HighScore = () => {

  const scores = JSON.parse(localStorage.getItem('highScore')) || [];

  return (
    <div id='high-score'>
      <p>High Scores </p>
    {scores.map((score, idx) => {
      return <div key={idx}>{score.username}{' '}{score.time}</div>
      })}
    </div>
  )
};

export default HighScore;
