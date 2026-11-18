import type { EvolveMessages } from "../en/evolve";

export const evolve: EvolveMessages = {
  hub: {
    tagline: "我正在成长。",
    scriptureTitle: "经文",
    scriptureDescription: "阅读、搜索、研读并收藏神的话语。",
    devotionTitle: "每日灵修",
    devotionDescription: "停下来，默想，在今天的灵修中与神相遇。",
    booksTitle: "书籍与读物",
    booksDescription: "通过书籍、教导和精选资源更深地扎根。",
  },
  devotion: {
    heading: "每日灵修",
    subheading: "停下来，默想，在今天的灵修中与神相遇。",
    lockedHeading: "你今天已经从往期中选读过一篇了",
    lockedBody:
      "每天可以阅读一篇往期灵修——这一篇明天会再次开放。下方的今日灵修仍然可以阅读。",
    backToToday: "返回今日灵修",
    reflection: "反思",
    prayer: "祷告",
    practice: "实践",
    empty: "还没有发布任何灵修——请稍后再来看看。",
    pastDevotions: "往期灵修",
    tomorrow: "明天",
  },
  reminder: {
    heading: "每日提醒",
    timeAriaLabel: "提醒时间",
    needsInstall:
      "要在 iPhone 上接收每日提醒，请先将 The Leap 添加到主屏幕：点击“分享”按钮，再选择“添加到主屏幕”，然后从主屏幕打开 The Leap。",
    unsupported: "此浏览器不支持通知。",
    denied:
      "The Leap 的通知已被屏蔽。请在浏览器的网站设置中允许通知，以接收每日提醒。",
    offIntro: "如果你当天还没读灵修，我们每天会温柔地提醒你一下。",
    turnOn: "每天提醒我",
    everyDayAt: "每天",
    turnOff: "关闭",
    failed: "保存提醒时出了点问题，请重试。",
  },
  reminderPush: {
    title: "今天的灵修已准备好",
  },
  scripture: {
    heading: "经文",
    subheading: "阅读、搜索、研读并收藏神的话语。",
    tabs: {
      bible: "圣经",
      plans: "计划",
      favorites: "收藏",
    },
    plansTitle: "读经计划",
    plansDescription: "引导式读经计划即将推出。",
    favoritesEmpty: "在“圣经”标签页中收藏经文，就会显示在这里。",
    remove: "移除",
  },
  bible: {
    comingSoonSuffix: " · 即将推出",
    searchPlaceholder: "John 3:16，或输入要查找的字词…",
    search: "搜索",
    attribution: "经文出自 Berean Standard Bible (BSB)，属公共领域。",
    oldTestament: "旧约",
    newTestament: "新约",
    allBooks: "所有书卷",
    verseNotInBsb: "BSB 依据最古老的抄本，未收录此节经文。",
    readChapter: "阅读 {reference}",
    noMatches: "没有与“{q}”匹配的经文。",
    versesContaining: {
      one: "{count} 节经文包含“{q}”",
      other: "{count} 节经文包含“{q}”",
    },
    showingFirst: "显示包含“{q}”的 {total} 节经文中的前 {shown} 节",
    notFound: "在圣经中找不到“{reference}”。",
    saved: "已收藏",
    save: "收藏",
  },
};
