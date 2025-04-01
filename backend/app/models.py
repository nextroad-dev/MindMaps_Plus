from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class CodeSubmission(BaseModel):
    """用户提交的代码信息"""
    code: str
    language: str
    description: Optional[str] = None

class FlowchartResponse(BaseModel):
    """生成的流程图响应"""
    mermaid_code: str
    created_at: datetime = datetime.now()
    
class SavedFlowchart(BaseModel):
    """保存的流程图"""
    id: str
    title: str
    description: Optional[str] = None
    code_snippet: str
    language: str
    mermaid_code: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
class ErrorResponse(BaseModel):
    """API错误响应"""
    error: str
    detail: Optional[str] = None