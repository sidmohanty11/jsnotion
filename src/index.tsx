import * as esbuild from 'esbuild-wasm';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const ref = useRef<any>(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  // get the esbuild service from public dir
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const transform = async () => {
    if (!ref.current) {
      return;
    }

    // esbuild.transform function
    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });

    setCode(result.code);
  };

  return (
    <div>
      <textarea onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={transform}>Submit</button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
