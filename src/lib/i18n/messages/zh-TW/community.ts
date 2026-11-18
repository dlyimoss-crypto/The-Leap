import type { CommunityMessages } from "../en/community";

export const community: CommunityMessages = {
  crisisBanner: {
    intro:
      "你不必獨自面對這一切。如果你正處於立即的危險中，或有傷害自己的念頭，請立刻尋求協助。",
    findSupportLink: "尋找你所在國家的緊急支援 →",
    outro: "你也可以聯絡你信任的人、當地教會、專業諮商師或緊急救援單位。",
  },
  timeAgo: {
    justNow: "剛剛",
    minutes: (n: number) => `${n} 分鐘前`,
    hours: (n: number) => `${n} 小時前`,
    days: (n: number) => `${n} 天前`,
  },
  communityMember: "社群成員",
  report: "檢舉",

  prayerRoom: {
    heading: "禱告室",
    tabs: {
      requests: "代禱",
      testimonies: "見證",
      mine: "我的",
    },
    emptyRequests: "目前還沒有代禱事項，歡迎你成為第一位。",
    emptyTestimonies: "目前還沒有見證。",
    emptyMine: "你還沒有發布任何代禱事項。",
  },
  prayerComposer: {
    placeholder: "分享你的代禱事項…",
    public: "公開",
    private: "私人",
    identified: "具名",
    anonymous: "匿名",
    submitAriaLabel: "發布代禱事項",
  },
  prayerMovement: {
    eyebrow: "一起禱告 5 分鐘",
    daysLeft: { one: "還剩 {count} 天", other: "還剩 {count} 天" },
    learnMore: "了解更多",
    prayedCount: "{count} 人已禱告",
    prayed: "已禱告",
    iHavePrayed: "我已經禱告了",
  },
  prayerRequest: {
    anonymous: "匿名",
    hiddenName: "已隱藏姓名",
    status: {
      open: "進行中",
      answered: "已蒙應允",
      hidden: "已隱藏",
      removed: "已移除",
    },
    testimony: "見證",
    prayed: "已禱告",
    pray: "禱告",
    testimonyPlaceholder: "這個禱告是怎麼蒙應允的？（選填）",
    markAnswered: "標示為已蒙應允",
  },

  communityPage: {
    heading: "社群",
    empty: "目前還沒有貼文，歡迎你第一個分享。",
  },
  composer: {
    todaysQuestion: "今日提問",
    submitAriaLabel: "發布",
    placeholderPrompts: [
      "分享你心裡的想法…",
      "最激勵你的經文是哪一段？為什麼？",
      "這週神在你的生命中做了什麼？",
      "有什麼代禱事項，想請這個社群和你一起守望？",
      "今天有哪一件讓你感恩的小事？",
      "今天有誰需要你的鼓勵？",
      "此刻你緊緊抓住的真理是什麼？",
      "最近你的信仰教會了你什麼功課？",
      "哪一節經文陪你走過了艱難的季節？",
      "這週你在哪裡看見神的作為？",
      "今天有什麼值得慶祝的小小勝利？",
      "有什麼事是你正在學習交託給祂的？",
      "你會對此刻正在掙扎的人說什麼？",
      "最近有哪個禱告蒙了應允？",
    ],
  },
  postCard: {
    block: "封鎖",
  },
  postDetail: {
    backToCommunity: "社群",
    noComments: "目前還沒有留言。",
    commentPlaceholder: "新增留言…",
    post: "發布",
  },

  announcement: {
    noLongerRunning: "這則公告已經結束。",
    backToHome: "返回首頁",
    learnMore: "了解更多",
  },
};
