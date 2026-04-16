# MindMaps_Plus
一个基于大模型实现的代码转换程序流程图程序
# 代码转流程图系统开发流程（JS Version）

## 1. 需求分析
- **核心功能**：
  - 通过大模型API解析输入的代码
  - 生成标准化的流程图描述文本（如Mermaid语法）
  - 可视化渲染流程图
- **扩展功能**：
  - 支持多种编程语言
  - 流程图导出功能
  - 交互式编辑流程图

## 2. 技术选型
| 组件           | 候选方案                          |
|----------------|---------------------------------|
| 后端框架       | Spring Boot 3.x                 |
| 前端框架       | Vue.js/React + Mermaid.js       |
| 大模型API      | OpenAI API/DeepSeek API/文心一言 |
| 流程图渲染库   | Mermaid.js/D3.js                |
| 构建工具       | Maven/Gradle                    |
| 部署方式       | Docker + Nginx                  |

## 3. 系统架构设计
```mermaid
graph TD
    A[用户界面] --> B[后端服务]
    B --> C[大模型API]
    B --> D[流程图生成引擎]
    D --> E[图表渲染]
