import type { RecipeVideoForSection } from './RecipeVideoSection.types';

type Props = {
  video: RecipeVideoForSection;
  href?: string;
};

export function RecipeVideoMetadata({ video, href }: Props) {
  return (
    <div className="space-y-1 text-xs">
      <p className="font-medium">
        {video.title ?? 'Watch video'}
      </p>
      {video.channelName && (
        <p className="text-zinc-500 dark:text-zinc-400">{video.channelName}</p>
      )}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-700 underline dark:text-emerald-300"
        >
          Open on YouTube
        </a>
      )}
    </div>
  );
}
