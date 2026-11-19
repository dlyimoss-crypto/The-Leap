import type { CommonMessages } from "../en/common";

export const common: CommonMessages = {
  notTranslated: "暂无中文版本，以下为英文原文。",
  offline: {
    banner: "你目前处于离线状态。之前打开过的页面仍可使用；更改内容需要联网。",
    title: "你目前处于离线状态",
    body: "此页面尚未保存在这台设备上。你仍可阅读联网时打开过的页面。",
    savedHeading: "已保存在此设备上",
    nothingSaved: "尚未保存任何内容。联网时打开的灵修、旅程日和经文会保存在这里，供离线阅读。",
    retry: "重试",
  },
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
