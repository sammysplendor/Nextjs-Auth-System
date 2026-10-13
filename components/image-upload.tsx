"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";
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
          <Image
            src={value}
            className="object-cover"
            fill
            alt="user image"
            sizes="100px"
            loading="eager"
          />
        </div>

        <div className="flex mt-3 gap-2">
          <Trash className="absolute rounded-full right-0 top-0 text-rose-600 cursor-pointer" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <UploadDropzone
        endpoint={endpoint}
        content={{
          label: value
            ? "Drop or click to replace the image"
            : "Drop or click to upload an image",
        }}
        appearance={{
          container: "rounded-xl border",
          button: "!bg-white !text-black",
        }}
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
    </div>
  );
};

export default ImageUpload;
