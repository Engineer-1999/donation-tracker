export type Project = {
  id: string;
  created_at: string;
  name: string;
  target_goal: string;
  progress: string;
  image_url: string;
  color: string;
  is_published: boolean;
  user_id: string;
  history: null;
};

export type Transaction = {
  id: string;
  created_at: string;
  project_id: string;
  name: string;
  amount: string;
};