export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'DELETE';
  title: string;
  description: string;
  path: string;
  auth: boolean;
  params?: ApiParam[];
  tabs: CodeTab[];
  tryIt?: 'signin' | 'listings';
}

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface CodeTab {
  label: string;
  code: string;
}

export interface QuickStartStep {
  title: string;
  description: string;
  code: string;
}

export interface StackItem {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  color: 'green' | 'blue';
}

export interface RepoItem {
  name: string;
  description: string;
  language: string;
  langColor: string;
  visibility: string;
  url: string;
}

export interface RoadmapItem {
  icon: string;
  title: string;
  description: string;
  status: 'live' | 'building' | 'planned';
}
