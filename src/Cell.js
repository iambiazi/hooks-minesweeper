import React from 'react';

const Cell = ({cells, row, checkCell, size, flagMine}) => {
  return (
    <tr>
      {cells.map((cell, idx) => {
        return <td
          key={idx}
          id={(row * size) + idx}
          onClick={() => checkCell((row * size) + idx)}
          onContextMenu={(e) => flagMine(e, (row * size) + idx)}
          className={
            typeof cell === 'string' && cell !== 'x' ? 'flagged'
              : cell === -size ? 'flipped'
              : cell < 0 ? 'touching'
              : 'not-flipped'}>{
            cell < 0 ? Math.abs(cell)
              : ''}</td>
      })}
    </tr>
  )
};

export default Cell;
