const API_URL = 'http://localhost:8000/api';

/**
 * 分析代码生成流程图
 * @param {string} code - 源代码
 * @param {string} language - 编程语言
 * @param {string} description - 描述(可选)
 * @returns {Promise} - 返回结果Promise
 */
async function analyzeCode(code, language, description = '') {
    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language, description }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '分析代码时发生错误');
        }
        
        return await response.json();
    } catch (error) {
        console.error('分析代码失败:', error);
        throw error;
    }
}

/**
 * 保存流程图
 * @param {Object} flowchart - 流程图数据
 * @returns {Promise} - 返回结果Promise
 */
async function saveFlowchart(flowchart) {
    try {
        const response = await fetch(`${API_URL}/flowcharts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flowchart),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '保存流程图时发生错误');
        }
        
        return await response.json();
    } catch (error) {
        console.error('保存流程图失败:', error);
        throw error;
    }
}

/**
 * 获取所有流程图
 * @returns {Promise} - 返回结果Promise
 */
async function getFlowcharts() {
    try {
        const response = await fetch(`${API_URL}/flowcharts`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '获取流程图列表时发生错误');
        }
        
        return await response.json();
    } catch (error) {
        console.error('获取流程图列表失败:', error);
        throw error;
    }
}

/**
 * 获取单个流程图
 * @param {string} id - 流程图ID
 * @returns {Promise} - 返回结果Promise
 */
async function getFlowchart(id) {
    try {
        const response = await fetch(`${API_URL}/flowcharts/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '获取流程图时发生错误');
        }
        
        return await response.json();
    } catch (error) {
        console.error('获取流程图失败:', error);
        throw error;
    }
}

/**
 * 删除流程图
 * @param {string} id - 流程图ID
 * @returns {Promise} - 返回结果Promise
 */
async function deleteFlowchart(id) {
    try {
        const response = await fetch(`${API_URL}/flowcharts/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '删除流程图时发生错误');
        }
        
        return await response.json();
    } catch (error) {
        console.error('删除流程图失败:', error);
        throw error;
    }
}