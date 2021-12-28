import './CodeEditor.css';
import MonacoEditor, { OnChange, OnMount } from '@monaco-editor/react';
import React, { useRef } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface CodeEditorProps {
  initialValue: string;
  onChange: OnChange | undefined;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount | undefined = (editor, monaco) => {
    editorRef.current = editor;
  };

  const onClickFormat = () => {
    const unformatted = editorRef.current.getModel().getValue();

    // format
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');

    // set the formatted value
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onClickFormat}
      >
        Format
      </button>
      <MonacoEditor
        onMount={handleEditorDidMount}
        height="100%"
        defaultLanguage="javascript"
        value={initialValue}
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
          tabSize: 2,
          fontFamily: 'Red Hat Mono, monospace',
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;
