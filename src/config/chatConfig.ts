// 数字人配置
export const AVATAR_CONFIG = {
  apiInfo: {
    serverUrl: 'wss://avatar.cn-huadong-1.xf-yun.com/v1/interact',
    appId: '6b88e4b3',
    apiKey: 'b991a607467166f9c2ee48ea7b29105b',
    apiSecret: 'NjMxNzU1NTU1MDA2NWMzY2MzNzU4YmRi',
    sceneId: '145706888397459456',
  },
  globalParams: {
    avatar_dispatch: { interactive_mode: 0, content_analysis: 0 },
    stream: {
      protocol: 'xrtc',
      alpha: 1,
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
        value: '#ffffff'
      }
    },
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

// 对话配置
export const CHAT_CONFIG = {
  repoId: 'fc93572d49414586b65c25338ab02283',
  defaultSettings: {
    wikiFilterScore: 0.82,
    temperature: 0.5,
    spark: true,
    topN: 3,
    wikiPromptTpl: `基于以下内容回答问题：
<wikicontent>
回答后的答案格式美化一下，回答中不要使用文件名，避免重复引用文件名，回答结果不要有#，*等符号，不要让回答看起来像是模型回答的，最好是有标题，序号，内容，标题需要加粗。
问题：<wikiquestion>
回答：`
  }
} 