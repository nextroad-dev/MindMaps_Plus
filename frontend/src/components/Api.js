const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 分析代码并生成流程图
 * @param {string} code - 要分析的代码
 * @param {string} language - 编程语言
 * @returns {Promise<Object>} - 包含流程图的响应
 */
export const analyzeCode = async (code, language) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '请求失败');
    }

    const data = await response.json();
    return { flowchart: data.mermaid_code };
  } catch (error) {
    console.error('API错误:', error);
    throw error;
  }
};

/**
 * 获取所有保存的流程图
 * @returns {Promise<Array>} - 流程图数组
 */
export const getFlowcharts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/flowcharts`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '请求失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API错误:', error);
    throw error;
  }
};
