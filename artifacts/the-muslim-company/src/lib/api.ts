// api.ts — Supabase-based drop-in replacement for the old Express API
import { supabase } from './supabase'

export const api = {
  // ─── Jobs ───────────────────────────────────────────────
  async getJobs() {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async getJob(id: number) {
    const { data, error } = await supabase.from('jobs').select('*').eq('job_id', id).single()
    if (error) throw error
    return data
  },
  async getJobBySlug(slug: string) {
    const { data, error } = await supabase.from('jobs').select('*').eq('slug', slug).single()
    if (error) throw error
    return data
  },
  async createJob(job: any) {
    const { data, error } = await supabase.from('jobs').insert(job).select().single()
    if (error) throw error
    return data
  },
  async updateJob(id: number, job: any) {
    const { data, error } = await supabase.from('jobs').update(job).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteJob(id: number) {
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) throw error
  },

  // ─── Applications ────────────────────────────────────────
  async getApplications() {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async getApplication(ref: string) {
    const { data, error } = await supabase.from('applications').select('*').eq('reference_number', ref).single()
    if (error) throw error
    return data
  },
  async createApplication(app: any) {
    const { data, error } = await supabase.from('applications').insert(app).select().single()
    if (error) throw error
    return data
  },
  async updateApplication(id: number, updates: any) {
    const { data, error } = await supabase.from('applications').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  // ─── Newsroom ────────────────────────────────────────────
  async getNewsroomPosts() {
    const { data, error } = await supabase.from('newsroom_posts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async getNewsroomPost(slug: string) {
    const { data, error } = await supabase.from('newsroom_posts').select('*').eq('slug', slug).single()
    if (error) throw error
    return data
  },
  async createNewsroomPost(post: any) {
    const { data, error } = await supabase.from('newsroom_posts').insert(post).select().single()
    if (error) throw error
    return data
  },
  async updateNewsroomPost(id: number, post: any) {
    const { data, error } = await supabase.from('newsroom_posts').update(post).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteNewsroomPost(id: number) {
    const { error } = await supabase.from('newsroom_posts').delete().eq('id', id)
    if (error) throw error
  },

  // ─── Notices ─────────────────────────────────────────────
  async getNotices() {
    const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async createNotice(notice: any) {
    const { data, error } = await supabase.from('notices').insert(notice).select().single()
    if (error) throw error
    return data
  },
  async updateNotice(id: number, notice: any) {
    const { data, error } = await supabase.from('notices').update(notice).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteNotice(id: number) {
    const { error } = await supabase.from('notices').delete().eq('id', id)
    if (error) throw error
  },

  // ─── Blog ────────────────────────────────────────────────
  async getBlogPosts() {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async getBlogPost(slug: string) {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
    if (error) throw error
    return data
  },
  async createBlogPost(post: any) {
    const { data, error } = await supabase.from('blog_posts').insert(post).select().single()
    if (error) throw error
    return data
  },
  async updateBlogPost(id: number, post: any) {
    const { data, error } = await supabase.from('blog_posts').update(post).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteBlogPost(id: number) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) throw error
  },

  // ─── Employees ───────────────────────────────────────────
  async getEmployees() {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async getEmployee(employeeId: string) {
    const { data, error } = await supabase.from('employees').select('*').eq('employee_id', employeeId).single()
    if (error) throw error
    return data
  },
  async updateEmployee(id: number, updates: any) {
    const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteEmployee(id: number) {
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) throw error
  },

  // ─── Tasks ───────────────────────────────────────────────
  async getTasks(employeeId?: string) {
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (employeeId) query = query.eq('employee_id', employeeId)
    const { data, error } = await query
    if (error) throw error
    return data
  },
  async createTask(task: any) {
    const { data, error } = await supabase.from('tasks').insert(task).select().single()
    if (error) throw error
    return data
  },
  async updateTask(id: number, updates: any) {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteTask(id: number) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  },

  // ─── Attendance ──────────────────────────────────────────
  async getAttendance(employeeId?: string) {
    let query = supabase.from('attendance').select('*').order('date', { ascending: false })
    if (employeeId) query = query.eq('employee_id', employeeId)
    const { data, error } = await query
    if (error) throw error
    return data
  },
  async createAttendance(record: any) {
    const { data, error } = await supabase.from('attendance').insert(record).select().single()
    if (error) throw error
    return data
  },
  async updateAttendance(id: number, updates: any) {
    const { data, error } = await supabase.from('attendance').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  // ─── Leave Requests ──────────────────────────────────────
  async getLeaveRequests(employeeId?: string) {
    let query = supabase.from('leave_requests').select('*').order('created_at', { ascending: false })
    if (employeeId) query = query.eq('employee_id', employeeId)
    const { data, error } = await query
    if (error) throw error
    return data
  },
  async createLeaveRequest(req: any) {
    const { data, error } = await supabase.from('leave_requests').insert(req).select().single()
    if (error) throw error
    return data
  },
  async updateLeaveRequest(id: number, updates: any) {
    const { data, error } = await supabase.from('leave_requests').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  // ─── Notifications ───────────────────────────────────────
  async getNotifications(employeeId?: string) {
    let query = supabase.from('employee_notifications').select('*').order('created_at', { ascending: false })
    if (employeeId) query = query.or(`employee_id.eq.${employeeId},broadcast.eq.true`)
    const { data, error } = await query
    if (error) throw error
    return data
  },
  async createNotification(notif: any) {
    const { data, error } = await supabase.from('employee_notifications').insert(notif).select().single()
    if (error) throw error
    return data
  },
  async markNotificationRead(id: number) {
    const { error } = await supabase.from('employee_notifications').update({ is_read: true }).eq('id', id)
    if (error) throw error
  },

  // ─── Documents ───────────────────────────────────────────
  async getDocuments(employeeId?: string) {
    let query = supabase.from('employee_documents').select('*').order('created_at', { ascending: false })
    if (employeeId) query = query.eq('employee_id', employeeId)
    const { data, error } = await query
    if (error) throw error
    return data
  },
  async createDocument(doc: any) {
    const { data, error } = await supabase.from('employee_documents').insert(doc).select().single()
    if (error) throw error
    return data
  },
  async deleteDocument(id: number) {
    const { error } = await supabase.from('employee_documents').delete().eq('id', id)
    if (error) throw error
  },

  // ─── Stats (admin dashboard) ─────────────────────────────
  async getStats() {
    const [jobs, applications, news, notices, blogs, employees] = await Promise.all([
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('applications').select('id', { count: 'exact', head: true }),
      supabase.from('newsroom_posts').select('id', { count: 'exact', head: true }),
      supabase.from('notices').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('employees').select('id', { count: 'exact', head: true }),
    ])
    return {
      jobs:         jobs.count         ?? 0,
      applications: applications.count ?? 0,
      news:         news.count         ?? 0,
      notices:      notices.count      ?? 0,
      blogs:        blogs.count        ?? 0,
      employees:    employees.count    ?? 0,
    }
  },
}

export default api
