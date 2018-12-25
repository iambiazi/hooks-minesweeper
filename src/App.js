import React, { Component, useState, useEffect } from 'react';
import Cell from './Cell';
import Timer from './Timer';
import Select from 'react-select';
import HighScore from './HighScore';

import './App.css';

const options = [
  {value: 8, label: 'Beginner'},
  {value: 16, label: 'Intermediate'},
  {value: 24, label: 'Expert'},
];

const App = () => {

  const [cells, setCells] = useState([]);
  const [size, setSize] = useState(8);
  const [playing, setPlaying] = useState(true);
  const [started, setStarted] = useState(false);
  const [flipped, setFlipped] = useState(0);
  const [numMines, setNumMines] = useState(10);
  const [winner, setWinner] = useState(false);

  //TODO ADD SEPARATE HIGH SCORES FOR DIFFERENT DIFFICULTIES


  useEffect(() => {
    const generated = new Set();
    const mineNum = size === 8 ? 10
                    :size === 16 ? 40
                    :99;
    setNumMines(mineNum);
    while (generated.size < mineNum) {
      const mine = Math.floor(Math.random() * (size * size));
      generated.add(mine);
    }
    const allSpaces = [];
    allSpaces.length = size * size;
    allSpaces.fill(0);

    generated.forEach(el => {
      allSpaces[el] = 'x';
    });

    const matrix = [];
    for (let i = 0; i < size; ++i) {
      matrix.push(allSpaces.slice((i * size), (i) * size + size))
    }

    for (let i = 0, len = matrix[0].length; i < len; ++i) {
      for (let j = 0; j < len; ++j) {
        if(matrix[i][j] === 'x') {
          if (j - 1 >= 0) {
            matrix[i][j - 1] += matrix[i][j - 1] !== 'x' ? 1 : '';
          }
          if (i - 1 >= 0 && j - 1 >= 0) {
            matrix[i - 1][j - 1] += matrix[i - 1][j - 1] !== 'x' ? 1 : '';
          }
          if (i - 1 >= 0) {
            matrix[i - 1][j] += matrix[i - 1][j] !== 'x' ? 1 : '';
          }
          if (i + 1 < size && j >= 0) {
            matrix[i + 1][j - 1] += matrix[i + 1][j - 1] !== 'x' ? 1 : '';
          }
          if (i + 1 < size) {
            matrix[i + 1][j] += matrix[i + 1][j] !== 'x' ? 1 : '';
          }
          if (j + 1 < size) {
            matrix[i][j + 1] += matrix[i][j + 1] !== 'x' ? 1 : '';
          }
          if (i - 1 >= 0 && j + 1 < size) {
            matrix[i - 1][j + 1] += matrix[i - 1][j + 1] !== 'x' ? 1 : '';
          }
          if (i + 1 < size && j + 1 < size) {
            matrix[i + 1][j + 1] += matrix[i + 1][j + 1] !== 'x' ? 1 : '';
          }

        }
        }
    }
    setCells(matrix);
  }, [size]);

  function flagMine(e, idx) {
    const row = Math.floor(idx / size);
    const col = idx % size;
    e.preventDefault();
    let current = [...cells];
    if (typeof current[row][col] === 'string' && current[row][col] !== 'x') {
      if (current[row][col] === 'flaggedmine') {
        current[row][col] = 'x';
      } else {
        current[row][col] = Number(current[row][col]);
      }
      setCells(current);
    } else if (current[row][col] >= 0 || typeof current[row][col] === 'string') {
      current[row][col] = current[row][col].toString();
      if (current[row][col] === 'x') {
        current[row][col] = 'flaggedmine';
      }
      setCells(current);
    }
  }

  function checkSquares(idx) {
    const i = Math.floor(idx / size);
    const j = idx % size;
    let count = 0;

    if(playing) {
      setStarted(true);
      if (cells[i][j] === 'x' || cells[i][j] === 'flaggedmine') {
        setPlaying(false);
        alert('game over');
      } else {
        const checkCell = (row, col) => {
          if (cells[row][col] !== 0) {
            let current = [...cells];
            if (current[row][col] > 0) {
              count++;
              current[row][col] = -current[row][col];
              setCells(current);
            }
          } else {
            let current = [...cells];
            if (current[row][col] === 0) {
              count++;
            }
            current[row][col] = -size;
            setCells(current);
            if (col - 1 >= 0) {
              checkCell(row, col - 1);
            }
            if (row - 1 >= 0 && col - 1 >= 0) {
              checkCell(row - 1, col - 1);
            }
            if (row - 1 >= 0) {
              checkCell(row - 1,col);
            }
            if (row + 1 < size && col - 1 >= 0) {
              checkCell(row + 1, col - 1);
            }
            if (row + 1 < size) {
              checkCell(row + 1,col);
            }
            if (col + 1 < size) {
              checkCell(row, col + 1);
            }
            if (row - 1 >= 0 && col + 1 < size) {
              checkCell(row - 1,col + 1);
            }
            if (row + 1 < size && col + 1 < size) {
              checkCell(row + 1,col + 1);
            }

          }
        };
        checkCell(i, j);
      }
    }
    setFlipped(flipped + count);
  }


  if ((size * size - flipped === numMines) && playing) {
    alert('you win');
    setWinner(true);
    setPlaying(false);
  }

  function handleChange(option) {
    setSize(option.value);
  }

  return (
    <div>
      <Timer
        playing={playing}
        started={started}
        winner={winner}
      />
      <div>Marked Mines: </div>
      <table>
        <tbody>
        {cells.map((arr, idx) => {
        return <Cell cells={arr} key={idx} row={idx} checkCell={checkSquares} size={size} flagMine={flagMine}/>
        })}
        </tbody>
      </table>
      <HighScore />
      {playing && <Select
        placeholder={'Choose Difficulty'}
        value={size}
        onChange={handleChange}
        options={options}
      />}
    </div>
  )

};

export default App;
