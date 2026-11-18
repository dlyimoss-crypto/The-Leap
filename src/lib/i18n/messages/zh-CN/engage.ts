import type { EngageMessages } from "../en/engage";

export const engage: EngageMessages = {
  hub: {
    subtitle: "我的生命有超越自己的使命。",
    inviteTitle: "邀请朋友",
    inviteDescription: "帮助别人迈出他们的第一跃。",
    serveTitle: "服事与宣教",
    serveDescription: "寻找服事和参与的机会。",
    giveTitle: "奉献",
    giveDescription: "支持 The Leap 及其合作的事工。",
  },
  give: {
    heading: "参与其中，携手同行，带来改变。",
    intro:
      "你的支持能帮助 The Leap 陪伴更多人与基督一同迈出下一步。欢迎你通过奉献、服事、祷告以及把更多人连结到这份使命中，与我们同工。",
    howCanIGive: "我可以如何奉献？",
    methods: {
      internationalBank: "国际银行转账",
      tanzanianBank: "坦桑尼亚银行转账",
      mobilePesa: "手机转账（Mobile Pesa）",
      usTaxDeductible: "美国免税奉献",
    },
    fullDetails: "完整的奉献信息，请访问我们的奉献页面。",
    coreValues: {
      integrity: "正直",
      service: "服事",
      wisdom: "智慧",
      discipline: "自律",
      excellence: "卓越",
    },
    together: "我们一起迈出下一步。",
  },
  invite: {
    title: "邀请朋友",
    subtitle: "倍增——帮助别人迈出他们的下一步。",
    card: {
      heading: "带上一个人同行",
      helpWithName: "{name}，帮助一位朋友或家人与基督一同迈出第一跃。",
      help: "帮助一位朋友或家人与基督一同迈出第一跃。",
      shareMessage:
        "我一直在用 The Leap，一天一天地在与基督同行的路上成长。你也来迈出第一跃吧：",
      inviteCopied: "邀请已复制",
      shareTheLeap: "分享 The Leap",
    },
  },
  serve: {
    title: "服事与宣教",
    subtitle: "寻找服事和参与的机会。",
    empty: "暂时还没有服事机会——请稍后再来看看。",
    learnMore: "了解更多",
  },
  askPd: {
    title: "Ask PD",
    intro:
      "直接联系 Deniss 牧师和 Leap 牧养团队。由真人回复，不是 AI。你可以发送私信或预约通话，我们会尽快回复你。",
    emergencyBefore: "此渠道不用于紧急情况。如果你正处于危险中，请",
    emergencyLink: "立即寻求帮助",
    emergencyAfter: "。",
    tabs: {
      message: "发送消息",
      call: "预约通话",
    },
    errors: {
      empty: "请先写下你的消息再发送。",
      contact: "请选择联系方式，并填写你的号码或用户名。",
      failed: "发送时出了点问题，请重试。",
    },
    contactMethodLabel: "我们该如何联系你？",
    contactMethods: {
      whatsapp: "WhatsApp",
      phone: "电话",
      video: "视频通话",
    },
    contactDetailLabel: "你的号码或用户名",
    contactDetailPlaceholder: "例如：+255 7XX XXX XXX",
    preferredTimeLabel: "方便通话的时间（可选）",
    preferredTimePlaceholder: "例如：工作日晚上 6 点以后，EAT",
    bodyLabelCall: "你想聊些什么？（可选）",
    bodyLabelMessage: "你的消息",
    bodyPlaceholderCall: "简单写一两句，能帮助我们提前准备。",
    bodyPlaceholderMessage:
      "分享你心里的事：一个问题、一个决定，或你希望得到代祷或指引的事情。",
    shareCompanionLabel: "分享我与 Leap 伙伴的对话",
    shareCompanionHint:
      "这样团队就能了解你们聊过什么。只有勾选此项时才会分享，并且只分享你最近的消息。",
    submitCall: "预约通话",
    submitMessage: "发送给 Deniss 牧师",
    privacyNote: "私密：只有 Deniss 牧师和 Leap 牧养团队可以看到。",
    yourConversations: "你的对话",
    newReply: "新回复",
    conversationFallback: "对话",
    callRequestPrefix: "通话预约 · ",
    status: {
      user: {
        open: "等待回复",
        answered: "已回复",
        closed: "已关闭",
      },
      team: {
        open: "待回复",
        answered: "已回复",
        closed: "已关闭",
      },
    },
    defaultCallMessage: "我想和 Deniss 牧师或 PD 团队聊一聊。",
    thread: {
      yourCallRequest: "你的通话预约",
      yourMessage: "你的消息",
      sentMessage:
        "已发送。Deniss 牧师或团队成员会在这里回复你。收到回复时，Ask PD 上会出现一个小圆点。",
      sentCall:
        "已发送。Deniss 牧师或团队成员会在这里回复你，或直接与你联系。收到回复时，Ask PD 上会出现一个小圆点。",
      closed: "此对话已关闭。",
      startNewOne: "开始新的对话",
      anyTime: "（随时都可以）",
      followUpPlaceholder: "补充内容…",
      callRequest: "通话预约",
      you: "你",
      userFallback: "用户",
      pastorDeniss: "Deniss 牧师",
      send: "发送",
      crisisBefore:
        "你不必独自面对这一切。这里的回复可能需要一些时间，所以如果你正处于紧急危险中，或有伤害自己的念头，请立即寻求帮助。",
      crisisLink: "查找你所在国家的紧急援助 →",
      crisisAfter:
        "你也可以联系你信任的人、当地教会、专业心理咨询师或紧急救助服务。",
    },
    inbox: {
      title: "Ask PD 收件箱",
      subtitle: "给 Deniss 牧师和团队的消息与通话预约。",
      nothingHere: "这里什么都没有。",
      unread: "未读",
      unnamedUser: "未命名用户",
      youPrefix: "你：",
    },
    inboxThread: {
      callRequest: "通话预约",
      message: "消息",
      started: "发起于",
      reopen: "重新打开",
      markHandled: "标记为已处理",
      markAsSeen: "标记为已读",
      crisisWarning:
        "此对话包含危机相关的言语。请尽快回复；如果对方可能有危险，请引导他们立即寻求当地帮助。",
      sharedCompanion: (count: number) =>
        `分享的 Leap 伙伴对话（${count} 条消息）`,
      companionAi: "Leap 伙伴（AI）",
      replyTo: (name: string) => `回复 ${name}…`,
      repliesNote: "回复时，用户会看到你的名字，并收到通知。",
    },
    push: {
      newCallRequestTitle: "新的通话预约",
      newMessageTitle: "新的 Ask PD 消息",
      newRequestBody: "有人通过 Ask PD 联系了你们。",
      followUpTitle: "Ask PD 有新的补充消息",
      followUpBody: "有人在 Ask PD 对话中回复了。",
      repliedTitle: "Deniss 牧师回复了你",
      repliedBody: "你在 Ask PD 中有一条新回复。",
    },
  },
  companion: {
    title: "Leap 伙伴",
    aiBadge: "AI",
    askPd: "Ask PD",
    introBefore:
      "我是 AI 向导，不是牧师或导师——我可以帮你解答经文问题、陪你完成今天的环节，或在你感到卡住时帮你一把。想找真人聊聊？点击",
    introAfter: "联系 Deniss 牧师和团队。",
    clearConfirmTitle: "清除整个对话？",
    clearConfirmBody:
      "这会删除你与伙伴的所有消息，且无法恢复。你已经通过 Ask PD 分享的内容仍会保留给团队。",
    cancel: "取消",
    yesClear: "是的，清除",
    clearConversation: "清除对话",
    crisisBefore:
      "你不必独自面对这一切。如果你正处于紧急危险中，或有伤害自己的念头，请立即寻求帮助。",
    crisisLink: "查找你所在国家的紧急援助 →",
    crisisAfter:
      "你也可以联系你信任的人、当地教会、专业心理咨询师或紧急救助服务。",
    emptyPrompt: "你需要什么帮助？",
    quickPrompts: {
      scripture: "帮我理解今天的经文",
      nextStep: "我的下一步是什么？",
      stuck: "我觉得自己卡住了",
    },
    inputPlaceholder: "问问伙伴…",
    send: "发送",
    errorReply: "抱歉，我现在暂时无法回复——请稍后再试。",
    intentMessages: {
      "new-believer":
        "我刚刚祷告接受了耶稣。我该从哪里开始？我还不确定自己是刚开始跟随耶稣、想读懂圣经、想学习怎样祷告、想在信仰上成长，还是只是对耶稣有些疑问——你能帮我弄清楚该从哪里开始吗？",
      scripture: "你能帮我理解今天的经文吗？",
      devotion: "你能帮我默想今天的灵修吗？",
      "next-step": "我的下一步是什么？",
      materials: "你能给我推荐一些基督教书籍或资料吗？",
    },
  },
};
