"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

interface ImageUploadProps {
  defaultUrl?: string;
  onChange?: (url: string | null) => void;
  endpoint: keyof OurFileRouter;
}

const ImageUpload = ({ defaultUrl, onChange, endpoint }: ImageUploadProps) => {
  const [value, setValue] = useState<string | null>(defaultUrl ?? null);
  const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);

  const handleChangeImage = (url: string | null) => {
    setValue(url);
    onChange?.(url);
  };

  if (!showDropzone && value) {
    return (
      <div className="relative">
        <div className="relative w-25 h-25 shadow-lg overflow-hidden rounded-full">
          <Image src={value} className="object-cover" fill alt="user image" />
        </div>

        <div className="flex mt-3 gap-2">
          <Button className="absolute rounded-full right-0 top-0 bg-white opacity-60 hover:opacity-100 cursor-pointer shadow-2xl p-2 m-2">
            <Trash />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint={endpoint}
        content={{
          label: value
            ? "Drop or click to replace the image"
            : "Drop or click to upload an image",
        }}
        appearance={{ container: "rounded-xl border" }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.ufsUrl;

          if (url) {
            setShowDropzone(false);
            handleChangeImage(url);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
};

export default ImageUpload;
