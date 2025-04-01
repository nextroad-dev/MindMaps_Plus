// 初始化Mermaid
mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'default'
});

/**
 * 渲染流程图
 * @param {string} mermaidCode - Mermaid代码
 * @param {string} containerId - 容器ID
 */
async function renderFlowchart(mermaidCode, containerId = 'flowchart-container') {
    const container = document.getElementById(containerId);
    
    // 清空容器
    container.innerHTML = '';
    
    try {
        // 创建渲染容器
        const renderContainer = document.createElement('div');
        renderContainer.className = 'mermaid';
        renderContainer.textContent = mermaidCode;
        container.appendChild(renderContainer);
        
        // 渲染图表
        await mermaid.run();
        
        // 启用相关按钮
        if (containerId === 'flowchart-container') {
            document.getElementById('save-btn').disabled = false;
            document.getElementById('export-btn').disabled = false;
        }
    } catch (error) {
        console.error('渲染流程图失败:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <strong>渲染失败</strong>
                <p>无法渲染流程图，可能是Mermaid代码有误。</p>
                <pre class="mt-3 p-2 bg-light">${error.message}</pre>
            </div>
        `;
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