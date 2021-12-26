import React, { useEffect, useState } from 'react';
import bundler from '../../bundler';
import { Cell } from '../../state';
import { CodeEditor } from '../CodeEditor';
import { Preview } from '../Preview';
import { Resizable } from '../Resizable';
import { useActions } from '../../hooks';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const [error, setError] = useState('');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundler(cell.content);
      if (output) {
        setError(output.err);
        setCode(output.code);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

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
        <Preview code={code} status={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
