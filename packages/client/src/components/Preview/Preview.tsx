import './Preview.css';
import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  status: string;
}

const frame = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
              const rootEl = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error:</h4>' + err + '</div>';
              console.error(err);
          }
          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, status: error }) => {
  const iframe = useRef<any>(null);

  useEffect(() => {
    // reset iframe
    iframe.current.srcdoc = frame;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="preview"
        srcDoc={frame}
        sandbox="allow-scripts"
      ></iframe>
      {error && <div className="preview-error">{error}</div>}
    </div>
  );
};

export default Preview;
