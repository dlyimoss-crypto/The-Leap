import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { LOCALE_INFO, type Locale } from "@/lib/i18n/locales";
import type { ContentType } from "./content";

// AI drafting of content translations. Server-only: the API key never
// reaches the browser. A draft is always saved as `awaiting_review` by the
// caller — nothing here publishes anything.

const MODEL = "claude-opus-5-5";

export type GlossaryEntry = { source_term: string; approved_term: string; notes: string | null };

export type TranslatableValue = string | string[] | null;

export type DraftResult = {
  fields: Record<string, TranslatableValue>;
  /** Things the reviewer should check (uncertain terms, Bible quotations). */
  notes: string;
};

/** The standard public-domain Bible tradition each language's vocabulary follows. */
const BIBLE_TRADITION: Partial<Record<Locale, string>> = {
  sw: "the Swahili Union Version (Biblia Takatifu)",
  de: "the Luther Bible (1912)",
  fr: "the Louis Segond Bible (1910)",
  es: "the Reina-Valera Bible (1909)",
  "zh-CN": "the Chinese Union Version (和合本, 神 edition, Simplified characters)",
};

const CONTENT_LABEL: Record<ContentType, string> = {
  journey: "the overview of a multi-day discipleship journey",
  journey_day: "one day (Session) of a discipleship journey",
  devotion: "a daily devotion",
  announcement: "a community announcement",
};

// Fixed text first and identical for every request in a language, so the
// prompt cache can reuse it while an admin drafts many items in a row.
function systemPrompt(locale: Locale, glossary: GlossaryEntry[]): string {
  const language = LOCALE_INFO[locale].englishName;
  const tradition = BIBLE_TRADITION[locale] ?? "the standard Bible translation in that language";
  const glossaryLines = glossary.length
    ? glossary
        .map((g) => `- ${g.source_term} → ${g.approved_term}${g.notes ? ` (${g.notes})` : ""}`)
        .join("\n")
    : "(none yet)";

  return `You translate content for The Leap, a Christ-centred discipleship app ("Your Essential Companion in Christ"), from English into ${language}. A native-speaking reviewer will check every translation before anyone reads it.

What matters, in order:
1. Biblical and theological meaning. Use the established vocabulary of ${language}-speaking evangelical churches, the tradition of ${tradition}. Never add, soften, sharpen or reinterpret a theological claim; if the English is ambiguous, keep the same ambiguity.
2. The author's intention and voice: warm, personal, plain-spoken encouragement. Keep the same register and the same way of addressing the reader (use the informal "you" form ${language} discipleship material normally uses).
3. Natural ${language}. Translate meaning, not words: a native reader should not be able to tell it was translated. Keep paragraph breaks and line breaks exactly where they are.
4. Cultural sensitivity: keep illustrations as they are, but phrase them so they make sense to a ${language} reader.

Scripture:
- Keep every Bible reference (e.g. "John 3:16", "Romans 8:28-39") exactly as written, in English.
- When the text quotes a Bible verse, use the wording of ${tradition} only if you are certain of it word for word. Otherwise leave that quotation in English, inside quotation marks, and mention it in the notes. Never invent or paraphrase a verse and present it as Scripture.

Never translate: "The Leap", "Ask PD", "Pastor Deniss", "PD team", names of people and places, URLs, email addresses.

Use these approved terms (from the reviewers' glossary) wherever they apply:
${glossaryLines}

Return only the JSON requested. Put any field that is empty in the English as null. In "notes", tell the reviewer, briefly and in English, anything they should check: a term you weren't sure of, a Bible quotation you left in English, an idiom you had to adapt. Use an empty string if there is nothing.`;
}

function outputSchema(fields: string[], source: Record<string, TranslatableValue>) {
  const properties: Record<string, unknown> = {
    notes: { type: "string" },
  };
  for (const field of fields) {
    properties[field] = Array.isArray(source[field])
      ? { type: "array", items: { type: "string" } }
      : { type: ["string", "null"] };
  }
  return {
    type: "object",
    properties,
    required: [...fields, "notes"],
    additionalProperties: false,
  };
}

export class TranslationError extends Error {}

/**
 * Drafts a translation of one content item. Throws TranslationError with
 * a message an admin can act on; never saves anything itself.
 */
export async function draftTranslation({
  type,
  locale,
  source,
  glossary,
}: {
  type: ContentType;
  locale: Locale;
  source: Record<string, TranslatableValue>;
  glossary: GlossaryEntry[];
}): Promise<DraftResult> {
  if (locale === "en") throw new TranslationError("English is the source language.");
  if (!process.env.ANTHROPIC_API_KEY) throw new TranslationError("ANTHROPIC_API_KEY is not set.");

  const fields = Object.keys(source);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let message: Anthropic.Beta.BetaMessage;
  try {
    message = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 32000,
        // A false-positive safety decline (e.g. a devotion about suicide or
        // abuse) is retried on a fallback model instead of failing.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: {
          effort: "high",
          format: { type: "json_schema", schema: outputSchema(fields, source) },
        },
        system: [
          { type: "text", text: systemPrompt(locale, glossary), cache_control: { type: "ephemeral" } },
        ],
        messages: [
          {
            role: "user",
            content: `Translate ${CONTENT_LABEL[type]} into ${LOCALE_INFO[locale].englishName}. Each JSON field is one part of it; translate each into the field of the same name.\n\n${JSON.stringify(source, null, 2)}`,
          },
        ],
      })
      .finalMessage();
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      throw new TranslationError("The AI service is busy. Wait a minute and try again.");
    }
    if (error instanceof Anthropic.AuthenticationError) {
      throw new TranslationError("The Anthropic API key was rejected.");
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Translation request failed", error.status, error.message);
      throw new TranslationError(`The AI service returned an error (${error.status ?? "network"}).`);
    }
    throw error;
  }

  if (message.stop_reason === "refusal") {
    throw new TranslationError("The AI declined to translate this item. Please translate it by hand.");
  }
  if (message.stop_reason === "max_tokens") {
    throw new TranslationError("This item is too long to translate in one go.");
  }

  const text = message.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new TranslationError("The AI's answer couldn't be read. Try again.");
  }

  const result: Record<string, TranslatableValue> = {};
  for (const field of fields) {
    const value = parsed[field];
    if (Array.isArray(value)) result[field] = value.map(String);
    else result[field] = typeof value === "string" && value.trim() !== "" ? value : null;
  }
  return { fields: result, notes: typeof parsed.notes === "string" ? parsed.notes.trim() : "" };
}
