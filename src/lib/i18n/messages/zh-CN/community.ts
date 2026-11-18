import type { CommunityMessages } from "../en/community";

export const community: CommunityMessages = {
  crisisBanner: {
    intro:
      "你不必独自面对这一切。如果你正处于紧急危险中，或有伤害自己的念头，请立即寻求帮助。",
    findSupportLink: "查找你所在国家的紧急援助 →",
    outro: "你也可以联系你信任的人、当地教会、专业心理咨询师或紧急救助服务。",
  },
  timeAgo: {
    justNow: "刚刚",
    minutes: (n: number) => `${n} 分钟前`,
    hours: (n: number) => `${n} 小时前`,
    days: (n: number) => `${n} 天前`,
  },
  communityMember: "一位社群成员",
  report: "举报",

  prayerRoom: {
    heading: "祷告室",
    tabs: {
      requests: "代祷",
      testimonies: "见证",
      mine: "我的",
    },
    emptyRequests: "还没有代祷事项——来发布第一条吧。",
    emptyTestimonies: "还没有见证。",
    emptyMine: "你还没有发布过代祷事项。",
  },
  prayerComposer: {
    placeholder: "分享一个代祷事项…",
    public: "公开",
    private: "私密",
    identified: "署名",
    anonymous: "匿名",
    submitAriaLabel: "发布代祷事项",
  },
  prayerMovement: {
    eyebrow: "一起祷告 5 分钟",
    daysLeft: { one: "还剩 {count} 天", other: "还剩 {count} 天" },
    learnMore: "了解更多",
    prayedCount: "{count} 人已祷告",
    prayed: "已祷告",
    iHavePrayed: "我已祷告",
  },
  prayerRequest: {
    anonymous: "匿名",
    hiddenName: "名字已隐藏",
    status: {
      open: "进行中",
      answered: "已蒙应允",
      hidden: "已隐藏",
      removed: "已移除",
    },
    testimony: "见证",
    prayed: "已祷告",
    pray: "祷告",
    testimonyPlaceholder: "这个祷告是如何蒙应允的？（可选）",
    markAnswered: "标记为已蒙应允",
  },

  communityPage: {
    heading: "社群",
    empty: "还没有帖子——来分享第一条吧。",
  },
  composer: {
    todaysQuestion: "今日问题",
    submitAriaLabel: "发布",
    placeholderPrompts: [
      "分享你的想法…",
      "哪一段经文最激励你？为什么？",
      "这周神在你的生命中做了什么？",
      "你有什么代祷事项，希望社群和你一起记念？",
      "今天有什么小事让你心存感恩？",
      "今天谁需要你的一句鼓励？",
      "此刻你正紧紧抓住哪一个真理？",
      "最近你的信仰教会了你什么？",
      "哪一节经文陪你走过了艰难的时期？",
      "这周你在哪里看见了神的作为？",
      "今天有什么小小的进步值得庆祝？",
      "你正在学习把什么交托给祂？",
      "你想对正在挣扎的人说些什么？",
      "最近有哪个祷告蒙了应允？",
    ],
  },
  postCard: {
    block: "屏蔽",
  },
  postDetail: {
    backToCommunity: "社群",
    noComments: "还没有评论。",
    commentPlaceholder: "添加评论…",
    post: "发布",
  },

  announcement: {
    noLongerRunning: "此公告已结束。",
    backToHome: "返回首页",
    learnMore: "了解更多",
  },
};
