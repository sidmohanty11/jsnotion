import React, { useEffect, useState } from 'react';
import bundler from '../../bundler';
import { Cell } from '../../state';
import { CodeEditor } from '../CodeEditor';
import { Preview } from '../Preview';
import { Resizable } from '../Resizable';
import { useActions, useTypedSelector } from '../../hooks';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: 'calc(100% - 10px)', display: 'flex' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value: string | undefined, ev) => {
              if (value) {
                updateCell(cell.id, value);
              }
            }}
          />
        </Resizable>
        <Preview code={bundle.code} status={bundle.err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
