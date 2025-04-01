import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

const FlowchartView = ({ mermaidCode }) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, [mermaidCode]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">生成的流程图</h2>
      <div className="border p-4">
        <div className="mermaid">{mermaidCode}</div>
      </div>
    </div>
  );
};

export default FlowchartView;
