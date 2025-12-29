'use client';

import React from 'react';

type Props = {
  videoId: string;
  title?: string | null;
};

export function RecipeVideoPlayer({ videoId, title }: Props) {
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1`;

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-sm aspect-video">
      <iframe
        src={src}
        title={title ?? 'Recipe video player'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
