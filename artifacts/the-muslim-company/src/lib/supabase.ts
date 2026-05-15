import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-anon-key";

export const supabase = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY
);

export type Job = {
  id: string;
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
  id: string;
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
  id: string;
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
  id: string;
  title: string;
  category: string;
  content?: string;
  pdf_url?: string;
  important: boolean;
  pinned: boolean;
  created_at: string;
};

export type BlogPost = {
  id: string;
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

export function generateRefNumber(name: string, jobId: number): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 3) || "XX";
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BD/${initials}/${jobId}/${year}/${random}`;
}

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

export const SUPABASE_SETUP_SQL = `
-- Run this SQL in your Supabase SQL editor to set up the database

create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  job_id integer unique not null,
  title text not null,
  slug text unique not null,
  department text not null,
  employment_type text not null,
  location text not null,
  description text not null default '',
  responsibilities text not null default '',
  requirements text not null default '',
  preferred text default '',
  benefits text default '',
  salary text default '',
  deadline date not null,
  status text not null default 'active',
  created_at timestamptz default now()
);

create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  reference_number text unique not null,
  job_id integer not null,
  job_title text not null,
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  education text not null,
  experience text not null,
  skills text not null,
  portfolio text default '',
  cover_letter text not null,
  cv_url text default '',
  status text not null default 'submitted',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists newsroom_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  excerpt text default '',
  content text not null default '',
  image_url text default '',
  featured boolean default false,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists notices (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  content text default '',
  pdf_url text default '',
  important boolean default false,
  pinned boolean default false,
  created_at timestamptz default now()
);

create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  excerpt text default '',
  content text not null default '',
  image_url text default '',
  author text not null default 'The Muslim Company',
  reading_time integer default 5,
  seo_title text default '',
  meta_description text default '',
  published boolean default false,
  created_at timestamptz default now()
);

-- RLS policies (enable row level security)
alter table jobs enable row level security;
alter table applications enable row level security;
alter table newsroom_posts enable row level security;
alter table notices enable row level security;
alter table blog_posts enable row level security;

-- Public read access for published content
create policy "Public can read active jobs" on jobs for select using (status = 'active');
create policy "Public can read published news" on newsroom_posts for select using (published = true);
create policy "Public can read notices" on notices for select using (true);
create policy "Public can read published blogs" on blog_posts for select using (published = true);

-- Public can insert applications
create policy "Public can insert applications" on applications for insert with check (true);

-- Public can read own application by reference number
create policy "Public can read application by ref" on applications for select using (true);

-- Authenticated users (admin) have full access
create policy "Admin full access jobs" on jobs for all using (auth.role() = 'authenticated');
create policy "Admin full access applications" on applications for all using (auth.role() = 'authenticated');
create policy "Admin full access news" on newsroom_posts for all using (auth.role() = 'authenticated');
create policy "Admin full access notices" on notices for all using (auth.role() = 'authenticated');
create policy "Admin full access blogs" on blog_posts for all using (auth.role() = 'authenticated');
`;
