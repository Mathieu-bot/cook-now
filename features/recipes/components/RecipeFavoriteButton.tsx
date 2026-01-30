'use client';

import UseAnimations from 'react-useanimations';
import heart from 'react-useanimations/lib/heart';
import { useRecipeFavorite } from '../hooks/useRecipeFavorite';

type Props = {
	slug: string;
};

export function RecipeFavoriteButton({ slug }: Props) {
	const { isFavorite, isLoading, isSaving, toggleFavorite } = useRecipeFavorite(slug);

	const isBusy = isLoading || isSaving;

	function handleClick() {
		if (isBusy) return;
		void toggleFavorite();
	}

	return (
		<button
			type="button"
			disabled={isBusy}
			onClick={handleClick}
			aria-pressed={isFavorite}
			aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs transition ${
				isFavorite
					? 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-500'
					: 'border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
			} ${isBusy ? 'opacity-70 cursor-not-allowed' : ''}`}
		>
			<span className="sr-only">
				{isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			</span>
			<UseAnimations
				animation={heart}
				size={20}
				autoplay={false}
				loop={false}
				reverse={!isFavorite}
			/>
		</button>
	);
}
