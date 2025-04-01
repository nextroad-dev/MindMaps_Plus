mindmaps-plus/
├── backend/             # 后端 Spring Boot 项目
│   ├── pom.xml          # 或 build.gradle
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── yourcompany/
│       │   │           └── mindmapsplus/
│       │   │               ├── MindmapsPlusApplication.java # Spring Boot 启动类
│       │   │               ├── controller/                  # API 控制器层
│       │   │               │   └── FlowchartController.java
│       │   │               ├── service/                     # 业务逻辑服务层
│       │   │               │   ├── FlowchartService.java
│       │   │               │   └── LlmApiService.java       # 封装 LLM API 调用
│       │   │               ├── dto/                         # 数据传输对象
│       │   │               │   ├── CodeInputDto.java
│       │   │               │   └── FlowchartResponseDto.java
│       │   │               ├── config/                      # 配置类
│       │   │               │   ├── AppConfig.java          # （可选）应用配置
│       │   │               │   └── LlmApiConfig.java       # （可选）LLM API 相关配置，如读取密钥
│       │   │               └── exception/                   # 自定义异常及处理
│       │   │                   ├── GlobalExceptionHandler.java
│       │   │                   └── LlmApiException.java
│       │   └── resources/
│       │       ├── application.properties   # 或 application.yml，配置文件
│       │       ├── static/                  # 静态资源 (如果后端也提供一些静态内容)
│       │       └── templates/               # 模板文件 (如果使用服务端模板引擎)
│       └── test/                            # 测试代码目录
│           └── java/
│               └── com/
│                   └── yourcompany/
│                       └── mindmapsplus/
│                           ├── controller/
│                           │   └── FlowchartControllerTest.java
│                           └── service/
│                               └── FlowchartServiceTest.java
├── frontend/            # 前端 Vue.js 项目 (以 Vue 为例)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.vue          # 根组件
│   │   ├── main.js          # 入口文件
│   │   ├── components/      # 可复用的小组件
│   │   │   ├── CodeEditor.vue # 代码输入区域组件
│   │   │   └── MermaidRenderer.vue # Mermaid 渲染组件
│   │   ├── views/           # 页面级组件 (路由对应的视图)
│   │   │   └── FlowchartGenerator.vue # 主要的功能页面
│   │   ├── services/        # 或 api/ 封装 API 请求
│   │   │   └── flowchartApi.js
│   │   ├── assets/          # 静态资源 (图片, CSS 等)
│   │   ├── router/          # 路由配置 (如果需要多页面)
│   │   │   └── index.js
│   │   └── store/           # 状态管理 (如果项目复杂, 可选)
│   │       └── index.js
│   ├── package.json       # 项目依赖和脚本
│   ├── vite.config.js     # (Vite) 或 vue.config.js (Vue CLI)
│   └── README.md
├── docs/                # 项目文档 (可选)
├── scripts/             # 构建、部署脚本 (可选)
├── docker-compose.yml   # Docker Compose 配置文件
└── .gitignore           # Git 忽略文件配置