import logging
from typing import Optional, Dict, Any

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import OPENAI_API_KEY, OPENAI_MODEL, OPENAI_API_BASE

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 初始化 OpenAI 客户端
client = OpenAI(
    api_key=OPENAI_API_KEY,
    base_url=OPENAI_API_BASE  # 使用自定义的API基础URL
)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def analyze_code(code: str, language: str) -> str:
    """
    调用 OpenAI API 解析代码，返回 Mermaid.js 流程图代码
    
    Args:
        code: 要分析的源代码
        language: 代码的编程语言
    
    Returns:
        str: 生成的Mermaid.js流程图代码
        
    Raises:
        Exception: 当API调用失败且重试次数用尽时
    """
    try:
        prompt = generate_prompt(code, language)
        
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "你是一位代码分析专家，擅长将代码逻辑转换为清晰的流程图。请仅返回有效的Mermaid.js代码，不要包含额外的解释或markdown格式。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3  # 降低创造性以获得更一致的输出
        )
        
        mermaid_code = response.choices[0].message.content
        return clean_mermaid_code(mermaid_code)
    
    except Exception as e:
        logger.error(f"调用OpenAI API时出错: {str(e)}")
        raise

def generate_prompt(code: str, language: str) -> str:
    """生成更精确的提示"""
    return f"""请分析以下{language}代码，并用Mermaid.js语法创建一个流程图。
    
代码:
```{language}
{code}
```

要求:
1. 只输出有效的Mermaid.js流程图代码
2. 捕捉代码中的主要控制流程和函数调用
3. 使用适当的图形元素表示条件、循环和函数
4. 保持流程图简洁清晰，避免过度复杂
5. 不要包含任何解释文本，只返回流程图代码
"""

def clean_mermaid_code(raw_code: str) -> str:
    """清理并提取Mermaid代码，移除可能的markdown标记"""
    # 移除代码块标记，如果存在
    if "```mermaid" in raw_code:
        raw_code = raw_code.split("```mermaid", 1)[1]
        if "```" in raw_code:
            raw_code = raw_code.split("```", 1)[0]
    
    # 移除前导空格和空行
    lines = [line.strip() for line in raw_code.splitlines()]
    return "\n".join(line for line in lines if line)
