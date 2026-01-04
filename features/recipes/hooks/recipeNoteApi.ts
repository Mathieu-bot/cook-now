type Note = {
  text: string;
  updatedAt: string;
};

type NoteResponse = {
  note: Note | null;
};

export type LoadRecipeNoteResult =
  | { kind: 'ok'; note: Note | null }
  | { kind: 'unauthorized' }
  | { kind: 'not-found' }
  | { kind: 'error' };

export type SaveRecipeNoteResult =
  | { kind: 'ok'; note: Note | null }
  | { kind: 'unauthorized' }
  | { kind: 'error' };

export async function loadRecipeNote(slug: string): Promise<LoadRecipeNoteResult> {
  try {
    const res = await fetch(`/api/recipes/${slug}/note`, {
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

    const data = (await res.json()) as NoteResponse;
    return { kind: 'ok', note: data.note ?? null };
  } catch {
    return { kind: 'error' };
  }
}

export async function saveRecipeNote(slug: string, text: string): Promise<SaveRecipeNoteResult> {
  try {
    const res = await fetch(`/api/recipes/${slug}/note`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (res.status === 401) {
      return { kind: 'unauthorized' };
    }

    if (!res.ok) {
      return { kind: 'error' };
    }

    const data = (await res.json()) as NoteResponse;
    return { kind: 'ok', note: data.note ?? null };
  } catch {
    return { kind: 'error' };
  }
}
