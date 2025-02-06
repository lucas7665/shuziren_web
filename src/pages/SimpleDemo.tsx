import { useEffect, useRef, useState } from 'react'
import { Button, message, Spin } from 'antd'
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

  // 组件卸载时清理
  useEffect(() => {
    return cleanup
  }, [])

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '20px' }}>
        <div className="avatar-container" style={{ 
          width: '100%',
          height: '80vh',
          backgroundColor: '#eee'
        }}></div>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
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