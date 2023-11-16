export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          active: boolean;
          created_at: string;
          id: number;
          period: number;
          pool: number;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: number;
          period?: number;
          pool?: number;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: number;
          period?: number;
          pool?: number;
        };
        Relationships: [];
      };
      leaderboard: {
        Row: {
          created_at: string;
          i0: number;
          o0: number;
          id: string;
          score: number;
          user: string;
        };
        Insert: {
          created_at?: string;
          i0?: number;
          o0?: number;
          id?: string;
          score?: number;
          user?: string;
        };
        Update: {
          created_at?: string;
          i0?: number;
          o0?: number;
          id?: string;
          score?: number;
          user?: string;
        };
        Relationships: [];
      };
      leaderboardmg: {
        Row: {
          created_at: string;
          i0: number;
          o0: number;
          id: string;
          score: number;
          user: string;
        };
        Insert: {
          created_at?: string;
          i0?: number;
          o0?: number;
          id?: string;
          score?: number;
          user?: string;
        };
        Update: {
          created_at?: string;
          i0?: number;
          o0?: number;
          id?: string;
          score?: number;
          user?: string;
        };
        Relationships: [];
      };
      logs: {
        Row: {
          amount: number | null;
          game: number | null;
          id: string;
          period: number | null;
          player: string | null;
        };
        Insert: {
          amount?: number | null;
          game?: number | null;
          id?: string;
          period?: number | null;
          player?: string | null;
        };
        Update: {
          amount?: number | null;
          game?: number | null;
          id?: string;
          period?: number | null;
          player?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "logs_game_fkey";
            columns: ["game"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          }
        ];
      };
      players: {
        Row: {
          balance: number;
          game: number;
          id: string;
          player: string;
          count: number;
        };
        Insert: {
          balance?: number | null;
          game?: number | null;
          id?: string;
          player?: string | null;
        };
        Update: {
          balance?: number | null;
          game?: number | null;
          id?: string;
          player?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "players_game_fkey";
            columns: ["game"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      addpool: {
        Args: {
          amount: number;
          game_id: number;
          perio: number;
        };
        Returns: undefined;
      };
      poolfn: {
        Args: {
          amount: number;
          game_id: number;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
