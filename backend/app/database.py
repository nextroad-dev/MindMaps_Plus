import uuid
from datetime import datetime
from typing import List, Optional, Dict

from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings
from app.models import SavedFlowchart

# 创建SQLAlchemy引擎和会话
engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 定义SQLAlchemy模型
class FlowchartModel(Base):
    __tablename__ = "flowcharts"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    code_snippet = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    mermaid_code = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 依赖项：获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CRUD操作函数
def save_flowchart(flowchart: SavedFlowchart, db: Session) -> SavedFlowchart:
    """保存流程图"""
    if not flowchart.id:
        flowchart.id = str(uuid.uuid4())
    
    # 设置时间戳
    now = datetime.now()
    if not flowchart.created_at:
        flowchart.created_at = now
    flowchart.updated_at = now
    
    # 检查是否已存在
    existing = db.query(FlowchartModel).filter(FlowchartModel.id == flowchart.id).first()
    
    if existing:
        # 更新现有记录
        existing.title = flowchart.title
        existing.description = flowchart.description
        existing.code_snippet = flowchart.code_snippet
        existing.language = flowchart.language
        existing.mermaid_code = flowchart.mermaid_code
        existing.updated_at = flowchart.updated_at
        db_flowchart = existing
    else:
        # 创建新记录
        db_flowchart = FlowchartModel(
            id=flowchart.id,
            title=flowchart.title,
            description=flowchart.description,
            code_snippet=flowchart.code_snippet,
            language=flowchart.language,
            mermaid_code=flowchart.mermaid_code,
            created_at=flowchart.created_at,
            updated_at=flowchart.updated_at
        )
        db.add(db_flowchart)
    
    db.commit()
    db.refresh(db_flowchart)
    
    return SavedFlowchart(
        id=db_flowchart.id,
        title=db_flowchart.title,
        description=db_flowchart.description,
        code_snippet=db_flowchart.code_snippet,
        language=db_flowchart.language,
        mermaid_code=db_flowchart.mermaid_code,
        created_at=db_flowchart.created_at,
        updated_at=db_flowchart.updated_at
    )

def get_flowchart(flowchart_id: str, db: Session) -> Optional[SavedFlowchart]:
    """获取特定流程图"""
    result = db.query(FlowchartModel).filter(FlowchartModel.id == flowchart_id).first()
    if not result:
        return None
    
    return SavedFlowchart(
        id=result.id,
        title=result.title,
        description=result.description,
        code_snippet=result.code_snippet,
        language=result.language,
        mermaid_code=result.mermaid_code,
        created_at=result.created_at,
        updated_at=result.updated_at
    )

def get_all_flowcharts(db: Session) -> List[SavedFlowchart]:
    """获取所有流程图"""
    results = db.query(FlowchartModel).all()
    return [
        SavedFlowchart(
            id=result.id,
            title=result.title,
            description=result.description,
            code_snippet=result.code_snippet,
            language=result.language,
            mermaid_code=result.mermaid_code,
            created_at=result.created_at,
            updated_at=result.updated_at
        )
        for result in results
    ]

def delete_flowchart(flowchart_id: str, db: Session) -> bool:
    """删除流程图"""
    result = db.query(FlowchartModel).filter(FlowchartModel.id == flowchart_id).first()
    if not result:
        return False
    
    db.delete(result)
    db.commit()
    return True