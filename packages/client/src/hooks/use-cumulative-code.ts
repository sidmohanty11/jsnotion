import { useTypedSelector } from '.';

const useCumulativeCode = (cellID: string) => {
  return useTypedSelector((state) => {
    if (state.cells) {
      const { data, order } = state.cells;
      const orderedCells = order.map((id) => data[id]);
      const showFn = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const _root_ = document.querySelector('#root');
        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, _root_);
          } else {
            _root_.innerHTML = JSON.stringify(value);
          }
        } else {
        _root_.innerHTML = value;
        }
      }
    `;
      const showFnNoop = 'var show = () => {}';
      const cc = [];
      for (let c of orderedCells) {
        if (c.type === 'code') {
          if (c.id === cellID) {
            cc.push(showFn);
          } else {
            cc.push(showFnNoop);
          }
          cc.push(c.content);
        }
        if (c.id === cellID) {
          break;
        }
      }
      return cc;
    }
  })?.join('\n');
};

export default useCumulativeCode;
