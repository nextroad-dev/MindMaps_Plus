import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import FlowchartView from "./components/FlowchartView";
import { analyzeCode } from "./components/Api";

const App = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [flowchart, setFlowchart] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("请先输入代码");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeCode(code, language);
      setFlowchart(result.flowchart);
    } catch (error) {
      setError(error.message || "分析失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">MindMaps Plus - 代码分析流程图</h1>
      
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">代码输入</h2>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      
      <CodeEditor setCode={setCode} />
      
      {error && (
        <div className="w-full max-w-4xl mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        className={`mt-6 px-6 py-3 rounded text-white font-semibold ${
          loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? '生成中...' : '生成流程图'}
      </button>
      
      {flowchart && <FlowchartView mermaidCode={flowchart} />}
    </div>
  );
};

export default App;
