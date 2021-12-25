import { useState } from 'react';
import bundler from '../../bundler';
import { CodeEditor } from '../CodeEditor';
import { Preview } from '../Preview';

const CodeCell = () => {
  const [input, setInput] = useState<string | undefined>('');
  const [code, setCode] = useState<string>('');

  const transform = async () => {
    const output = await bundler(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="// write your code here"
        onChange={(value: string | undefined, ev) => {
          setInput(value);
        }}
      />
      <div>
        <button onClick={transform}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
