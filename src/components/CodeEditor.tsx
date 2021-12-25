import MonacoEditor from '@monaco-editor/react';

const CodeEditor = () => {
  return (
    <MonacoEditor
      height="500px"
      defaultLanguage="javascript"
      defaultValue="// write your code here!"
      theme="vs-dark"
    />
  );
};

export default CodeEditor;
