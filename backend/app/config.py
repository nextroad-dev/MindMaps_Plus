import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # OpenAI 配置
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
    OPENAI_API_BASE: str = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
    
    # 应用配置
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    API_PREFIX: str = "/api"
    
    # CORS 配置
    CORS_ORIGINS: list = ["http://localhost:3000", "https://yourdomain.com"]
    
    # 数据库配置 (使用SQLite作为示例)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./flowcharts.db")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# 导出变量以兼容现有代码
OPENAI_API_KEY = settings.OPENAI_API_KEY
OPENAI_MODEL = settings.OPENAI_MODEL
OPENAI_API_BASE = settings.OPENAI_API_BASE
