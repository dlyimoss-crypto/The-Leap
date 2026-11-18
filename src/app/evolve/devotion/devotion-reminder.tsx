"use client";

import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatTime } from "@/lib/i18n/format";
import {
  getDevotionReminderHour,
  removeDevotionReminder,
  saveDevotionReminder,
  type ReminderSubscription,
} from "./actions";

const DEFAULT_HOUR = 7;

type ReminderMessages = Dictionary["evolve"]["reminder"];

type State =
  | { kind: "checking" }
  | { kind: "unsupported"; needsInstall: boolean }
  | { kind: "denied" }
  | { kind: "off" }
  | { kind: "on"; subscription: PushSubscription; hour: number };

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function formatHour(locale: Locale, hour: number) {
  return formatTime(locale, new Date(2000, 0, 1, hour), {
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function serialize(subscription: PushSubscription) {
  return subscription.toJSON() as ReminderSubscription;
}

function HourSelect({
  value,
  onChange,
  disabled,
  label,
  locale,
}: {
  label: string;
  locale: Locale;
  value: number;
  onChange: (hour: number) => void;
  disabled?: boolean;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-9 rounded-full border bg-background px-3 text-sm"
    >
      {Array.from({ length: 24 }, (_, hour) => (
        <option key={hour} value={hour}>
          {formatHour(locale, hour)}
        </option>
      ))}
    </select>
  );
}

export function DevotionReminder({
  dict,
  locale,
}: {
  dict: ReminderMessages;
  locale: Locale;
}) {
  const [state, setState] = useState<State>({ kind: "checking" });
  const [pendingHour, setPendingHour] = useState(DEFAULT_HOUR);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function init() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        // iPhones only allow web push once The Leap is on the Home Screen.
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setState({ kind: "unsupported", needsInstall: isIOS });
        return;
      }
      if (Notification.permission === "denied") {
        setState({ kind: "denied" });
        return;
      }
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const existing = await registration.pushManager.getSubscription();
      const hour = existing
        ? await getDevotionReminderHour(existing.endpoint)
        : null;
      setState(
        existing && hour !== null
          ? { kind: "on", subscription: existing, hour }
          : { kind: "off" },
      );
    }
    init().catch((err) => {
      console.error("Failed to check devotion reminder", err);
      setState({ kind: "off" });
    });
  }, []);

  async function turnOn() {
    setBusy(true);
    setFailed(false);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? { kind: "denied" } : { kind: "off" });
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
          ),
        }));
      const { ok } = await saveDevotionReminder(
        serialize(subscription),
        pendingHour,
        timeZone(),
      );
      if (ok) {
        setState({ kind: "on", subscription, hour: pendingHour });
      } else {
        setFailed(true);
      }
    } catch (err) {
      console.error("Failed to turn on devotion reminder", err);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function changeHour(subscription: PushSubscription, hour: number) {
    setBusy(true);
    setFailed(false);
    const { ok } = await saveDevotionReminder(
      serialize(subscription),
      hour,
      timeZone(),
    );
    if (ok) {
      setState({ kind: "on", subscription, hour });
    } else {
      setFailed(true);
    }
    setBusy(false);
  }

  async function turnOff(subscription: PushSubscription) {
    setBusy(true);
    await removeDevotionReminder(subscription.endpoint);
    await subscription.unsubscribe().catch(() => {});
    setState({ kind: "off" });
    setBusy(false);
  }

  if (state.kind === "checking") {
    return null;
  }

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2">
        {state.kind === "on" ? (
          <Bell className="size-4 text-primary" />
        ) : (
          <BellOff className="size-4 text-muted-foreground" />
        )}
        <p className="text-sm font-semibold">{dict.heading}</p>
      </div>

      {state.kind === "unsupported" &&
        (state.needsInstall ? (
          <p className="text-sm text-muted-foreground">{dict.needsInstall}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{dict.unsupported}</p>
        ))}

      {state.kind === "denied" && (
        <p className="text-sm text-muted-foreground">{dict.denied}</p>
      )}

      {state.kind === "off" && (
        <>
          <p className="text-sm text-muted-foreground">{dict.offIntro}</p>
          <div className="flex flex-wrap items-center gap-2">
            <HourSelect
              label={dict.timeAriaLabel}
              locale={locale}
              value={pendingHour}
              onChange={setPendingHour}
              disabled={busy}
            />
            <Button
              size="sm"
              className="rounded-full"
              disabled={busy}
              onClick={turnOn}
            >
              {dict.turnOn}
            </Button>
          </div>
        </>
      )}

      {state.kind === "on" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{dict.everyDayAt}</span>
          <HourSelect
            label={dict.timeAriaLabel}
            locale={locale}
            value={state.hour}
            onChange={(hour) => changeHour(state.subscription, hour)}
            disabled={busy}
          />
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full"
            disabled={busy}
            onClick={() => turnOff(state.subscription)}
          >
            {dict.turnOff}
          </Button>
        </div>
      )}

      {failed && (
        <p className="text-sm text-destructive">
          {dict.failed}
        </p>
      )}
    </div>
  );
}
