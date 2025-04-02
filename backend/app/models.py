from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class CodeSubmission(BaseModel):
    """代码提交模型"""
    code: str
    language: str = "python"

class FlowchartResponse(BaseModel):
    """流程图响应模型"""
    mermaid_code: str

class SavedFlowchart(BaseModel):
    """保存的流程图模型"""
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    code_snippet: str
    language: str
    mermaid_code: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ErrorResponse(BaseModel):
    """错误响应模型"""
    detail: str