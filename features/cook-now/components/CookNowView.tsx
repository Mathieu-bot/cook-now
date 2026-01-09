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
		<PageContainer className="gap-8 lg:gap-12">
			<CookNowHeader />
			<section className="rounded-[32px] border border-emerald-500/10 bg-linear-to-br from-emerald-50 via-emerald-50/40 to-emerald-100/70 p-px shadow-[0_24px_80px_rgba(15,23,42,0.16)] dark:border-emerald-500/25 dark:from-zinc-950 dark:via-zinc-950/80 dark:to-emerald-950">
				<div className="grid gap-6 rounded-[30px] bg-white/95 p-4 backdrop-blur-sm dark:bg-zinc-950/90 sm:p-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2.4fr)] lg:p-7">
					<CookNowSelectionPanel
						initialSelected={ingredients}
						ingredientOptions={ingredientOptions}
					/>
					<CookNowResultsPanel ingredients={ingredients} suggestions={suggestions} />
				</div>
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
