export type Job = {
  id: number;
  job_id: number;
  title: string;
  slug: string;
  department: string;
  employment_type: string;
  location: string;
  description: string;
  responsibilities: string;
  requirements: string;
  preferred?: string;
  benefits?: string;
  salary?: string;
  deadline: string;
  status: "active" | "inactive";
  created_at: string;
};

export type Application = {
  id: number;
  reference_number: string;
  job_id: number;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string;
  portfolio?: string;
  cover_letter: string;
  cv_url?: string;
  status: "submitted" | "under_review" | "shortlisted" | "interview_scheduled" | "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
};

export type NewsPost = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
};

export type Notice = {
  id: number;
  title: string;
  category: string;
  content?: string;
  pdf_url?: string;
  important: boolean;
  pinned: boolean;
  created_at: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  author: string;
  reading_time: number;
  seo_title?: string;
  meta_description?: string;
  published: boolean;
  created_at: string;
};

export const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<string, string> = {
  submitted: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  under_review: "text-yellow-500 bg-yellow-400/10 border-yellow-400/20",
  shortlisted: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  interview_scheduled: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  pending: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  accepted: "text-green-400 bg-green-400/10 border-green-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
};
