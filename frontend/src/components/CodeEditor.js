import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

const CodeEditor = ({ setCode }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: '# 在此处输入Python代码\n\ndef example():\n    print("Hello World!")\n    return True',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
      });

      // 当编辑器内容改变时更新code状态
      editorRef.current.onDidChangeModelContent(() => {
        setCode(editorRef.current.getValue());
      });
      
      // 初始化时设置初始值
      setCode(editorRef.current.getValue());
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [setCode]);

  return (
    <div className="w-full max-w-4xl">
      <div 
        ref={containerRef} 
        className="border border-gray-300 rounded-md" 
        style={{ height: '400px' }}
      />
    </div>
  );
};

export default CodeEditor;
