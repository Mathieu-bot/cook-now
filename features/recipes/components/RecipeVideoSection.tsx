"use client";

import type { RecipeVideoForSection } from './RecipeVideoSection.types';
import { NonYouTubeVideoSection } from './NonYouTubeVideoSection';
import { YouTubeVideoSection } from './YouTubeVideoSection';

type Props = {
  videos: unknown[];
};

export function RecipeVideoSection({ videos }: Props) {
  const typedVideos = (videos ?? []) as RecipeVideoForSection[];
  const hasVideo = typedVideos.length > 0;

  if (!hasVideo) return null;

  const primary = typedVideos[0];
  const isYouTube = primary.provider.toLowerCase() === 'youtube';
  const href = isYouTube
    ? `https://www.youtube.com/watch?v=${primary.providerVideoId}`
    : undefined;

  if (!isYouTube) {
    return <NonYouTubeVideoSection video={primary} href={href} />;
  }

  return <YouTubeVideoSection video={primary} href={href} />;
}
