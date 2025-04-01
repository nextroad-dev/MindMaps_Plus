import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const FlowchartView = ({ mermaidCode }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && mermaidCode) {
      mermaid.initialize({ startOnLoad: true });
      
      try {
        // 清空容器
        containerRef.current.innerHTML = '';
        
        // 生成唯一ID
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        // 创建流程图容器
        const element = document.createElement('div');
        element.id = id;
        element.className = 'mermaid';
        element.textContent = mermaidCode;
        containerRef.current.appendChild(element);
        
        // 渲染流程图
        mermaid.run({ nodes: [element] });
      } catch (error) {
        console.error('流程图渲染失败:', error);
        containerRef.current.innerHTML = `
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>渲染失败</strong>
            <p>无法渲染流程图，可能是Mermaid代码格式错误</p>
            <pre class="mt-2 p-2 bg-gray-100 overflow-x-auto">${mermaidCode}</pre>
          </div>
        `;
      }
    }
  }, [mermaidCode]);

  return (
    <div className="w-full max-w-4xl mt-8 bg-white p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">生成的流程图</h2>
      <div ref={containerRef} className="overflow-x-auto" />
    </div>
  );
};

export default FlowchartView;
