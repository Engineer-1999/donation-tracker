export type ProjectSettings = {
  shape?: 'circle' | 'square' | 'rounded';
  padding?: number;
  displacement?: number;
  showPercentage?: boolean;
  description?: string;
  descriptionPosition?: 'top' | 'bottom';
  showAllNumbers?: boolean;
  allNumbersPosition?: 'top' | 'bottom';
  size?: number;
};

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
  settings: ProjectSettings;
};

export type Transaction = {
  id: string;
  created_at: string;
  project_id: string;
  name: string;
  amount: string;
};
