import { useEffect, useState } from 'react';
import bundler from '../../bundler';
import { CodeEditor } from '../CodeEditor';
import { Preview } from '../Preview';
import { Resizable } from '../Resizable';

const CodeCell = () => {
  const [input, setInput] = useState<string>('');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundler(input);
      setCode(output);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="// write your code here"
            onChange={(value: string | undefined, ev) => {
              if (value) {
                setInput(value);
              }
            }}
          />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
