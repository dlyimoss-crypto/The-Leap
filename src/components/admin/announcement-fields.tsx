"use client";

import { useState } from "react";
import { ChipListInput } from "@/components/admin/chip-list-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ANNOUNCEMENT_KINDS,
  ANNOUNCEMENT_KIND_LABELS,
  type AnnouncementKind,
} from "@/lib/announcement-kinds";

const PLACEHOLDERS: Record<AnnouncementKind, { title: string; body: string }> = {
  prayer: {
    title: "e.g. Let's pray for Nepal",
    body: "Why we're praying and what's at stake (optional)",
  },
  news: {
    title: "e.g. The Leap is now available in Swahili",
    body: "Share the update in a few short sentences",
  },
  event: {
    title: "e.g. Night of Worship in Dar es Salaam",
    body: "What, where and who it's for",
  },
  advert: {
    title: "e.g. New book: Rooted in Grace",
    body: "What you're promoting and why it matters",
  },
  general: {
    title: "e.g. A word for this season",
    body: "Your message",
  },
};

// The kind picker plus every field whose relevance depends on it — Prayer
// gets scripture and prayer points, Event gets a date. Image, message and
// link apply to every kind.
export function AnnouncementFields({
  defaults,
  prayerPointSuggestions,
  currentImageUrl,
}: {
  defaults?: {
    kind: AnnouncementKind;
    title: string;
    body: string | null;
    link_url: string | null;
    link_label: string | null;
    event_date: string | null;
    scripture_reference: string | null;
    prayer_points: string[];
  };
  prayerPointSuggestions: readonly string[];
  currentImageUrl: string | null;
}) {
  const [kind, setKind] = useState<AnnouncementKind>(
    defaults?.kind ?? "prayer",
  );
  const placeholder = PLACEHOLDERS[kind];

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="kind">Type</Label>
        <select
          id="kind"
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as AnnouncementKind)}
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
        >
          {ANNOUNCEMENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {ANNOUNCEMENT_KIND_LABELS[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder={placeholder.title}
          defaultValue={defaults?.title}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">
          Message{kind === "prayer" ? " (optional)" : ""}
        </Label>
        <Textarea
          id="body"
          name="body"
          rows={4}
          placeholder={placeholder.body}
          defaultValue={defaults?.body ?? ""}
        />
      </div>

      {kind === "event" && (
        <div className="space-y-1.5">
          <Label htmlFor="event_date">Event date</Label>
          <Input
            id="event_date"
            name="event_date"
            type="date"
            defaultValue={defaults?.event_date ?? ""}
          />
        </div>
      )}

      {kind === "prayer" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="scripture_reference">
              Scripture reference (optional)
            </Label>
            <Input
              id="scripture_reference"
              name="scripture_reference"
              placeholder="e.g. Psalm 67:1-2"
              defaultValue={defaults?.scripture_reference ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Prayer points</Label>
            <ChipListInput
              name="prayer_points"
              defaultValue={defaults?.prayer_points ?? []}
              suggestions={prayerPointSuggestions}
              placeholder="Type a prayer point, then press Enter"
            />
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="image">Image (optional)</Label>
        {currentImageUrl && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt=""
              className="size-14 rounded-lg object-cover"
            />
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input type="checkbox" name="remove_image" />
              Remove image
            </label>
          </div>
        )}
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="link_url">Link (optional)</Label>
          <Input
            id="link_url"
            name="link_url"
            placeholder="https://… or /evolve/books"
            defaultValue={defaults?.link_url ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link_label">Button text</Label>
          <Input
            id="link_label"
            name="link_label"
            placeholder="e.g. Register"
            defaultValue={defaults?.link_label ?? ""}
          />
        </div>
      </div>
    </>
  );
}
