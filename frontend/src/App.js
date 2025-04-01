import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import FlowchartView from "./components/FlowchartView";
import { analyzeCode } from "./components/Api";

const App = () => {
  const [code, setCode] = useState("");
  const [flowchart, setFlowchart] = useState("");

  const handleAnalyze = async () => {
    try {
      const result = await analyzeCode(code, "python");
      setFlowchart(result.flowchart); // Mermaid 代码
    } catch (error) {
      alert("分析失败");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">代码分析流程图</h1>
      <CodeEditor setCode={setCode} />
      <button onClick={handleAnalyze} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        生成流程图
      </button>
      {flowchart && <FlowchartView mermaidCode={flowchart} />}
    </div>
  );
};

export default App;
