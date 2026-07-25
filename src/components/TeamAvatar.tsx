"use client";

import React, { useState } from "react";

const PROFILE_ICON_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23edf6fc' stroke='%23087dbd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='11' fill='%23edf6fc'/><path d='M18 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 6 18.5V20' fill='none'/><circle cx='12' cy='8.5' r='3.5' fill='%23087dbd' stroke='none'/></svg>";

interface TeamAvatarProps {
  photo?: string | null;
  name: string;
  className?: string;
}

export default function TeamAvatar({
  photo,
  name,
  className = "h-24 w-24 rounded-full object-cover border-4 border-[#087dbd]/10 group-hover:border-[#087dbd]/30 transition-all duration-300 shadow-sm group-hover:scale-105"
}: TeamAvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>(photo || PROFILE_ICON_PLACEHOLDER);

  return (
    <img
      src={imgSrc}
      alt={name}
      onError={() => {
        setImgSrc(PROFILE_ICON_PLACEHOLDER);
      }}
      className={className}
    />
  );
}
