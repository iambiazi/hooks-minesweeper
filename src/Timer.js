import React, { useState, useEffect } from 'react';

let start;
let timerID;

const Timer = ({playing, started, winner}) => {
  const [elapsed, setElapsed] = useState(0);
  const [top3, setTop3] = useState([]);

  useEffect(() => {
    let parsed = JSON.parse(localStorage.getItem('highScore')) || [];
    setTop3(parsed);
  }, []);

  useEffect(() => {
    timerID = setInterval(tick, 50);
  }, []);

  if (!playing) {
    clearInterval(timerID);
  }

  useEffect(() => {
    start = Date.now();
  },[started]);

  function tick() {
    setElapsed(new Date() - start);
  }

  const soFar = Math.round(elapsed / 100);
  const seconds = started ? (soFar / 10).toFixed(1) : 0;

  if (!playing && winner) {
    if (top3.length < 3 || seconds < top3.slice(-1)[0].time) {
      let newTop = top3.slice(0, 2);
      let playerName = prompt('You got a high score! Enter your name for the Hall of Fame!') || 'nameless';
      newTop = newTop.concat({
        username: playerName,
        time: seconds,
      }).sort((a,b) => a.time - b.time);
      localStorage.setItem('highScore', JSON.stringify(newTop));
    }
  }

  return (<p>Game started <b>{seconds} seconds</b> ago.</p>);

};

export default Timer;




