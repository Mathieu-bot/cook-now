import { useRef } from 'react';

type Props = {
  activeType: string;
  typeChips: string[];
  setActiveType: (type: string) => void;
};

export function CookNowTypeChipsBar({ activeType, typeChips, setActiveType }: Props) {
  const typeChipsRef = useRef<HTMLDivElement | null>(null);

  function scrollByAmount(amount: number) {
    const container = typeChipsRef.current;
    if (!container) return;
    container.scrollBy({ left: amount, behavior: 'smooth' });
  }

  return (
    <div className="mt-1 flex items-center">
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => scrollByAmount(-160)}
          className="pointer-events-auto absolute left-0 top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-100 shadow-sm transition hover:bg-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          &lt;
        </button>
        <div
          ref={typeChipsRef}
          className="mx-8 flex gap-2 overflow-x-auto pb-1 text-[11px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => setActiveType('all')}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition ${
              activeType === 'all'
                ? 'bg-zinc-100 text-zinc-900 shadow-sm dark:bg-zinc-50 dark:text-zinc-900'
                : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {typeChips.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition ${
                activeType === type
                  ? 'bg-zinc-100 text-zinc-900 shadow-sm dark:bg-zinc-50 dark:text-zinc-900'
                  : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollByAmount(160)}
          className="pointer-events-auto absolute right-0 top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-100 shadow-sm transition hover:bg-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
