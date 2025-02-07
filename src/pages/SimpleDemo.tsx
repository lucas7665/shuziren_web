import { useEffect, useRef, useState } from 'react'
import { Button, message, Spin, Input } from 'antd'
import AvatarPlatform from '../testSdk/3.1.2.1002/avatar-sdk-web_3.1.2.1002/index.js'

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
      audio_format: 1,
    },
    tts: {
      vcn: 'x4_yezi',
      speed: 50,
      pitch: 50,
      volume: 100,
    },
    subtitle: {
      subtitle: 0,
      font_color: '#ffffff',
    },
    background: {
      enabled: false,
      type: 'url',
      data: '',
    },
  }
}

function SimpleDemo() {
  const [loading, setLoading] = useState(false)
  const interativeRef = useRef<any>()
  const [initialized, setInitialized] = useState(false)
  const [inputText, setInputText] = useState('')
  const [answer, setAnswer] = useState('')

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
      .on('error', (error: any) => console.log('错误:', error))
      .on('subtitle_info', (data: any) => console.log('字幕:', data?.text))
      .on('nlp', (nlpData: any) => {
        console.log('资料库响应:', nlpData)
        setLoading(false)
        if (nlpData?.text) {
          setAnswer(
            `问题: ${nlpData.text}\n` +
            `答案: ${nlpData.answer?.text || '无答案'}\n` +
            `来源: ${nlpData.extend_params?.repoName || '未知'}\n` +
            `匹配问题: ${nlpData.extend_params?.topic || '未知'}`
          )
        }
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
      interativeRef.current.setApiInfo(CONFIG.apiInfo)
      
      // 4. 设置全局参数
      interativeRef.current.setGlobalParams(CONFIG.globalParams)
      
      // 5. 启动
      await interativeRef.current.start({
        wrapper: document.querySelector('.avatar-container')
      })
      
      setInitialized(true)
      message.success('初始化完成！')
    } catch (error: any) {
      console.error(error)
      message.error('初始化失败: ' + error.message)
    }
    setLoading(false)
  }

  // 说话测试
  const speak = async () => {
    if (!interativeRef.current) return message.warning('请先初始化')
    try {
      await interativeRef.current.writeText('你好，我是数字人', {
        tts: { vcn: 'x4_yezi' }
      })
    } catch (error) {
      console.error(error)
      message.error('语音播报失败')
    }
  }

  // 清理资源
  const cleanup = () => {
    if (interativeRef.current) {
      interativeRef.current.stop()
      interativeRef.current.destroy()
      interativeRef.current = undefined
      setInitialized(false)
      message.success('已清理')
    }
  }

  // 添加提交文字的函数
  const handleSubmit = async () => {
    if (!inputText.trim()) {
      message.warning('请输入要说的话')
      return
    }

    if (!interativeRef.current) {
      message.warning('请先初始化数字人')
      return
    }

    try {
      await interativeRef.current.writeText(inputText, {
        tts: { vcn: 'x4_yezi' }
      })
      setInputText('') // 清空输入框
    } catch (error) {
      console.error(error)
      message.error('语音播报失败')
    }
  }

  // 修改资料库问答函数
  const handleQuestion = async () => {
    if (!inputText.trim()) {
      message.warning('请输入问题')
      return
    }

    if (!interativeRef.current) {
      message.warning('请先初始化数字人')
      return
    }

    setAnswer('')
    setLoading(true)

    try {
      await interativeRef.current.writeText(inputText, {
        nlp: true,
        parameter: {
          nlp: {
            domain: 'avatar',
            type: 'faq'
          },
          header: {
            app_id: CONFIG.apiInfo.appId,
            ctrl: 'text_interact',
            orgCode: CONFIG.apiInfo.appId
          },
          payload: {
            text: {
              content: inputText
            }
          },
          tdp: {
            url: 'wss://avatar.cn-huadong-1.xf-yun.com/v1/interact',
            orgCode: CONFIG.apiInfo.appId,
            appId: CONFIG.apiInfo.appId,
            apiKey: CONFIG.apiInfo.apiKey,
            apiSecret: CONFIG.apiInfo.apiSecret,
            botId: '145706888397459456'
          }
        }
      })
    } catch (error) {
      console.error(error)
      message.error('提问失败')
      setLoading(false)
    }
  }

  // 组件卸载时清理
  useEffect(() => {
    return cleanup
  }, [])

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '20px' }}>
        <div className="avatar-container" style={{ 
          width: '100%',
          height: '70vh',
          backgroundColor: '#eee'
        }}></div>
        
        {/* 添加输入框和提交按钮 */}
        <div style={{ 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input.TextArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请输入问题或要说的话..."
              style={{ flex: 1 }}
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmit()
                }
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button 
                type="primary"
                onClick={handleSubmit}
                disabled={!initialized}
                style={{ height: '50%', width: '100px' }}
              >
                发送
              </Button>
              <Button 
                onClick={handleQuestion}
                disabled={!initialized}
                style={{ height: '50%', width: '100px' }}
              >
                提问
              </Button>
            </div>
          </div>

          {/* 答案显示区域 */}
          {answer && (
            <div style={{
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              marginTop: '10px',
              whiteSpace: 'pre-line'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>资料库回答：</div>
              <div>{answer}</div>
            </div>
          )}
        </div>
        
        {/* 控制按钮 */}
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          gap: '10px',
          justifyContent: 'center'
        }}>
          <Button type="primary" onClick={autoInit} disabled={initialized}>
            一键初始化
          </Button>
          <Button onClick={speak} disabled={!initialized}>
            测试语音
          </Button>
          <Button onClick={cleanup} disabled={!initialized}>
            清理资源
          </Button>
        </div>
      </div>
    </Spin>
  )
}

export default SimpleDemo 