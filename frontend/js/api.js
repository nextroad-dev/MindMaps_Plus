// API 通信
const API_URL = 'http://localhost:8000/api';

// 分析代码
async function analyzeCode(code, language) {
    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                language: language
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 错误:', errorText);
            throw new Error(`API请求失败: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('分析代码时出错:', error);
        throw error;
    }
}

// 保存流程图
async function saveFlowchart(title, description, codeSnippet, language, mermaidCode) {
    try {
        // 关键修改：字段名称从驼峰命名改为下划线命名
        const now = new Date().toISOString();
        const payload = {
            title: title || "未命名流程图",
            description: description || "",
            code_snippet: codeSnippet || "",  // 修改为下划线命名
            language: language || "",
            mermaid_code: mermaidCode || "",  // 修改为下划线命名
            created_at: now,  // 修改为下划线命名
            updated_at: now   // 修改为下划线命名
        };

        console.log("发送保存请求: ", payload);  // 调试用

        const response = await fetch(`${API_URL}/flowcharts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            if (response.headers.get("content-type")?.includes("application/json")) {
                const errorData = await response.json();
                console.error("保存错误详情:", errorData);
                throw new Error(errorData.detail || '保存流程图时发生错误');
            } else {
                const errorText = await response.text();
                console.error("保存错误响应:", errorText);
                throw new Error(`保存失败: ${response.status}`);
            }
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