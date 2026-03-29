
export interface Career {
  id: number;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  description: string;
  requirements: string;
  benefits?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Keep DetaType for compatibility for now, but mark it as deprecated if possible
export type DetaType = Omit<Career, 'id'>;
