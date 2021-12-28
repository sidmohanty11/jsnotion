import './CodeCell.css';
import React, { useEffect } from 'react';
import { Cell } from '../../state';
import { CodeEditor } from '../CodeEditor';
import { Preview } from '../Preview';
import { Resizable } from '../Resizable';
import { useActions, useCumulativeCode, useTypedSelector } from '../../hooks';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector(
    (state) => state.bundles && state.bundles[cell.id]
  );
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    // we have to do this for the first render, else we observe delayed bundling
    if (!bundle) {
      createBundle(cell.id, cumulativeCode ?? '');
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode ?? '');
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // :( TODO: Maybe a better solution??
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: 'calc(100% - 10px)', display: 'flex' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value, ev) => {
              if (value) {
                updateCell(cell.id, value);
              }
            }}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-success" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} status={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
