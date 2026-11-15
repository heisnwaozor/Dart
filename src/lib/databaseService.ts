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
