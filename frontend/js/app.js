// 当前流程图数据
let currentFlowchart = null;

// Monaco编辑器实例
let codeEditor = null;
let viewCodeEditor = null;

// 当前查看的页面
let currentPage = 'create';

// 后端API URL
const API_BASE_URL = 'http://localhost:8000/api';

// DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true
        }
    });
    
    // 初始化Monaco编辑器
    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
    require(['vs/editor/editor.main'], initEditor);
    
    // 绑定事件监听器
    bindEventListeners();
});

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 导航菜单点击事件
    document.getElementById('nav-create').addEventListener('click', () => showPage('create'));
    document.getElementById('nav-history').addEventListener('click', () => {
        loadFlowcharts();
        showPage('history');
    });
    
    // 生成流程图按钮点击事件
    document.getElementById('generate-btn').addEventListener('click', generateFlowchart);
    
    // 保存流程图按钮点击事件
    document.getElementById('save-btn').addEventListener('click', saveCurrentFlowchart);
    
    // 导出图片按钮点击事件
    document.getElementById('export-btn').addEventListener('click', () => {
        const title = document.getElementById('chart-title').value || 'flowchart';
        exportFlowchart('flowchart-container', title);
    });
    
    // 查看页面导出图片按钮点击事件
    document.getElementById('view-export-btn').addEventListener('click', () => {
        exportFlowchart('view-flowchart-container', currentFlowchart?.title || 'flowchart');
    });
    
    // 返回按钮点击事件
    document.getElementById('back-btn').addEventListener('click', () => {
        showPage(currentPage === 'view-from-history' ? 'history' : 'create');
    });
}

/**
 * 初始化Monaco编辑器
 */
function initEditor() {
    // 创建代码编辑器
    codeEditor = monaco.editor.create(document.getElementById('code-editor'), {
        value: '// 在此处输入您的代码\n\nfunction example() {\n    console.log("Hello World!");\n    return true;\n}',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 4
    });
    
    // 创建查看页面的代码编辑器（只读）
    viewCodeEditor = monaco.editor.create(document.getElementById('view-code-editor'), {
        value: '',
        language: 'javascript',
        theme: 'vs-dark',
        readOnly: true,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14
    });
    
    // 监听语言选择变化
    document.getElementById('language-select').addEventListener('change', function() {
        monaco.editor.setModelLanguage(codeEditor.getModel(), this.value);
    });
}

/**
 * 显示指定页面
 * @param {string} page - 页面名称
 */
function showPage(page) {
    // 隐藏所有页面
    document.getElementById('create-page').classList.add('d-none');
    document.getElementById('history-page').classList.add('d-none');
    document.getElementById('view-page').classList.add('d-none');
    
    // 重置导航栏激活状态
    document.getElementById('nav-create').classList.remove('active');
    document.getElementById('nav-history').classList.remove('active');
    
    // 显示选定页面
    switch (page) {
        case 'create':
            document.getElementById('create-page').classList.remove('d-none');
            document.getElementById('nav-create').classList.add('active');
            currentPage = 'create';
            break;
        case 'history':
            document.getElementById('history-page').classList.remove('d-none');
            document.getElementById('nav-history').classList.add('active');
            currentPage = 'history';
            break;
        case 'view':
            document.getElementById('view-page').classList.remove('d-none');
            currentPage = 'view-from-create';
            break;
        case 'view-from-history':
            document.getElementById('view-page').classList.remove('d-none');
            currentPage = 'view-from-history';
            break;
    }
}

/**
 * 获取代码编辑器中的代码
 */
function getCode() {
    return codeEditor.getValue();
}

/**
 * 获取当前选择的编程语言
 */
function getLanguage() {
    return document.getElementById('language-select').value;
}

/**
 * 生成流程图
 */
async function generateFlowchart() {
    // 显示加载动画
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.classList.remove('d-none');
    
    // 禁用按钮
    document.getElementById('generate-btn').disabled = true;
    
    try {
        // 获取代码和语言
        const code = getCode();
        const language = getLanguage();
        
        // 调用API生成流程图
        const response = await analyzeCode(code, language);
        
        // 保存当前流程图数据
        currentFlowchart = {
            title: document.getElementById('chart-title').value || '未命名流程图',
            description: document.getElementById('chart-description').value || '',
            code_snippet: code,
            language: language,
            mermaid_code: response.mermaid_code,
            created_at: new Date().toISOString()
        };
        
        // 渲染流程图
        await renderFlowchart(response.mermaid_code);
        
        // 启用保存和导出按钮
        document.getElementById('save-btn').disabled = false;
        document.getElementById('export-btn').disabled = false;
    } catch (error) {
        // 显示错误消息
        document.getElementById('flowchart-container').innerHTML = `
            <div class="alert alert-danger">
                <strong>生成失败</strong>
                <p>${error.message || '服务器错误，请稍后再试'}</p>
            </div>
        `;
    } finally {
        // 隐藏加载动画并启用按钮
        loadingSpinner.classList.add('d-none');
        document.getElementById('generate-btn').disabled = false;
    }
}

/**
 * 保存当前流程图
 */
async function saveCurrentFlowchart() {
    if (!currentFlowchart) {
        alert('没有可保存的流程图');
        return;
    }
    
    try {
        // 更新流程图数据
        currentFlowchart.title = document.getElementById('chart-title').value || '未命名流程图';
        currentFlowchart.description = document.getElementById('chart-description').value || '';
        
        // 调用API保存流程图
        const savedFlowchart = await saveFlowchart(currentFlowchart);
        
        // 更新当前流程图数据
        currentFlowchart = savedFlowchart;
        
        // 显示成功消息
        alert('流程图保存成功');
    } catch (error) {
        alert(`保存失败: ${error.message || '服务器错误'}`);
    }
}

/**
 * 渲染流程图
 * @param {string} mermaidCode - Mermaid.js代码
 */
async function renderFlowchart(mermaidCode) {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = '<div class="mermaid"></div>';
    container.firstChild.textContent = mermaidCode;
    
    try {
        await mermaid.run({
            nodes: [container.firstChild]
        });
    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-warning">
                <strong>渲染失败</strong>
                <p>无法渲染流程图，可能是Mermaid代码格式错误</p>
                <pre class="mt-3 p-2 bg-light">${mermaidCode}</pre>
            </div>
        `;
    }
}

/**
 * 导出流程图为PNG图片
 * @param {string} containerId - 流程图容器ID
 * @param {string} filename - 文件名
 */
function exportFlowchart(containerId, filename) {
    const container = document.getElementById(containerId);
    const svg = container.querySelector('svg');
    
    if (!svg) {
        alert('找不到流程图SVG元素');
        return;
    }
    
    // 创建临时画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 获取SVG尺寸
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = function() {
        // 设置画布尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制SVG到画布
        ctx.drawImage(img, 0, 0);
        
        // 转换为PNG并下载
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = `${filename}.png`;
            downloadLink.click();
        } catch (error) {
            alert('导出图片失败: ' + error.message);
        }
    };
    
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
}

/**
 * 加载已保存的流程图列表
 */
async function loadFlowcharts() {
    const container = document.getElementById('flowcharts-list');
    container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-2">加载中...</p></div>';
    
    try {
        // 调用API获取所有流程图
        const flowcharts = await getFlowcharts();
        
        if (flowcharts.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-5 text-muted"><p>暂无保存的流程图</p></div>';
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 渲染流程图列表
        flowcharts.forEach((flowchart) => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-header">
                        <h5 class="card-title mb-0">${escapeHtml(flowchart.title)}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${escapeHtml(flowchart.description || '无描述')}</p>
                        <p class="badge bg-primary">${escapeHtml(flowchart.language)}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <small class="text-muted">创建于: ${formatDate(flowchart.created_at)}</small>
                        <div>
                            <button class="btn btn-sm btn-primary view-btn" data-id="${flowchart.id}">查看</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${flowchart.id}">删除</button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
            
            // 绑定查看按钮事件
            card.querySelector('.view-btn').addEventListener('click', () => viewFlowchart(flowchart.id));
            
            // 绑定删除按钮事件
            card.querySelector('.delete-btn').addEventListener('click', () => deleteFlowchart(flowchart.id));
        });
    } catch (error) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <strong>加载失败</strong>
                    <p>${error.message || '服务器错误，请稍后再试'}</p>
                </div>
            </div>
        `;
    }
}

/**
 * 查看特定流程图
 * @param {string} id - 流程图ID
 */
async function viewFlowchart(id) {
    try {
        // 调用API获取流程图详情
        const flowchart = await getFlowchart(id);
        currentFlowchart = flowchart;
        
        // 设置页面内容
        document.getElementById('view-title').textContent = flowchart.title;
        document.getElementById('view-description').textContent = flowchart.description || '无描述';
        document.getElementById('view-language').textContent = flowchart.language;
        document.getElementById('view-created').textContent = formatDate(flowchart.created_at);
        
        // 设置只读编辑器内容和语言
        viewCodeEditor.setValue(flowchart.code_snippet);
        monaco.editor.setModelLanguage(viewCodeEditor.getModel(), flowchart.language);
        
        // 渲染流程图
        const viewContainer = document.getElementById('view-flowchart-container');
        viewContainer.innerHTML = '<div class="mermaid"></div>';
        viewContainer.firstChild.textContent = flowchart.mermaid_code;
        
        try {
            await mermaid.run({
                nodes: [viewContainer.firstChild]
            });
        } catch (error) {
            viewContainer.innerHTML = `
                <div class="alert alert-warning">
                    <strong>渲染失败</strong>
                    <p>无法渲染流程图，可能是Mermaid代码格式错误</p>
                    <pre class="mt-3 p-2 bg-light">${flowchart.mermaid_code}</pre>
                </div>
            `;
        }
        
        // 启用删除和导出按钮
        document.getElementById('view-delete-btn').disabled = false;
        document.getElementById('view-export-btn').disabled = false;
        
        // 显示查看页面
        showPage('view-from-history');
    } catch (error) {
        alert(`加载流程图失败: ${error.message || '服务器错误'}`);
    }
}

/**
 * 删除流程图
 * @param {string} id - 流程图ID
 */
async function deleteFlowchart(id) {
    if (!confirm('确定要删除此流程图吗？此操作无法撤销。')) {
        return;
    }
    
    try {
        // 调用API删除流程图
        await deleteFlowchartAPI(id);
        
        // 如果在查看页面，则返回到历史记录页面
        if (currentPage === 'view-from-history' && currentFlowchart?.id === id) {
            showPage('history');
        }
        
        // 重新加载流程图列表
        loadFlowcharts();
        
        // 显示成功消息
        alert('流程图已删除');
    } catch (error) {
        alert(`删除失败: ${error.message || '服务器错误'}`);
    }
}

/**
 * HTML转义
 * @param {string} text - 原始文本
 * @returns {string} - 转义后的文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 格式化日期
 * @param {string} dateString - ISO格式日期字符串
 * @returns {string} - 格式化后的日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// API 通信函数

/**
 * 分析代码
 * @param {string} code - 代码内容
 * @param {string} language - 编程语言
 * @returns {Promise} - 返回Promise对象
 */
async function analyzeCode(code, language) {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, language })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '服务器错误');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`API请求失败: ${error.message}`);
    }
}

/**
 * 保存流程图
 * @param {Object} flowchart - 流程图对象
 * @returns {Promise} - 返回Promise对象
 */
async function saveFlowchart(flowchart) {
    try {
        const method = flowchart.id ? 'PUT' : 'POST';
        const url = flowchart.id ? `${API_BASE_URL}/flowcharts/${flowchart.id}` : `${API_BASE_URL}/flowcharts`;
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flowchart)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '服务器错误');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`API请求失败: ${error.message}`);
    }
}

/**
 * 获取所有流程图
 * @returns {Promise} - 返回Promise对象
 */
async function getFlowcharts() {
    try {
        const response = await fetch(`${API_BASE_URL}/flowcharts`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '服务器错误');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`API请求失败: ${error.message}`);
    }
}

/**
 * 获取特定流程图
 * @param {string} id - 流程图ID
 * @returns {Promise} - 返回Promise对象
 */
async function getFlowchart(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/flowcharts/${id}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '服务器错误');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`API请求失败: ${error.message}`);
    }
}

/**
 * 删除流程图
 * @param {string} id - 流程图ID
 * @returns {Promise} - 返回Promise对象
 */
async function deleteFlowchartAPI(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/flowcharts/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '服务器错误');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`API请求失败: ${error.message}`);
    }
}