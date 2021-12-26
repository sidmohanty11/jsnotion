import { useState } from 'react';
import bundler from '../../bundler';
import { CodeEditor } from '../CodeEditor';
import { Preview } from '../Preview';
import { Resizable } from '../Resizable';

const CodeCell = () => {
  const [input, setInput] = useState<string | undefined>('');
  const [code, setCode] = useState<string>('');

  const transform = async () => {
    const output = await bundler(input);
    setCode(output);
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex' }}>
        <CodeEditor
          initialValue="// write your code here"
          onChange={(value: string | undefined, ev) => {
            setInput(value);
          }}
        />
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
