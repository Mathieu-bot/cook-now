export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';

export default function FavoritesPage() {
  redirect('/recipes?favoritesOnly=1');
}
