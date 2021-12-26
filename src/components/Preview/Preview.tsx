import './Preview.css';
import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
}

const frame = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const rootEl = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error:</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>(null);

  useEffect(() => {
    // reset iframe
    iframe.current.srcdoc = frame;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="preview"
        srcDoc={frame}
        sandbox="allow-scripts"
      ></iframe>
    </div>
  );
};

export default Preview;
