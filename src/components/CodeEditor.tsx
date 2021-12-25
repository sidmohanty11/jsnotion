import MonacoEditor from '@monaco-editor/react';

const CodeEditor = () => {
  return (
    <MonacoEditor
      height="500px"
      defaultLanguage="javascript"
      defaultValue="// write your code here!"
      theme="vs-dark"
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        showUnused: false,
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 20,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
