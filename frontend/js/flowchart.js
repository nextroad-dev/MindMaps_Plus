// 初始化Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  logLevel: 'error',
  securityLevel: 'loose',
  fontFamily: 'Arial, sans-serif',
  fontSize: 14,
  flowchart: {
    htmlLabels: true,
    curve: 'linear',
    useMaxWidth: true
  }
});

/**
 * 渲染流程图
 * @param {string} mermaidCode - Mermaid代码
 * @param {string} containerId - 容器ID
 */
function renderFlowchart(mermaidCode, containerId = 'flowchart-container') {
    // 首先检查容器是否存在
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`流程图容器不存在: #${containerId}`);
        return false;
    }
    
    try {
        // 清空容器
        container.innerHTML = '';
        
        // 创建一个div来放置mermaid图
        const mermaidDiv = document.createElement('div');
        mermaidDiv.className = 'mermaid';
        mermaidDiv.textContent = mermaidCode;
        container.appendChild(mermaidDiv);
        
        // 初始化mermaid
        mermaid.init(undefined, '.mermaid');
        return true;
    } catch (error) {
        console.error('渲染流程图时出错:', error);
        
        // 显示错误信息
        container.innerHTML = `
            <div class="alert alert-danger">
                <h5 class="alert-heading">流程图渲染失败</h5>
                <p>无法渲染流程图，可能是Mermaid代码格式错误:</p>
                <pre class="border p-2 bg-light small">${error.message}</pre>
            </div>
        `;
        return false;
    }
}

/**
 * 导出流程图为图片
 * @param {string} containerId - 流程图容器ID
 * @param {string} title - 图片标题
 */
function exportFlowchart(containerId = 'flowchart-container', title = 'flowchart') {
    const container = document.getElementById(containerId);
    const svg = container.querySelector('svg');
    
    if (!svg) {
        alert('找不到流程图SVG元素');
        return;
    }
    
    // 创建SVG数据URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // 创建图像
    const img = new Image();
    img.onload = function() {
        // 创建canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图像
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // 创建下载链接
        const imgUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${title}.png`;
        downloadLink.href = imgUrl;
        downloadLink.click();
        
        // 清理
        URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
}

// 1. 修改Mermaid初始化方法
function initMermaid() {
    try {
        console.log('初始化 Mermaid...');
        mermaid.initialize({
            startOnLoad: false, // 不要自动初始化
            theme: 'default',
            logLevel: 5, // 设置为更详细的日志
            securityLevel: 'loose',
            flowchart: {
                htmlLabels: true,
                curve: 'linear',
                useMaxWidth: false
            },
            themeVariables: {
                fontFamily: 'Arial, sans-serif'
            }
        });
        return true;
    } catch (error) {
        console.error('Mermaid 初始化失败:', error);
        return false;
    }
}

/**
 * 安全地渲染Mermaid流程图 - 完全重写版本
 */
// 2. 完全重写渲染函数，使用新的Mermaid API
function renderSafeMermaid(mermaidCode, containerId) {
    console.log(`渲染流程图 -> ${containerId}`, { code: mermaidCode.substring(0, 20) + '...' });
    
    // 检查容器
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`流程图容器不存在: #${containerId}`);
        return false;
    }
    
    try {
        // 清空容器
        container.innerHTML = '';
        
        // 使用新的渲染方法
        const renderWrapper = async () => {
            try {
                // 创建渲染容器
                const tempElement = document.createElement('div');
                tempElement.style.width = '100%';
                tempElement.style.height = '100%';
                container.appendChild(tempElement);
                
                // 使用mermaid.render代替mermaid.init
                const uniqueId = `mermaid-${Date.now()}`;
                
                // 使用Mermaid新API
                const { svg } = await mermaid.render(uniqueId, mermaidCode);
                
                // 设置SVG内容
                tempElement.innerHTML = svg;
                console.log('渲染成功');
                return true;
            } catch (error) {
                console.error('Mermaid渲染错误:', error);
                container.innerHTML = `
                    <div class="alert alert-danger">
                        <h5>流程图渲染失败</h5>
                        <p>${error.message}</p>
                        <details>
                            <summary>查看Mermaid代码</summary>
                            <pre class="border p-2 mt-2 bg-light small">${mermaidCode}</pre>
                        </details>
                    </div>
                `;
                return false;
            }
        };
        
        // 执行渲染
        renderWrapper();
        return true;
    } catch (error) {
        console.error('渲染准备失败:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <h5>系统错误</h5>
                <p>${error.message}</p>
            </div>
        `;
        return false;
    }
}

/**
 * 确保Mermaid代码安全有效
 */
function sanitizeMermaidCode(code) {
    if (!code) return '';
    
    // 去除可能导致渲染问题的字符
    let cleanCode = code.trim();
    
    // 检查代码是否含有基本的mermaid结构
    if (!cleanCode.includes('flowchart') && !cleanCode.includes('graph')) {
        console.warn('代码可能不是有效的Mermaid格式');
    }
    
    return cleanCode;
}

// 在其他地方调用此函数
document.addEventListener('DOMContentLoaded', function() {
    initMermaid();
});