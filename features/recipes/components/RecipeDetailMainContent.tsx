import type { RecipeDetail } from '../recipes.types';
import { RecipeInstructionsSection } from './RecipeInstructionsSection';
import { RecipeVideoSection } from './RecipeVideoSection';
import { RecipeNotesSection } from './RecipeNotesSection';
import { RecipeSourceSection } from './RecipeSourceSection';

type Props = {
  recipe: RecipeDetail;
};

export function RecipeDetailMainContent({ recipe }: Props) {
  return (
    <article className="space-y-6">
      <RecipeInstructionsSection instructions={recipe.instructions} />
      <RecipeVideoSection videos={recipe.videos} />
      <RecipeNotesSection />
      <RecipeSourceSection
        sourceUrl={recipe.sourceUrl}
        sourceName={recipe.sourceName}
      />
    </article>
  );
}
