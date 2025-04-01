import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const CodeEditor = ({ setCode }) => {
  const [code, setLocalCode] = useState("");

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">输入代码</h2>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[python()]}
        theme={vscodeDark}
        onChange={(value) => {
          setLocalCode(value);
          setCode(value);
        }}
      />
    </div>
  );
};

export default CodeEditor;
