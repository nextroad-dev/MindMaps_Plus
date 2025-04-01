let editor, viewEditor;

/**
 * 初始化代码编辑器
 */
function initEditor() {
    // 创建主编辑器
    editor = monaco.editor.create(document.getElementById('code-editor'), {
        value: '# 在这里输入您的代码\n\ndef hello_world():\n    print("Hello, World!")\n\n# 调用函数\nhello_world()',
        language: 'python',
        theme: 'vs',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
    });
    
    // 语言选择变更时更新编辑器语言
    document.getElementById('language-select').addEventListener('change', (e) => {
        monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
    });
    
    // 创建查看页面的只读编辑器
    viewEditor = monaco.editor.create(document.getElementById('view-code-editor'), {
        value: '',
        language: 'python',
        theme: 'vs',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: true,
    });
}

/**
 * 获取编辑器中的代码
 * @returns {string} - 编辑器中的代码
 */
function getCode() {
    return editor.getValue();
}

/**
 * 获取选择的编程语言
 * @returns {string} - 选择的编程语言
 */
function getLanguage() {
    return document.getElementById('language-select').value;
}

/**
 * 在查看页面设置代码
 * @param {string} code - 代码
 * @param {string} language - 编程语言
 */
function setViewCode(code, language) {
    monaco.editor.setModelLanguage(viewEditor.getModel(), language);
    viewEditor.setValue(code);
}