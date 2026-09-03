export type ConversationMessage = { role: "user" | "assistant"; content: string };

/**
 * Anthropic's Messages API expects strictly alternating user/assistant
 * turns. A failed insert earlier in the conversation could otherwise leave
 * two consecutive same-role rows in history — merge instead of sending
 * that as-is.
 */
export function toAlternatingTurns(
  messages: ConversationMessage[],
): ConversationMessage[] {
  const merged: ConversationMessage[] = [];
  for (const message of messages) {
    const last = merged[merged.length - 1];
    if (last && last.role === message.role) {
      last.content = `${last.content}\n\n${message.content}`;
    } else {
      merged.push({ ...message });
    }
  }
  return merged;
}
