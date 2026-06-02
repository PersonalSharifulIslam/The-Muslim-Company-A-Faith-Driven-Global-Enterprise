import { supabase } from './supabase'

async function routeGet(path: string): Promise<any> {
  if (path === '/admin/stats') {
    const [j,a,n,no,b,e] = await Promise.all([
      supabase.from('jobs').select('id'),
      supabase.from('applications').select('id'),
      supabase.from('newsroom_posts').select('id'),
      supabase.from('notices').select('id'),
      supabase.from('blog_posts').select('id'),
      supabase.from('employees').select('id'),
    ])
    return { jobs: j.data?.length??0, applications: a.data?.length??0, news: n.data?.length??0, notices: no.data?.length??0, blogs: b.data?.length??0, employees: e.data?.length??0 }
  }
  if (path === '/admin/jobs' || path === '/jobs') {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  if (path === '/admin/applications' || path === '/applications') {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  if (path === '/admin/newsroom' || path === '/newsroom') {
    const { data, error } = await supabase.from('newsroom_posts').select('*').order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  if (path === '/admin/notices' || path === '/notices') {
    const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  if (path === '/admin/blog' || path === '/blog') {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  if (path === '/admin/employees' || path === '/employees') {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  if (path.startsWith('/jobs/')) {
    const slug = path.replace('/jobs/', '')
    const { data, error } = await supabase.from('jobs').select('*').eq('slug', slug).single()
    if (error) throw error; return data
  }
  if (path.startsWith('/newsroom/')) {
    const slug = path.replace('/newsroom/', '')
    const { data, error } = await supabase.from('newsroom_posts').select('*').eq('slug', slug).single()
    if (error) throw error; return data
  }
  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '')
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
    if (error) throw error; return data
  }
  if (path.startsWith('/recruitment-status/')) {
    const ref = decodeURIComponent(path.replace('/recruitment-status/', '')).toUpperCase()
    const { data, error } = await supabase.from('applications').select('*').ilike('reference_number', ref).single()
    if (error) throw error; return data
  }
  if (path === '/employee/notifications') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (!role?.employee_id) return []
    const { data, error } = await supabase.from('employee_notifications').select('*').or(`employee_id.eq.${role.employee_id},broadcast.eq.true`).order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  if (path === '/employee/documents') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (!role?.employee_id) return []
    const { data, error } = await supabase.from('employee_documents').select('*').eq('employee_id', role.employee_id)
    if (error) throw error; return data
  }
  if (path === '/employee/profile') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (!role?.employee_id) return null
    const { data, error } = await supabase.from('employees').select('*').eq('employee_id', role.employee_id).single()
    if (error) throw error; return data
  }
  if (path === '/employee/tasks') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (!role?.employee_id) return []
    const { data, error } = await supabase.from('tasks').select('*').eq('employee_id', role.employee_id)
    if (error) throw error; return data
  }
  if (path === '/employee/attendance') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (!role?.employee_id) return []
    const { data, error } = await supabase.from('attendance').select('*').eq('employee_id', role.employee_id).order('date', { ascending: false })
    if (error) throw error; return data
  }
  if (path === '/employee/leave') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (!role?.employee_id) return []
    const { data, error } = await supabase.from('leave_requests').select('*').eq('employee_id', role.employee_id).order('created_at', { ascending: false })
    if (error) throw error; return data
  }
  throw new Error(`GET ${path} not implemented`)
}

async function routePost(path: string, body: any): Promise<any> {
  if (path === '/admin/jobs') {
    const { data, error } = await supabase.from('jobs').insert(body).select().single()
    if (error) throw error; return data
  }
  if (path === '/admin/newsroom') {
    const { data, error } = await supabase.from('newsroom_posts').insert(body).select().single()
    if (error) throw error; return data
  }
  if (path === '/admin/notices') {
    const { data, error } = await supabase.from('notices').insert(body).select().single()
    if (error) throw error; return data
  }
  if (path === '/admin/blog') {
    const { data, error } = await supabase.from('blog_posts').insert(body).select().single()
    if (error) throw error; return data
  }
  if (path === '/apply' || path.includes('/apply')) {
    const { data, error } = await supabase.from('applications').insert(body).select().single()
    if (error) throw error; return data
  }
  if (path === '/employee/leave') {
    const { data, error } = await supabase.from('leave_requests').insert(body).select().single()
    if (error) throw error; return data
  }
  if (path === '/employee/attendance') {
    const { data, error } = await supabase.from('attendance').insert(body).select().single()
    if (error) throw error; return data
  }
  if (path === '/admin/employees') {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ''
    const res = await fetch('/api/admin/create-employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    const result = await res.json() as any
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Failed to create employee')
    }
    return result.employee
  }
  throw new Error(`POST ${path} not implemented`)
}

async function routePut(path: string, body: any): Promise<any> {
  const jobMatch = path.match(/^\/admin\/jobs\/(\d+)$/)
  if (jobMatch) {
    const { data, error } = await supabase.from('jobs').update(body).eq('id', parseInt(jobMatch[1])).select().single()
    if (error) throw error; return data
  }
  const appMatch = path.match(/^\/admin\/applications\/(\d+)$/)
  if (appMatch) {
    const { data, error } = await supabase.from('applications').update(body).eq('id', parseInt(appMatch[1])).select().single()
    if (error) throw error; return data
  }
  const newsMatch = path.match(/^\/admin\/newsroom\/(\d+)$/)
  if (newsMatch) {
    const { data, error } = await supabase.from('newsroom_posts').update(body).eq('id', parseInt(newsMatch[1])).select().single()
    if (error) throw error; return data
  }
  const noticeMatch = path.match(/^\/admin\/notices\/(\d+)$/)
  if (noticeMatch) {
    const { data, error } = await supabase.from('notices').update(body).eq('id', parseInt(noticeMatch[1])).select().single()
    if (error) throw error; return data
  }
  const blogMatch = path.match(/^\/admin\/blog\/(\d+)$/)
  if (blogMatch) {
    const { data, error } = await supabase.from('blog_posts').update(body).eq('id', parseInt(blogMatch[1])).select().single()
    if (error) throw error; return data
  }
  const empMatch = path.match(/^\/admin\/employees\/(\d+)$/)
  if (empMatch) {
    const { data, error } = await supabase.from('employees').update(body).eq('id', parseInt(empMatch[1])).select().single()
    if (error) throw error; return data
  }
  if (path === '/employee/profile') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (!role?.employee_id) throw new Error('No employee')
    const { data, error } = await supabase.from('employees').update(body).eq('employee_id', role.employee_id).select().single()
    if (error) throw error; return data
  }
  if (path === '/employee/profile/password') {
    const { error } = await supabase.auth.updateUser({ password: body.new_password })
    if (error) throw error; return { success: true }
  }
  const notifMatch = path.match(/^\/employee\/notifications\/(\d+)\/read$/)
  if (notifMatch) {
    const { error } = await supabase.from('employee_notifications').update({ is_read: true }).eq('id', parseInt(notifMatch[1]))
    if (error) throw error; return { success: true }
  }
  if (path === '/employee/notifications/read-all') {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user?.id ?? '').single()
    if (role?.employee_id) {
      await supabase.from('employee_notifications').update({ is_read: true }).eq('employee_id', role.employee_id)
    }
    return { success: true }
  }
  const taskMatch = path.match(/^\/employee\/tasks\/(\d+)$/)
  if (taskMatch) {
    const { data, error } = await supabase.from('tasks').update(body).eq('id', parseInt(taskMatch[1])).select().single()
    if (error) throw error; return data
  }
  const attMatch = path.match(/^\/employee\/attendance\/(\d+)$/)
  if (attMatch) {
    const { data, error } = await supabase.from('attendance').update(body).eq('id', parseInt(attMatch[1])).select().single()
    if (error) throw error; return data
  }
  throw new Error(`PUT ${path} not implemented`)
}

async function routeDel(path: string): Promise<any> {
  const jobMatch = path.match(/^\/admin\/jobs\/(\d+)$/)
  if (jobMatch) {
    const { error } = await supabase.from('jobs').delete().eq('id', parseInt(jobMatch[1]))
    if (error) throw error; return { success: true }
  }
  const newsMatch = path.match(/^\/admin\/newsroom\/(\d+)$/)
  if (newsMatch) {
    const { error } = await supabase.from('newsroom_posts').delete().eq('id', parseInt(newsMatch[1]))
    if (error) throw error; return { success: true }
  }
  const noticeMatch = path.match(/^\/admin\/notices\/(\d+)$/)
  if (noticeMatch) {
    const { error } = await supabase.from('notices').delete().eq('id', parseInt(noticeMatch[1]))
    if (error) throw error; return { success: true }
  }
  const blogMatch = path.match(/^\/admin\/blog\/(\d+)$/)
  if (blogMatch) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', parseInt(blogMatch[1]))
    if (error) throw error; return { success: true }
  }
  const empMatch = path.match(/^\/admin\/employees\/(\d+)$/)
  if (empMatch) {
    const { error } = await supabase.from('employees').delete().eq('id', parseInt(empMatch[1]))
    if (error) throw error; return { success: true }
  }
  throw new Error(`DELETE ${path} not implemented`)
}

export const api = {
  get:  (path: string, _auth?: boolean) => routeGet(path),
  post: (path: string, body: any, _auth?: boolean) => routePost(path, body),
  put:  (path: string, body: any, _auth?: boolean) => routePut(path, body),
  del:  (path: string, _auth?: boolean) => routeDel(path),
  patch:(path: string, body: any, _auth?: boolean) => routePut(path, body),
  getStats: () => routeGet('/admin/stats'),
  getJobs: () => routeGet('/admin/jobs'),
  createJob: (data: any) => routePost('/admin/jobs', data),
  updateJob: (id: number, data: any) => routePut(`/admin/jobs/${id}`, data),
  deleteJob: (id: number) => routeDel(`/admin/jobs/${id}`),
  getApplications: () => routeGet('/admin/applications'),
  updateApplication: (id: number, data: any) => routePut(`/admin/applications/${id}`, data),
  getNotifications: (_empId: string) => routeGet('/employee/notifications'),
  markNotificationRead: (id: number) => routePut(`/employee/notifications/${id}/read`, {}),
  getDocuments: (_empId: string) => routeGet('/employee/documents'),
  getEmployee: (_empId: string) => routeGet('/employee/profile'),
  updateEmployee: (_id: number, data: any) => routePut('/employee/profile', data),
}

export default api
