import { useEffect, useRef, useState } from 'react'
import { Button, message, Spin, Input, Card } from 'antd'
import AvatarPlatform from '../testSdk/3.1.2.1002/avatar-sdk-web_3.1.2.1002/index.js'
import { AVATAR_CONFIG, CHAT_CONFIG } from '../config/chatConfig'

// 消息类型定义
interface Message {
  role: 'user' | 'assistant'
  content: string
  references?: string[]  // 添加参考来源字段
}

// 添加一个格式化答案的函数
const formatAnswer = (text: string) => {
  // 专业术语和关键词列表
  const keywords = [
    '贝伐珠单抗', '乙类抗癌药', '双通道', '报销基数', '三级医院',
    '在职职工', '报销比例', '报销金额', '起付线', '医保目录',
    '医保政策', '报销标准', '医疗机构', '医保卡', '医保账户',
    '定点医院', '医保报销', '医保待遇', '医保范围', '医保结算'
  ]
  
  // 处理文本
  let formattedText = text
  
  // 1. 首先处理标题，并用特殊标记保护它们
  formattedText = formattedText.replace(
    /\*\*(.*?)\*\*:?/g,  // 匹配标题及可能的冒号
    (match, title) => {
      // 将标题中的关键词也标记为需要保护
      const protectedTitle = title.replace(
        new RegExp(keywords.join('|'), 'g'),
        '<!--PROTECTED-->$&<!--/PROTECTED-->'
      )
      return `<!--TITLE-->${protectedTitle}<!--/TITLE-->${match.endsWith(':') ? ':' : ''}`
    }
  )
  
  // 2. 处理数字（黑色加粗）- 排除标题内容
  formattedText = formattedText.replace(
    /(\d+(?:\.\d+)?)\s*(元|%)?/g,
    '<span style="color: #000000; font-weight: bold">$1$2</span>'
  )
  
  // 3. 处理关键词（蓝色）- 排除被保护的内容
  keywords.forEach(keyword => {
    formattedText = formattedText.replace(
      new RegExp(`(?<!<!--(?:TITLE|PROTECTED)-->(?:[^](?!<!--\/(?:TITLE|PROTECTED)-->))*?)${keyword}`, 'g'),
      '<span style="color: #1890ff; font-weight: bold">$&</span>'
    )
  })
  
  // 4. 移除保护标记
  formattedText = formattedText
    .replace(/<!--PROTECTED-->|<!--\/PROTECTED-->/g, '')
  
  // 5. 最后恢复标题（黑色加粗放大）
  formattedText = formattedText.replace(
    /<!--TITLE-->(.*?)<!--\/TITLE-->/g,
    '<span style="font-size: 18px; font-weight: bold; color: #000000">$1</span>'
  )
  
  // 处理段落
  return formattedText.split('\n').join('<br/>')
}

function ChatDemo() {
  const [loading, setLoading] = useState(false)
  const interativeRef = useRef<any>()
  const [initialized, setInitialized] = useState(false)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [settings] = useState(CHAT_CONFIG.defaultSettings)

  // 初始化SDK
  const initSDK = () => {
    try {
      if (!interativeRef.current) {
        interativeRef.current = new AvatarPlatform({
          useInlinePlayer: true,
          binaryData: false,
        })
        message.success('初始化成功')
        return true
      }
      return false
    } catch (e: any) {
      console.error(e)
      message.error('初始化失败: ' + e?.message)
      return false
    }
  }

  // 绑定事件监听
  const bindEvents = () => {
    if (!interativeRef.current) return false
    
    interativeRef.current.removeAllListeners()
    interativeRef.current
      .on('connected', (resp: any) => console.log('已连接:', resp))
      .on('disconnected', (e: any) => {
        setLoading(false)
        console.log('连接断开:', e)
        if (e) message.error('连接断开')
      })
      .on('error', (error: any) => {
        console.log('错误:', error)
        message.error('错误: ' + error?.message)
      })
      .on('subtitle_info', (data: any) => console.log('字幕:', data?.text))
      .on('nlp', (nlpData: any) => {
        console.log('资料库响应:', nlpData)
        setLoading(false)
      })

    message.success('事件监听已绑定')
    return true
  }

  // 自动初始化流程
  const autoInit = async () => {
    setLoading(true)
    try {
      // 1. 初始化SDK
      if (!initSDK()) throw new Error('SDK初始化失败')
      
      // 2. 绑定事件
      if (!bindEvents()) throw new Error('事件绑定失败')
      
      // 3. 设置API信息
      await interativeRef.current.setApiInfo({
        ...AVATAR_CONFIG.apiInfo,
        request_id: Date.now().toString()
      })
      
      // 4. 设置全局参数 - 确保这里正确设置了背景色
      console.log('Setting global params:', AVATAR_CONFIG.globalParams) // 添加日志
      await interativeRef.current.setGlobalParams(AVATAR_CONFIG.globalParams)
      
      // 5. 启动
      await interativeRef.current.start({
        wrapper: document.querySelector('.avatar-container'),
        width: AVATAR_CONFIG.globalParams.avatar.width,
        height: AVATAR_CONFIG.globalParams.avatar.height,
        useInlinePlayer: true,
        binaryData: false,
        protocol: AVATAR_CONFIG.globalParams.stream.protocol
      })
      
      setInitialized(true)
      message.success('初始化完成！')
    } catch (error: any) {
      console.error('初始化失败:', error) // 添加详细错误日志
      message.error('初始化失败: ' + error.message)
    }
    setLoading(false)
  }

  // 发送问题到知识库
  const handleQuestion = async () => {
    if (!inputText.trim()) {
      message.warning('请输入问题')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/repo-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repoId: CHAT_CONFIG.repoId,
          question: inputText,
          topN: settings.topN,
          messages: messages,
          chatExtends: {
            wikiPromptTpl: settings.wikiPromptTpl,
            wikiFilterScore: settings.wikiFilterScore,
            spark: settings.spark,
            temperature: settings.temperature
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // 更新对话历史
        const newMessages: Message[] = [
          ...messages,
          { role: 'user', content: inputText },
          { 
            role: 'assistant', 
            content: result.data.answer,
            references: result.data.references?.files  // 添加参考来源
          }
        ]
        setMessages(newMessages)
        
        // 让数字人说出答案
        if (interativeRef.current) {
          await interativeRef.current.writeText(result.data.answer, {
            tts: { vcn: 'x4_yezi' }
          })
        }
      } else {
        message.error(result.message || '请求失败')
      }
    } catch (error) {
      console.error(error)
      message.error('提问失败')
    }
    setLoading(false)
    setInputText('')
  }

  // 清理资源
  const cleanup = () => {
    if (interativeRef.current) {
      interativeRef.current.stop()
      interativeRef.current.destroy()
      interativeRef.current = undefined
      setInitialized(false)
      setMessages([])
      message.success('已清理')
    }
  }

  useEffect(() => {
    return cleanup
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh',  // 确保至少占满整个视口高度
      backgroundColor: '#f5f5f5',  // 整个页面的灰色背景
      padding: '20px'
    }}>
      <Spin spinning={loading}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* 数字人容器 */}
          <div className="avatar-container" style={{ 
            width: '100%',
            height: '60vh',
            backgroundColor: '#ffffff',  // 改为白色背景
            marginBottom: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}></div>
          
          {/* 对话区域 */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* 左侧对话历史 */}
            <div style={{ flex: 1 }}>
              <Card 
                title="对话历史" 
                style={{ marginBottom: '20px' }}
                styles={{
                  body: { 
                    padding: '20px',
                    height: '400px',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff'  // 改为白色背景
                  }
                }}
              >
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  {messages.map((msg, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        backgroundColor: msg.role === 'user' ? '#95ec69' : '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        position: 'relative',
                        wordBreak: 'break-word',
                        lineHeight: '1.6',
                        textAlign: 'left'
                      }}>
                        {msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <>
                            <div 
                              dangerouslySetInnerHTML={{ __html: formatAnswer(msg.content) }}
                              style={{
                                margin: '0',
                                padding: '0'
                              }}
                            />
                            {msg.references && msg.references.length > 0 && (
                              <div style={{
                                marginTop: '8px',
                                paddingTop: '8px',
                                borderTop: '1px solid #f0f0f0',
                                fontSize: '12px',
                                color: '#888'
                              }}>
                                参考来源：{msg.references.join(', ')}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 输入区域 */}
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                backgroundColor: '#ffffff',  // 已经是白色背景
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <Input.TextArea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="请输入问题..."
                  style={{ 
                    flex: 1,
                    borderRadius: '4px',
                    resize: 'none'
                  }}
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleQuestion()
                    }
                  }}
                />
                <Button 
                  type="primary"
                  onClick={handleQuestion}
                  style={{ 
                    height: '82px', 
                    width: '100px',
                    borderRadius: '4px'
                  }}
                >
                  发送
                </Button>
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div style={{ 
            marginTop: '20px', 
            display: 'flex', 
            gap: '10px',
            justifyContent: 'center'
          }}>
            <Button type="primary" onClick={autoInit} disabled={initialized}>
              初始化数字人
            </Button>
            <Button onClick={cleanup} disabled={!initialized}>
              清理资源
            </Button>
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default ChatDemo 