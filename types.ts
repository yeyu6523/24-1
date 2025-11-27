export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'link' | 'file' | 'video';
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'study' | 'project' | 'chat' | 'notice';
  date: string;
  views: number;
  comments: Comment[];
}