import React from 'react';
import { useTypedSelector } from '../../hooks';
import { CellListItem } from '../CellListItem';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells }) => {
    return cells!.order.map((id: string) => cells!.data[id]);
  });

  const renderedCells = cells.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
