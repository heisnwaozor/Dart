import { PollarUser, Project, PublicVote } from '../types';

export interface DatabaseStats {
  engine: string;
  status: string;
  file: string;
  usersCount: number;
  projectsCount: number;
  votesCount: number;
  timestamp: string;
}

export class DatabaseService {
  private static BASE_URL = '';

  public static async getStatus(): Promise<DatabaseStats | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/status`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.stats;
    } catch {
      return null;
    }
  }

  public static async getUsers(): Promise<PollarUser[]> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/users`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.users || [];
    } catch {
      return [];
    }
  }

  public static async getUserByWallet(wallet: string): Promise<PollarUser | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/users/${encodeURIComponent(wallet)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  public static async getUserByEmail(email: string): Promise<PollarUser | null> {
    try {
      if (!email) return null;
      const res = await fetch(`${this.BASE_URL}/api/users/${encodeURIComponent(email)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  public static async sendVerificationCode(
    email: string,
    name: string
  ): Promise<{ ok: boolean; message?: string; verificationToken?: string; devCode?: string; error?: string }> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      return await res.json();
    } catch (err: any) {
      return { ok: false, error: err.message || 'Failed to connect to verification service' };
    }
  }

  public static async verifyCode(
    email: string,
    code: string,
    verificationToken?: string
  ): Promise<{ ok: boolean; verified?: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, verificationToken })
      });
      return await res.json();
    } catch (err: any) {
      return { ok: false, error: err.message || 'Failed to verify code' };
    }
  }

  public static async registerUser(user: Partial<PollarUser>): Promise<PollarUser | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  public static async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/projects`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.projects || [];
    } catch {
      return [];
    }
  }

  public static async createProject(project: Partial<Project>): Promise<Project | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to record project in database');
      }
      const data = await res.json();
      return data.project || null;
    } catch (err: any) {
      throw err;
    }
  }

  public static async getVotes(): Promise<PublicVote[]> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/votes`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.votes || [];
    } catch {
      return [];
    }
  }

  public static async getMyVote(wallet: string): Promise<PublicVote | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/votes/my-vote?wallet=${encodeURIComponent(wallet)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.vote || null;
    } catch {
      return null;
    }
  }

  public static async submitVote(vote: Partial<PublicVote>): Promise<PublicVote | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vote)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to cryptographically record vote in database');
      }
      const data = await res.json();
      return data.vote || null;
    } catch (err: any) {
      throw err;
    }
  }

  public static async resetDatabase(): Promise<DatabaseStats | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/api/reset`, { method: 'POST' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.stats || null;
    } catch {
      return null;
    }
  }
}
