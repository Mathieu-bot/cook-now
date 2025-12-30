import type { RecipeVideoForSection } from './RecipeVideoSection.types';
import { RecipeVideoPlayer } from './RecipeVideoPlayer';
import { useFloatingVideoPlayer } from '../hooks/useFloatingVideoPlayer';
import { RecipeVideoMetadata } from './RecipeVideoMetadata';

type Props = {
  video: RecipeVideoForSection;
  href?: string;
};

function FloatingVideoContainer({ video }: { video: RecipeVideoForSection }) {
  const { isFloating, setFloating, containerRef, floatingStyle, handleDragStart } =
    useFloatingVideoPlayer({ initialFloating: true });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Video
        </h2>
        {!isFloating && (
          <button
            type="button"
            onClick={() => setFloating(true)}
            className="rounded-full bg-zinc-200 px-3 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Use in floating player
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className={
          isFloating
            ? 'fixed z-40 w-full max-w-md overflow-hidden rounded-xl bg-zinc-950/95 shadow-lg'
            : 'mt-3 overflow-hidden rounded-xl bg-black shadow-sm'
        }
        style={floatingStyle}
      >
        {isFloating && (
          <div
            className="flex cursor-move items-center justify-between px-3 py-2 text-xs text-zinc-100"
            onMouseDown={handleDragStart}
          >
            <span className="line-clamp-1">
              {video.title ?? 'Recipe video'}
            </span>
            <button
              type="button"
              onClick={() => setFloating(false)}
              className="ml-3 rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium hover:bg-zinc-700"
            >
              ×
            </button>
          </div>
        )}

        <RecipeVideoPlayer
          videoId={video.providerVideoId}
          title={video.title}
        />
      </div>

      {isFloating && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The video is playing in the floating player. Drag to reposition or click the × to close.
        </p>
      )}
    </>
  );
}

export function YouTubeVideoSection({ video, href }: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <FloatingVideoContainer video={video} />
      <RecipeVideoMetadata video={video} href={href} />
    </section>
  );
}
