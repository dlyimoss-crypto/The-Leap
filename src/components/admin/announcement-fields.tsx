"use client";

import { useState } from "react";
import { ChipListInput } from "@/components/admin/chip-list-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ANNOUNCEMENT_KINDS,
  type AnnouncementKind,
} from "@/lib/announcement-kinds";
import type { AdminMessages } from "@/lib/i18n/messages/en/admin";

// The kind picker plus every field whose relevance depends on it — Prayer
// gets scripture and prayer points, Event gets a date. Image, message and
// link apply to every kind.
export function AnnouncementFields({
  defaults,
  prayerPointSuggestions,
  currentImageUrl,
  dict,
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
  dict: AdminMessages["announcementFields"];
}) {
  const [kind, setKind] = useState<AnnouncementKind>(
    defaults?.kind ?? "prayer",
  );
  const placeholder = dict.placeholders[kind];

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="kind">{dict.type}</Label>
        <select
          id="kind"
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as AnnouncementKind)}
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
        >
          {ANNOUNCEMENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {dict.kinds[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">{dict.title}</Label>
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
          {dict.message}
          {kind === "prayer" ? dict.optionalSuffix : ""}
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
          <Label htmlFor="event_date">{dict.eventDate}</Label>
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
              {dict.scriptureReferenceOptional}
            </Label>
            <Input
              id="scripture_reference"
              name="scripture_reference"
              placeholder={dict.scripturePlaceholder}
              defaultValue={defaults?.scripture_reference ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{dict.prayerPoints}</Label>
            <ChipListInput
              name="prayer_points"
              defaultValue={defaults?.prayer_points ?? []}
              suggestions={prayerPointSuggestions}
              placeholder={dict.prayerPointPlaceholder}
              labels={dict.chipList}
            />
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="image">{dict.imageOptional}</Label>
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
              {dict.removeImage}
            </label>
          </div>
        )}
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="link_url">{dict.linkOptional}</Label>
          <Input
            id="link_url"
            name="link_url"
            placeholder={dict.linkPlaceholder}
            defaultValue={defaults?.link_url ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link_label">{dict.buttonText}</Label>
          <Input
            id="link_label"
            name="link_label"
            placeholder={dict.buttonTextPlaceholder}
            defaultValue={defaults?.link_label ?? ""}
          />
        </div>
      </div>
    </>
  );
}
