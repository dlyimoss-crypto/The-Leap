import type { CommonMessages } from "../en/common";

export const common: CommonMessages = {
  notTranslated: "暂无中文版本，以下为英文原文。",
  themeToggle: {
    toLight: "切换到浅色模式",
    toDark: "切换到深色模式",
  },
  loading: "加载中",
  notFound: {
    title: "这里没有下一步。",
    body: "此页面不存在。但无论你在哪里，下一步依然在等着你。",
    backToTheLeap: "返回 The Leap",
  },
  authErrors: {
    invalidCredentials: "登录信息不正确",
    emailNotConfirmed: "邮箱尚未验证",
    userAlreadyRegistered: "该用户已注册",
    weakPassword: "密码强度太弱，请设置更长、更难猜到的密码。",
    samePassword: "新密码不能与旧密码相同。",
    invalidEmail: "请输入有效的邮箱地址。",
    rateLimit: "尝试次数过多，请稍等一分钟后再试。",
    generic: "出了点问题，请重试。",
  },
};
