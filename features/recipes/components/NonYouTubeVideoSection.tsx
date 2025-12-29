import type { RecipeVideoForSection } from './RecipeVideoSection.types';
import { RecipeVideoMetadata } from './RecipeVideoMetadata';

type Props = {
  video: RecipeVideoForSection;
  href?: string;
};

export function NonYouTubeVideoSection({ video, href }: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Video
      </h2>

      {video.thumbnailUrl && (
        <a
          href={href ?? '#'}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-xl bg-zinc-200"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title ?? 'Recipe video thumbnail'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </a>
      )}

      <RecipeVideoMetadata video={video} href={href} />
    </section>
  );
}
