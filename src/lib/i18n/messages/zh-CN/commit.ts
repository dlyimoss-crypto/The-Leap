import type { CommitMessages } from "../en/commit";

export const commit: CommitMessages = {
  commitPage: {
    backToHome: "首页",
    heading: "委身",
    subheading: "我选择基督的道路。",
    journeyCardTitle: "旅程",
    journeyCardDescription: "继续你的旅程，或浏览新的旅程。",
    thisWeeksCommitment: "本周承诺",
    weekOfProgress: (weekOf: string, done: number, total: number) =>
      `${weekOf} 当周——已完成 ${done}/${total} 项`,
    markAsKept: "标记为已完成",
    checkAllToMarkAsKept: (total: number) =>
      `勾选全部 ${total} 项即可标记为已完成`,
    intro: "每周三项操练——小到你真的能坚持下去。",
    commitToThisWeek: "立下本周承诺",
    keptCommitments: "已完成的承诺",
    weekOf: (weekOf: string) => `${weekOf} 当周`,
  },
  commitmentItems: {
    scripture_done: {
      label: "研读 5 段圣经",
      detail: "本周每天",
    },
    prayer_done: {
      label: "祷告 5–15 分钟",
      detail: "本周每天",
    },
    witness_done: {
      label: "传福音",
      detail: "本周至少一次",
    },
  },
  journeyChooser: {
    backToCommit: "委身",
    heading: "旅程",
    subheading: "与基督同行的多日结构化路径。",
    continueTitle: "继续你的旅程",
    continueDescription: "从上次停下的地方继续。",
    browseTitle: "浏览旅程",
    browseDescription: "探索其他可以开始的塑造旅程。",
  },
  browseJourneys: {
    backToJourney: "旅程",
    heading: "浏览旅程",
    intro: "每个塑造旅程都有自己的路径——选一个最贴近你现状的开始吧。",
    durationLabel: (days: number) => `${days} 天旅程`,
    completedReview: "已完成——回顾",
    percentContinue: (pct: number) => `已完成 ${pct}%——继续`,
    start: "开始",
    empty: "暂时还没有可用的旅程——请稍后再来看看。",
  },
  journeyOverview: {
    durationLabel: (days: number) => `${days} 天塑造旅程`,
    startJourney: "开始旅程",
  },
  journeyDay: {
    dayOf: (day: number, total: number) => `第 ${day} 天，共 ${total} 天`,
    gatedHeading: "明天再来吧",
    gatedBody:
      "今天花些时间祷告，好好默想你刚读到的内容——明天回来时，下一步就会开启。",
    backToHome: "返回首页",
    continue: "继续",
    continueTo: (topic: string) => `继续：${topic}`,
  },
  formationLoop: {
    scripture: "经文",
    message: "信息",
    explore: "探索",
    reflect: "反思",
    pray: "祷告",
    nextStep: "下一步",
    engage: "参与",
  },
  connectPage: {
    backToHome: "首页",
    heading: "连结",
    subheading: "我有归属。",
    prayerRoomTitle: "祷告室",
    prayerRoomDescription: "为人祷告，彼此扶持，也接受代祷。",
    churchesTitle: "教会",
    churchesDescription: "寻找本地教会，融入教会群体。",
    askPdTitle: "Ask PD",
    askPdDescription: "给 Deniss 牧师和团队发消息，或预约通话。",
    companionTitle: "Leap 伙伴",
    companionDescription: "寻求帮助、代祷，或找到你的下一步。",
  },
  churches: {
    backToChurches: "返回教会列表",
    backToConnect: "连结",
    notFound: "找不到该教会信息。",
    leadPastor: (name: string) => `主任牧师：${name}`,
    service: (time: string) => `聚会时间：${time}`,
    members: (n: number) => `约 ${n} 名会友`,
    heading: "教会",
    intro: "寻找本地教会，融入教会群体。",
    empty: "暂时还没有教会信息——请稍后再来看看。",
    serviceTimeNotListed: "未列出聚会时间",
  },
  hubCard: {
    comingSoon: "即将推出",
  },
};
