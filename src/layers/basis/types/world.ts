export type BackendWorld = {
  id: string;
  user_id: number;
  name: string;
  slug?: string;
  predecessor?: string;
  data_url?: string;
  up_to_date: boolean;
};
