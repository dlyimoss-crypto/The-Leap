import type { CommonMessages } from "../en/common";

export const common: CommonMessages = {
  themeToggle: {
    toLight: "切換為淺色模式",
    toDark: "切換為深色模式",
  },
  loading: "載入中",
  notFound: {
    title: "這裡沒有下一步。",
    body: "這個頁面不存在，但無論你在哪裡，下一步依然在等著你。",
    backToTheLeap: "返回 The Leap",
  },
  authErrors: {
    invalidCredentials: "登入資訊不正確",
    emailNotConfirmed: "電子郵件尚未確認",
    userAlreadyRegistered: "這個使用者已經註冊過了",
    weakPassword: "這個密碼強度太弱，請設定更長、更難猜到的密碼。",
    samePassword: "新密碼不能與舊密碼相同。",
    invalidEmail: "請輸入有效的電子郵件地址。",
    rateLimit: "嘗試次數過多，請稍候一分鐘再試。",
    generic: "發生錯誤，請再試一次。",
  },
};
