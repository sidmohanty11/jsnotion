import React from 'react';
import { useTypedSelector } from '../../hooks';
import { AddCell } from '../AddCell';
import { CellListItem } from '../CellListItem';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells }) => {
    return cells!.order.map((id: string) => cells!.data[id]);
  });

  const renderedCells = cells.map((cell) => (
    <React.Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} />
    </React.Fragment>
  ));

  return (
    <div>
      <AddCell forceVisible={cells.length === 0} prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
