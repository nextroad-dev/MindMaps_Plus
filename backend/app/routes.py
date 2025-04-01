from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.models import CodeSubmission, FlowchartResponse, SavedFlowchart, ErrorResponse
from app.services import analyze_code
from app.database import get_db, save_flowchart, get_flowchart, get_all_flowcharts, delete_flowchart

router = APIRouter()

@router.post("/analyze", response_model=FlowchartResponse)
async def create_flowchart(submission: CodeSubmission):
    """从代码生成流程图"""
    try:
        mermaid_code = analyze_code(submission.code, submission.language)
        return FlowchartResponse(mermaid_code=mermaid_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成流程图失败: {str(e)}")

@router.post("/flowcharts", response_model=SavedFlowchart)
async def create_saved_flowchart(flowchart: SavedFlowchart, db: Session = Depends(get_db)):
    """保存流程图"""
    return save_flowchart(flowchart, db)

@router.get("/flowcharts", response_model=List[SavedFlowchart])
async def read_flowcharts(db: Session = Depends(get_db)):
    """获取所有保存的流程图"""
    return get_all_flowcharts(db)

@router.get("/flowcharts/{flowchart_id}", response_model=SavedFlowchart)
async def read_flowchart(flowchart_id: str, db: Session = Depends(get_db)):
    """获取特定流程图"""
    flowchart = get_flowchart(flowchart_id, db)
    if not flowchart:
        raise HTTPException(status_code=404, detail="找不到流程图")
    return flowchart

@router.delete("/flowcharts/{flowchart_id}")
async def remove_flowchart(flowchart_id: str, db: Session = Depends(get_db)):
    """删除流程图"""
    success = delete_flowchart(flowchart_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="找不到流程图")
    return {"status": "success", "message": "流程图已删除"}
