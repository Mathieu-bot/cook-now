type FavoriteResponse = {
  isFavorite: boolean;
};

export type LoadRecipeFavoriteResult =
  | { kind: 'ok'; isFavorite: boolean }
  | { kind: 'unauthorized' }
  | { kind: 'not-found' }
  | { kind: 'error' };

export type SaveRecipeFavoriteResult =
  | { kind: 'ok'; isFavorite: boolean }
  | { kind: 'unauthorized' }
  | { kind: 'error' };

export async function loadRecipeFavorite(slug: string): Promise<LoadRecipeFavoriteResult> {
  try {
    const res = await fetch(`/api/recipes/${slug}/favorite`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 401) {
      return { kind: 'unauthorized' };
    }

    if (res.status === 404) {
      return { kind: 'not-found' };
    }

    if (!res.ok) {
      return { kind: 'error' };
    }

    const data = (await res.json()) as FavoriteResponse;
    return { kind: 'ok', isFavorite: Boolean(data.isFavorite) };
  } catch {
    return { kind: 'error' };
  }
}

export async function saveRecipeFavorite(slug: string, favorite: boolean): Promise<SaveRecipeFavoriteResult> {
  try {
    const res = await fetch(`/api/recipes/${slug}/favorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ favorite }),
    });

    if (res.status === 401) {
      return { kind: 'unauthorized' };
    }

    if (!res.ok) {
      return { kind: 'error' };
    }

    const data = (await res.json()) as FavoriteResponse;
    return { kind: 'ok', isFavorite: Boolean(data.isFavorite) };
  } catch {
    return { kind: 'error' };
  }
}
