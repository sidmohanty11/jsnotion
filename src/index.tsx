import 'bulmaswatch/slate/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import { CodeCell } from './components/CodeCell';

const App = () => {
  return (
    <div>
      <CodeCell />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
