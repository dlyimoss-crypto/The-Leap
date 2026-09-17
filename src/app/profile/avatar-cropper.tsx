"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper, { type Area } from "react-easy-crop";
import { Camera } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { updateAvatar } from "./actions";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function getCroppedImageBlob(
  imageSrc: string,
  cropPixels: Area,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    size,
    size,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to crop image"))),
      "image/jpeg",
      0.9,
    );
  });
}

export function AvatarCropper({
  displayName,
  avatarUrl,
  dict,
}: {
  displayName: string | null;
  avatarUrl: string | null;
  dict: Dictionary["profile"];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setImageSrc(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  function handleCancel() {
    setImageSrc(null);
  }

  async function handleSave() {
    if (!imageSrc || !croppedArea) {
      return;
    }
    setSaving(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedArea);
      const formData = new FormData();
      formData.set("avatar", blob, "avatar.jpg");
      await updateAvatar(formData);
      setImageSrc(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to save cropped avatar", err);
    } finally {
      setSaving(false);
    }
  }

  if (imageSrc) {
    return (
      <div className="space-y-3">
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, area) => setCroppedArea(area)}
          />
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label={dict.zoom}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={saving}
          >
            {dict.cancel}
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? dict.saving : dict.savePhoto}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {avatarUrl ? (
        <Dialog>
          <DialogTrigger
            className="cursor-zoom-in rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={dict.viewPhoto}
          >
            <Avatar
              name={displayName}
              src={avatarUrl}
              className="size-16 text-lg"
            />
          </DialogTrigger>
          <DialogContent
            showCloseButton
            className="flex max-w-sm items-center justify-center bg-transparent p-0 ring-0 sm:max-w-md"
          >
            <DialogTitle className="sr-only">{dict.viewPhoto}</DialogTitle>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Avatar name={displayName} src={avatarUrl} className="size-16 text-lg" />
      )}
      <div className="space-y-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="size-3.5" />
          {dict.changePhoto}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
