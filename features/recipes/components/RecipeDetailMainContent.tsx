import type { RecipeDetail } from '../recipes.types';

type RecipeVideo = {
  id: string;
  provider: string;
  providerVideoId: string;
  title: string | null;
  thumbnailUrl: string | null;
  channelName: string | null;
};

type Props = {
  recipe: RecipeDetail;
};

export function RecipeDetailMainContent({ recipe }: Props) {
  const videos = (recipe.videos ?? []) as RecipeVideo[];
  const hasVideo = videos.length > 0;

  return (
    <article className="space-y-6">
      <section>
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Instructions
        </h2>
        <div className="prose max-w-none whitespace-pre-line rounded-xl bg-white p-4 text-sm text-zinc-800 shadow-sm dark:prose-invert dark:bg-zinc-950 dark:text-zinc-200">
          {recipe.instructions}
        </div>
      </section>

      {hasVideo && (
        <section className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Video
          </h2>
          {videos.map((video) => {
            const isYouTube = video.provider.toLowerCase() === 'youtube';
            const href = isYouTube
              ? `https://www.youtube.com/watch?v=${video.providerVideoId}`
              : undefined;

            return (
              <div key={video.id} className="mt-2 flex items-center gap-3">
                {video.thumbnailUrl && (
                  <a
                    href={href ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-16 w-28 overflow-hidden rounded-md bg-zinc-200"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title ?? 'Recipe video thumbnail'}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </a>
                )}
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
              </div>
            );
          })}
        </section>
      )}

      {recipe.sourceUrl && (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <p>
            <span className="font-medium">Source: </span>
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 underline dark:text-emerald-300"
            >
              {recipe.sourceName || recipe.sourceUrl}
            </a>
          </p>
        </section>
      )}
    </article>
  );
}
