import { useEffect, useRef, useState } from 'react'
import { Button, message, Spin, Input, Card, Slider, Switch } from 'antd'
import AvatarPlatform from '../testSdk/3.1.2.1002/avatar-sdk-web_3.1.2.1002/index.js'

// 配置信息
const CONFIG = {
  // API配置
  apiInfo: {
    serverUrl: 'wss://avatar.cn-huadong-1.xf-yun.com/v1/interact',
    appId: '6b88e4b3',
    apiKey: 'b991a607467166f9c2ee48ea7b29105b',
    apiSecret: 'NjMxNzU1NTU1MDA2NWMzY2MzNzU4YmRi',
    sceneId: '145706888397459456',
  },
  
  // 全局参数配置
  globalParams: {
    avatar_dispatch: { interactive_mode: 0, content_analysis: 0 },
    stream: {
      protocol: 'xrtc',
      alpha: 0,
      bitrate: 1000000,
      fps: 25,
    },
    avatar: {
      avatar_id: '110005011',
      width: 720,
      height: 1280,
      mask_region: '[0, 0, 1080, 1920]',
      scale: 1,
      move_h: 0,
      move_v: 0,
      rotate: 0,
      flip: 0,
      mirror: 0,
      background: {
        type: 'color',
        value: '#00ff00'
      }
    },
    // 添加缺失的必要配置
    tts: {
      vcn: 'x4_yezi',
      speed: 50,
      pitch: 50,
      volume: 50
    },
    audio: {
      channels: 1,
      sampleRate: 16000,
      sampleBits: 16
    }
  }
}

// 消息类型定义
interface Message {
  role: 'user' | 'assistant'
  content: string
}

function ChatDemo() {
  const [loading, setLoading] = useState(false)
  const interativeRef = useRef<any>()
  const [initialized, setInitialized] = useState(false)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [settings, setSettings] = useState({
    wikiFilterScore: 0.82,
    temperature: 0.5,
    spark: true,
    topN: 3,
    wikiPromptTpl: "基于以下内容回答问题：\n<wikicontent>\n\n问题：<wikiquestion>\n回答："
  })

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
        ...CONFIG.apiInfo,
        request_id: Date.now().toString()
      })
      
      // 4. 设置全局参数
      await interativeRef.current.setGlobalParams(CONFIG.globalParams)
      
      // 5. 启动
      await interativeRef.current.start({
        wrapper: document.querySelector('.avatar-container'),
        width: CONFIG.globalParams.avatar.width,
        height: CONFIG.globalParams.avatar.height,
        // 添加缺失的必要参数
        useInlinePlayer: true,
        binaryData: false,
        protocol: CONFIG.globalParams.stream.protocol
      })
      
      setInitialized(true)
      message.success('初始化完成！')
    } catch (error: any) {
      console.error(error)
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
          repoId: 'fc93572d49414586b65c25338ab02283',
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
          { role: 'assistant', content: result.data }
        ]
        setMessages(newMessages)
        
        // 让数字人说出答案
        if (interativeRef.current) {
          await interativeRef.current.writeText(result.data, {
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
    <Spin spinning={loading}>
      <div style={{ 
        padding: '20px',
        maxWidth: '1200px',  // 添加最大宽度限制
        margin: '0 auto'     // 居中显示
      }}>
        {/* 数字人容器 */}
        <div className="avatar-container" style={{ 
          width: '100%',
          height: '60vh',    // 增加高度比例
          backgroundColor: '#f5f5f5',  // 更改背景色
          marginBottom: '20px',
          borderRadius: '8px',  // 添加圆角
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'  // 添加阴影
        }}></div>
        
        {/* 对话区域 */}
        <div style={{ 
          display: 'flex',
          gap: '20px'
        }}>
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
                  backgroundColor: '#f5f5f5'
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
                      lineHeight: '1.5',
                      textAlign: 'left'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 输入区域 */}
            <div style={{ 
              display: 'flex', 
              gap: '10px',
              backgroundColor: '#fff',
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

          {/* 右侧参数设置 */}
          <Card title="参数设置" style={{ width: 300 }}>
            <div style={{ marginBottom: '20px' }}>
              <div>匹配精度：{settings.wikiFilterScore}</div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={settings.wikiFilterScore}
                onChange={(value) => setSettings(s => ({...s, wikiFilterScore: value}))}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div>随机程度：{settings.temperature}</div>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={settings.temperature}
                onChange={(value) => setSettings(s => ({...s, temperature: value}))}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div>匹配数量：{settings.topN}</div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={settings.topN}
                onChange={(value) => setSettings(s => ({...s, topN: value}))}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div>提示模板：</div>
              <Input.TextArea
                value={settings.wikiPromptTpl}
                onChange={(e) => setSettings(s => ({...s, wikiPromptTpl: e.target.value}))}
                placeholder="输入提示模板..."
                rows={4}
                style={{ marginTop: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>大模型兜底：</span>
                <Switch
                  checked={settings.spark}
                  onChange={(checked) => setSettings(s => ({...s, spark: checked}))}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </div>
            </div>
            <Button
              type="primary"
              onClick={() => setSettings({
                wikiFilterScore: 0.82,
                temperature: 0.5,
                spark: true,
                topN: 3,
                wikiPromptTpl: "基于以下内容回答问题：\n<wikicontent>\n\n问题：<wikiquestion>\n回答："
              })}
              block
            >
              重置参数
            </Button>
          </Card>
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
  )
}

export default ChatDemo 