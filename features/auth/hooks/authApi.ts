export type AuthUser = {
  id: string;
  email: string;
};

type AuthSuccess = {
  ok: true;
  user: AuthUser;
};

type AuthFailure = {
  ok: false;
  message: string;
};

export type AuthResult = AuthSuccess | AuthFailure;

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonSafe<{ user?: AuthUser; error?: string }>(res);

    if (!res.ok || !data?.user) {
      return {
        ok: false,
        message: data?.error ?? "We couldn't log you in. Please check your details and try again.",
      };
    }

    return { ok: true, user: data.user };
  } catch {
    return {
      ok: false,
      message: 'Unable to reach the server. Please try again.',
    };
  }
}

export async function register(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonSafe<{ user?: AuthUser; error?: string }>(res);

    if (!res.ok || !data?.user) {
      return {
        ok: false,
        message: data?.error ?? "We couldn't create your account. Please check your details and try again.",
      };
    }

    return { ok: true, user: data.user };
  } catch {
    return {
      ok: false,
      message: 'Unable to reach the server. Please try again.',
    };
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      return null;
    }

    const data = await parseJsonSafe<{ user: AuthUser | null }>(res);
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    return res.ok;
  } catch {
    return false;
  }
}
