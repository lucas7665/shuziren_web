智能数字人问答系统使用说明

一、项目启动流程
1. 环境准备
   - Node.js 16+
   - npm 或 yarn
   - 讯飞开放平台配置信息

2. 安装依赖
   npm install
   或
   yarn

3. 启动项目
   npm run dev
   或
   yarn dev
   
4. 访问地址
   http://localhost:5173/chat

二、功能流程说明
1. 数字人初始化
   - 点击"初始化数字人"按钮
   - 系统自动完成SDK初始化
   - 绑定必要的事件监听
   - 设置API信息和全局参数
   - 启动数字人渲染

2. 问答交互
   - 在输入框输入问题
   - 点击发送或按Ctrl+Enter
   - 系统发送请求到知识库
   - 接收并处理回答
   - 数字人朗读答案
   - 显示对话历史

3. 清理资源
   - 点击"清理资源"按钮
   - 系统停止数字人服务
   - 清理相关资源
   - 重置对话历史

三、主要请求说明
1. 知识库问答请求
   URL: http://localhost:8080/api/repo-chat
   Method: POST
   Headers: {
     'Content-Type': 'application/json'
   }
   Body: {
     "repoId": "知识库ID",
     "question": "用户问题",
     "topN": 3,
     "messages": [],
     "chatExtends": {
       "wikiPromptTpl": "提示模板",
       "wikiFilterScore": 0.82,
       "spark": true,
       "temperature": 0.5
     }
   }

2. 数字人服务请求
   URL: wss://avatar.cn-huadong-1.xf-yun.com/v1/interact
   配置参数：
   - appId
   - apiKey
   - apiSecret
   - sceneId

四、关键配置说明
1. 数字人配置（AVATAR_CONFIG）
   - 服务器连接信息
   - 数字人形象参数
   - 音频和视频配置
   - TTS语音参数

2. 对话配置（CHAT_CONFIG）
   - 知识库ID
   - 匹配精度
   - 随机程度
   - 文档匹配数量
   - 提示词模板

五、注意事项
1. 确保后端服务已启动（端口8080）
2. 检查讯飞平台配置是否正确
3. 浏览器需要允许摄像头和麦克风权限
4. 建议使用Chrome浏览器访问

六、常见问题处理
1. 初始化失败
   - 检查网络连接
   - 验证配置信息
   - 查看控制台错误

2. 无法获取答案
   - 确认后端服务状态
   - 检查知识库配置
   - 验证请求参数

3. 无法播放声音
   - 检查浏览器权限
   - 验证音频设备
   - 确认TTS配置

七、联系支持
如遇到问题，请联系技术支持：
Email: support@example.com
