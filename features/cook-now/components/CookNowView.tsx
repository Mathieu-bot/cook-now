"use client";

import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import type { CookNowSuggestion } from '@/features/recipes/recipes.types';
import type { CookNowIngredientOption } from '../cookNow.types';
import { CookNowSelectionPanel } from './CookNowSelectionPanel';
import { CookNowResultsPanel } from './CookNowResultsPanel';

type CookNowViewProps = {
	ingredients: string[];
	suggestions: CookNowSuggestion[];
	ingredientOptions: CookNowIngredientOption[];
};

export function CookNowView({ ingredients, suggestions, ingredientOptions }: CookNowViewProps) {
	return (
		<PageContainer className="gap-8 lg:gap-10">
			<CookNowHeader />
			<section className="grid gap-6 rounded-[30px] bg-white/95 dark:bg-zinc-950/80 p-0 sm:px-2 sm:py-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2.4fr)]">
				<CookNowSelectionPanel
					initialSelected={ingredients}
					ingredientOptions={ingredientOptions}
				/>
				<CookNowResultsPanel ingredients={ingredients} suggestions={suggestions} />
			</section>
			<CookNowFooter />
		</PageContainer>
	);
}

function CookNowHeader() {
	return (
		<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div className="max-w-2xl">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
					CookNow
				</p>
				<h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
					Cook with what you have
				</h1>
				<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
					Pick the ingredients in your kitchen and we&apos;ll surface recipes you can actually make tonight.
				</p>
			</div>
		</header>
	);
}

function CookNowFooter() {
	return (
		<section className="border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
			<p>
				CookNow focuses on quick decisions and reducing waste. Use it to get unstuck when you&apos;re staring at your fridge.
			</p>
			<p className="mt-1">
				Want to browse everything instead?{' '}
				<Link
					href="/recipes"
					className="font-medium text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
				>
					Explore all recipes
				</Link>
				.
			</p>
		</section>
	);
}
