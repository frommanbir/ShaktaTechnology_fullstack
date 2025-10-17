export interface News {
  id: number;
  title: string;
  description?: string;
  category?: string;
  date?: string;
  author?: string;
  read_time?: string;
  featured?: boolean;
  image?: string;
}