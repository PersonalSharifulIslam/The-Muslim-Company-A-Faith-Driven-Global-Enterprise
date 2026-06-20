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
    if (error) throw error
    // Attach each employee's current access_level (user_roles.role) for display in the admin UI.
    const ids = (data || []).map((e: any) => e.employee_id).filter(Boolean)
    if (ids.length) {
      const { data: roleRows } = await supabase.from('user_roles').select('employee_id, role, department').in('employee_id', ids)
      const roleMap = new Map((roleRows || []).map((r: any) => [r.employee_id, r]))
      return (data || []).map((e: any) => ({
        ...e,
        access_level: roleMap.get(e.employee_id)?.role || 'employee',
        access_department: roleMap.get(e.employee_id)?.department || null,
      }))
    }
    return data
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
  if (path === '/employee/dashboard') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Get employee profile
    const { data: roleData } = await supabase
      .from('user_roles').select('employee_id').eq('id', user.id).single()
    if (!roleData?.employee_id) throw new Error('Employee not found')

    const { data: emp, error: empErr } = await supabase
      .from('employees').select('*').eq('employee_id', roleData.employee_id).single()
    if (empErr) throw empErr

    // Get today's attendance
    const todayStr = new Date().toISOString().split('T')[0]
    const { data: todayAtt } = await supabase
      .from('attendance').select('*')
      .eq('employee_id', roleData.employee_id)
      .eq('date', todayStr)
      .maybeSingle()

    // Get attendance summary (this month)
    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
    const { data: attendance } = await supabase
      .from('attendance').select('*')
      .eq('employee_id', roleData.employee_id)
      .gte('date', startOfMonth.toISOString().split('T')[0])

    // Get pending leave requests
    const { data: leaves } = await supabase
      .from('leave_requests').select('*')
      .eq('employee_id', roleData.employee_id)
      .eq('status', 'pending')

    // Get pending tasks
    const { data: tasks } = await supabase
      .from('tasks').select('*')
      .eq('employee_id', roleData.employee_id)
      .eq('status', 'pending')

    // Get unread notifications
    const { data: notifications } = await supabase
      .from('employee_notifications').select('*')
      .eq('employee_id', roleData.employee_id)
      .eq('read', false)

    const presentDays = attendance?.filter((a: any) => a.status === 'present').length || 0
    const absentDays = attendance?.filter((a: any) => a.status === 'absent').length || 0
    const doneTasks = tasks?.filter((t: any) => t.status === 'done' || t.status === 'completed').length || 0

    return {
      employee: emp,
      today_attendance: todayAtt ? {
        check_in: todayAtt.check_in,
        check_out: todayAtt.check_out,
        working_hours: todayAtt.working_hours,
        status: todayAtt.status,
      } : null,
      stats: {
        present: presentDays,
        absent: absentDays,
        totalAttendance: attendance?.length || 0,
        pendingLeaves: leaves?.length || 0,
        pendingTasks: tasks?.length || 0,
        doneTasks,
        unreadNotifications: notifications?.length || 0,
      },
      leave_stats: [
        { status: 'pending', count: String(leaves?.length || 0) },
      ],
      task_stats: [
        { status: 'pending', count: String(tasks?.length || 0) },
        { status: 'done', count: String(doneTasks) },
      ],
      unread_notifications: notifications?.length || 0,
      recent_tasks: tasks?.slice(0, 5) || [],
      recent_notifications: notifications?.slice(0, 5) || [],
      recentAttendance: attendance?.slice(0, 5) || [],
      pendingLeaves: leaves || [],
    }
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
  // Admin: attendance
  if (path === '/admin/attendance') {
    const { data, error } = await supabase.from('attendance')
      .select('*, employees(name, department, position)')
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: tasks
  if (path === '/admin/tasks') {
    const { data, error } = await supabase.from('tasks')
      .select('*, employees(name, department)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: payroll
  if (path === '/admin/payroll') {
    const { data, error } = await supabase.from('payroll')
      .select('*, employees(name, department, position)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: departments
  if (path === '/admin/departments') {
    const { data, error } = await supabase.from('departments')
      .select('*').order('name')
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: get all leave requests
  if (path === '/admin/leaves') {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*, employees(name, department, position)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Attendance
  if (path === '/admin/attendance') {
    const { data, error } = await supabase
      .from('attendance').select('*, employees(name, department, position)')
      .order('date', { ascending: false }).limit(200)
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Tasks
  if (path === '/admin/tasks') {
    const { data, error } = await supabase
      .from('tasks').select('*, employees(name, department)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Payroll
  if (path === '/admin/payroll') {
    const { data, error } = await supabase
      .from('payroll').select('*, employees(name, department, position)')
      .order('month', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Departments
  if (path === '/admin/departments') {
    const { data, error } = await supabase
      .from('departments').select('*').order('name')
    if (error) throw new Error(error.message)
    return data
  }

  // Employee: own payslips
  if (path === '/employee/payroll') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: roleData } = await supabase.from('user_roles').select('employee_id').eq('id', user.id).single()
    if (!roleData?.employee_id) throw new Error('Employee not found')
    const { data, error } = await supabase.from('payroll').select('*')
      .eq('employee_id', roleData.employee_id).order('month', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Attendance
  if (path === '/admin/attendance') {
    const { data, error } = await supabase
      .from('attendance')
      .select('*, employees(name, department, position)')
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Tasks
  if (path === '/admin/tasks') {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, employees(name, department, position)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Payroll
  if (path === '/admin/payroll') {
    const { data, error } = await supabase
      .from('payroll')
      .select('*, employees(name, department, position)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Departments
  if (path === '/admin/departments') {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw new Error(error.message)
    return data
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: roleData } = await supabase.from('user_roles').select('employee_id').eq('id', user.id).single()
    if (!roleData?.employee_id) throw new Error('Employee not found')
    const { leave_type, start_date, end_date, reason } = body
    if (!leave_type || !start_date || !end_date || !reason) throw new Error('All fields are required')
    const days = Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000*60*60*24)) + 1
    if (days < 1) throw new Error('End date must be after start date')
    const { data, error } = await supabase.from('leave_requests').insert({
      employee_id: roleData.employee_id,
      leave_type,
      start_date,
      end_date,
      reason,
      days,
      status: 'pending',
    }).select().single()
    if (error) throw new Error(error.message)
    return data
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
  // Admin: create task
  if (path === '/admin/tasks') {
    const { employee_id, title, description, priority, deadline } = body
    if (!employee_id || !title) throw new Error('Employee and title required')
    const { data, error } = await supabase.from('tasks').insert({
      employee_id, title,
      description: description || '',
      priority: priority || 'medium',
      status: 'pending',
      progress: 0,
      deadline: deadline || null,
      assigned_by: 'admin',
    }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: create payroll
  if (path === '/admin/payroll') {
    const { employee_id, month, basic_salary, allowances, deductions, payment_method, notes } = body
    if (!employee_id || !month || !basic_salary) throw new Error('Required fields missing')
    const net = Number(basic_salary) + Number(allowances || 0) - Number(deductions || 0)
    const { data, error } = await supabase.from('payroll').insert({
      employee_id, month,
      basic_salary: Number(basic_salary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      net_salary: net,
      status: 'pending',
      payment_method: payment_method || 'bank_transfer',
      notes: notes || '',
    }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: create department
  if (path === '/admin/departments') {
    const { name, description } = body
    if (!name) throw new Error('Department name required')
    const { data, error } = await supabase.from('departments')
      .insert({ name, description: description || '' }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: manual attendance
  if (path === '/admin/attendance') {
    const { employee_id, date, check_in, check_out, status } = body
    if (!employee_id || !date) throw new Error('Required fields missing')
    const { data, error } = await supabase.from('attendance').upsert({
      employee_id, date,
      check_in: check_in || null,
      check_out: check_out || null,
      status: status || 'present',
    }, { onConflict: 'employee_id,date' }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Employee attendance checkin
  if (path === '/employee/attendance/checkin') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user.id).single()
    if (!role?.employee_id) throw new Error('Employee not found')
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const { data: existing } = await supabase.from('attendance')
      .select('*').eq('employee_id', role.employee_id).eq('date', today).maybeSingle()
    if (existing?.check_in) throw new Error('Already checked in today')
    const { data: att, error } = await supabase.from('attendance').upsert({
      employee_id: role.employee_id,
      date: today,
      check_in: now.toISOString(),
      status: 'present',
    }, { onConflict: 'employee_id,date' }).select().single()
    if (error) throw error
    return att
  }

  // Employee attendance checkout
  if (path === '/employee/attendance/checkout') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user.id).single()
    if (!role?.employee_id) throw new Error('Employee not found')
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const { data: existing } = await supabase.from('attendance')
      .select('*').eq('employee_id', role.employee_id).eq('date', today).maybeSingle()
    if (!existing?.check_in) throw new Error('Please check in first')
    const checkInTime = new Date(existing.check_in)
    const hoursWorked = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    const { data: att, error } = await supabase.from('attendance')
      .update({ check_out: now.toISOString(), working_hours: Math.round(hoursWorked * 10) / 10 })
      .eq('employee_id', role.employee_id).eq('date', today).select().single()
    if (error) throw error
    return att
  }

  // Employee leave request
  if (path === '/employee/leave') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: role } = await supabase.from('user_roles').select('employee_id').eq('id', user.id).single()
    if (!role?.employee_id) throw new Error('Employee not found')
    const { leave_type, start_date, end_date, reason } = body
    if (!leave_type || !start_date || !end_date || !reason) throw new Error('All fields are required')
    // Calculate days
    const start = new Date(start_date)
    const end = new Date(end_date)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    if (days < 1) throw new Error('End date must be after start date')
    const { data: leave, error } = await supabase.from('leave_requests').insert({
      employee_id: role.employee_id,
      leave_type,
      start_date,
      end_date,
      reason,
      days,
      status: 'pending',
    }).select().single()
    if (error) throw new Error(error.message)
    return leave
  }

  // Admin: Create task
  if (path === '/admin/tasks') {
    const { employee_id, title, description, priority, deadline } = body
    if (!employee_id || !title) throw new Error('Employee and title required')
    const { data, error } = await supabase.from('tasks').insert({
      employee_id, title,
      description: description || '',
      priority: priority || 'medium',
      deadline: deadline || null,
      status: 'pending',
      assigned_by: 'admin',
      progress: 0,
    }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Manual attendance entry
  if (path === '/admin/attendance') {
    const { employee_id, date, check_in, check_out, status, working_hours } = body
    if (!employee_id || !date) throw new Error('Employee and date required')
    const { data, error } = await supabase.from('attendance').upsert({
      employee_id, date,
      check_in: check_in || null,
      check_out: check_out || null,
      status: status || 'present',
      working_hours: working_hours || null,
    }, { onConflict: 'employee_id,date' }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Create payroll
  if (path === '/admin/payroll') {
    const { employee_id, month, basic_salary, allowances, deductions, payment_method, notes } = body
    if (!employee_id || !month) throw new Error('Employee and month required')
    const net = (Number(basic_salary) || 0) + (Number(allowances) || 0) - (Number(deductions) || 0)
    const { data, error } = await supabase.from('payroll').upsert({
      employee_id, month,
      basic_salary: Number(basic_salary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      net_salary: net,
      payment_method: payment_method || 'bank_transfer',
      notes: notes || '',
      status: 'pending',
    }, { onConflict: 'employee_id,month' }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Create department
  if (path === '/admin/departments') {
    const { name, description, head_employee_id } = body
    if (!name) throw new Error('Department name required')
    const { data, error } = await supabase.from('departments').insert({
      name, description: description || '', head_employee_id: head_employee_id || ''
    }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Create Task
  if (path === '/admin/tasks') {
    const { employee_id, title, description, priority, deadline, assigned_by } = body
    if (!employee_id || !title) throw new Error('Employee and title required')
    const { data, error } = await supabase.from('tasks').insert({
      employee_id, title,
      description: description || '',
      priority: priority || 'medium',
      status: 'pending',
      progress: 0,
      deadline: deadline || null,
      assigned_by: assigned_by || 'Admin',
    }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Create Payroll
  if (path === '/admin/payroll') {
    const { employee_id, month, basic_salary, allowances, deductions, payment_method, notes } = body
    if (!employee_id || !month || !basic_salary) throw new Error('Employee, month and salary required')
    const net = Number(basic_salary) + Number(allowances || 0) - Number(deductions || 0)
    const { data, error } = await supabase.from('payroll').insert({
      employee_id, month,
      basic_salary: Number(basic_salary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      net_salary: net,
      status: 'pending',
      payment_method: payment_method || 'bank_transfer',
      notes: notes || '',
    }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Create Department
  if (path === '/admin/departments') {
    const { name, description, head_employee_id } = body
    if (!name) throw new Error('Department name required')
    const { data, error } = await supabase.from('departments').insert({
      name, description: description || '', head_employee_id: head_employee_id || null,
    }).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Manual attendance entry
  if (path === '/admin/attendance') {
    const { employee_id, date, check_in, check_out, status, note } = body
    if (!employee_id || !date) throw new Error('Employee and date required')
    const { data, error } = await supabase.from('attendance').upsert({
      employee_id, date,
      check_in: check_in || null,
      check_out: check_out || null,
      status: status || 'present',
      note: note || '',
    }, { onConflict: 'employee_id,date' }).select().single()
    if (error) throw new Error(error.message)
    return data
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
    // access_level/access_department drive user_roles, not the employees table itself
    const { access_level, access_department, ...empBody } = body
    const { data, error } = await supabase.from('employees').update(empBody).eq('id', parseInt(empMatch[1])).select().single()
    if (error) throw error
    // If an access level was supplied, sync it into user_roles for this employee
    const VALID_ACCESS_LEVELS = ['admin','executive','vp','director','hr_manager','finance_manager','department_manager','team_lead','recruiter','content_editor','employee']
    if (access_level && VALID_ACCESS_LEVELS.includes(access_level) && data?.employee_id) {
      await supabase.from('user_roles')
        .update({ role: access_level, department: access_department ?? data.department ?? null })
        .eq('employee_id', data.employee_id)
    }
    return data
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
  // Admin: update task
  const taskMatch_2 = path.match(/^\/admin\/tasks\/(\d+)$/)
  if (taskMatch_2) {
    const { data, error } = await supabase.from('tasks')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', taskMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: update payroll
  const payrollMatch = path.match(/^\/admin\/payroll\/(\d+)$/)
  if (payrollMatch) {
    const updates = { ...body, updated_at: new Date().toISOString() }
    if (body.basic_salary !== undefined) {
      updates.net_salary = Number(body.basic_salary) + Number(body.allowances || 0) - Number(body.deductions || 0)
    }
    const { data, error } = await supabase.from('payroll')
      .update(updates).eq('id', payrollMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: update department
  const deptMatch = path.match(/^\/admin\/departments\/(\d+)$/)
  if (deptMatch) {
    const { data, error } = await supabase.from('departments')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', deptMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: update attendance
  const attMatch_2 = path.match(/^\/admin\/attendance\/(\d+)$/)
  if (attMatch_2) {
    const { data, error } = await supabase.from('attendance')
      .update(body).eq('id', attMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: update leave status
  const leaveMatch = path.match(/^\/admin\/leaves\/(\d+)$/)
  if (leaveMatch) {
    const { status, admin_note, start_date, end_date } = body
    const updates: any = {}
    if (status) updates.status = status
    if (admin_note !== undefined) updates.admin_note = admin_note
    if (start_date) updates.start_date = start_date
    if (end_date) updates.end_date = end_date
    if (start_date && end_date) {
      const days = Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000*60*60*24)) + 1
      updates.days = days
    }
    updates.updated_at = new Date().toISOString()
    const { data, error } = await supabase
      .from('leave_requests').update(updates)
      .eq('id', leaveMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update task
  const taskMatch_3 = path.match(/^\/admin\/tasks\/(\d+)$/)
  if (taskMatch_3) {
    const { data, error } = await supabase.from('tasks')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', taskMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Employee: Update own task progress
  const empTaskMatch = path.match(/^\/employee\/tasks\/(\d+)$/)
  if (empTaskMatch) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: roleData } = await supabase.from('user_roles').select('employee_id').eq('id', user.id).single()
    const { status, progress } = body
    const { data, error } = await supabase.from('tasks')
      .update({ status, progress, updated_at: new Date().toISOString() })
      .eq('id', empTaskMatch[1]).eq('employee_id', roleData?.employee_id).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update payroll status
  const payrollMatch_2 = path.match(/^\/admin\/payroll\/(\d+)$/)
  if (payrollMatch_2) {
    const updates: any = { ...body, updated_at: new Date().toISOString() }
    if (body.status === 'paid' && !body.payment_date) updates.payment_date = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase.from('payroll')
      .update(updates).eq('id', payrollMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update attendance
  const attMatch_3 = path.match(/^\/admin\/attendance\/(\d+)$/)
  if (attMatch_3) {
    const { data, error } = await supabase.from('attendance')
      .update(body).eq('id', attMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update department
  const deptMatch_2 = path.match(/^\/admin\/departments\/(\d+)$/)
  if (deptMatch_2) {
    const { data, error } = await supabase.from('departments')
      .update({ ...body, updated_at: new Date().toISOString() }).eq('id', deptMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update Task
  const taskMatch_4 = path.match(/^\/admin\/tasks\/(\d+)$/)
  if (taskMatch_4) {
    const { data, error } = await supabase
      .from('tasks').update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', taskMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update Payroll
  const payrollMatch_3 = path.match(/^\/admin\/payroll\/(\d+)$/)
  if (payrollMatch_3) {
    const updates = { ...body, updated_at: new Date().toISOString() }
    if (body.basic_salary !== undefined) {
      updates.net_salary = Number(body.basic_salary) + Number(body.allowances || 0) - Number(body.deductions || 0)
    }
    const { data, error } = await supabase
      .from('payroll').update(updates)
      .eq('id', payrollMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update Department
  const deptMatch_3 = path.match(/^\/admin\/departments\/(\d+)$/)
  if (deptMatch_3) {
    const { data, error } = await supabase
      .from('departments').update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', deptMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  // Admin: Update Attendance
  const attMatch_4 = path.match(/^\/admin\/attendance\/(\d+)$/)
  if (attMatch_4) {
    const { data, error } = await supabase
      .from('attendance').update(body)
      .eq('id', attMatch[1]).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  throw new Error(`PUT ${path} not implemented`)
}

async function routeDel(path: string): Promise<any> {
  const jobMatch_2 = path.match(/^\/admin\/jobs\/(\d+)$/)
  if (jobMatch_2) {
    const { error } = await supabase.from('jobs').delete().eq('id', parseInt(jobMatch[1]))
    if (error) throw error; return { success: true }
  }
  const newsMatch_2 = path.match(/^\/admin\/newsroom\/(\d+)$/)
  if (newsMatch_2) {
    const { error } = await supabase.from('newsroom_posts').delete().eq('id', parseInt(newsMatch[1]))
    if (error) throw error; return { success: true }
  }
  const noticeMatch_2 = path.match(/^\/admin\/notices\/(\d+)$/)
  if (noticeMatch_2) {
    const { error } = await supabase.from('notices').delete().eq('id', parseInt(noticeMatch[1]))
    if (error) throw error; return { success: true }
  }
  const blogMatch_2 = path.match(/^\/admin\/blog\/(\d+)$/)
  if (blogMatch_2) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', parseInt(blogMatch[1]))
    if (error) throw error; return { success: true }
  }
  const empMatch_2 = path.match(/^\/admin\/employees\/(\d+)$/)
  if (empMatch_2) {
    const { error } = await supabase.from('employees').delete().eq('id', parseInt(empMatch[1]))
    if (error) throw error; return { success: true }
  }
  // Admin: Delete task
  const delTaskMatch = path.match(/^\/admin\/tasks\/(\d+)$/)
  if (delTaskMatch) {
    const { error } = await supabase.from('tasks').delete().eq('id', delTaskMatch[1])
    if (error) throw new Error(error.message)
    return { success: true }
  }

  // Admin: Delete department
  const delDeptMatch = path.match(/^\/admin\/departments\/(\d+)$/)
  if (delDeptMatch) {
    const { error } = await supabase.from('departments').delete().eq('id', delDeptMatch[1])
    if (error) throw new Error(error.message)
    return { success: true }
  }

  const delTask = path.match(/^\/admin\/tasks\/(\d+)$/)
  if (delTask) {
    const { error } = await supabase.from('tasks').delete().eq('id', delTask[1])
    if (error) throw new Error(error.message)
    return { success: true }
  }

  const delDept = path.match(/^\/admin\/departments\/(\d+)$/)
  if (delDept) {
    const { error } = await supabase.from('departments').delete().eq('id', delDept[1])
    if (error) throw new Error(error.message)
    return { success: true }
  }

  const delPayroll = path.match(/^\/admin\/payroll\/(\d+)$/)
  if (delPayroll) {
    const { error } = await supabase.from('payroll').delete().eq('id', delPayroll[1])
    if (error) throw new Error(error.message)
    return { success: true }
  }

  // Admin: Delete Task
  const delTaskMatch_2 = path.match(/^\/admin\/tasks\/(\d+)$/)
  if (delTaskMatch_2) {
    const { error } = await supabase.from('tasks').delete().eq('id', delTaskMatch[1])
    if (error) throw new Error(error.message)
    return { success: true }
  }

  // Admin: Delete Payroll
  const delPayMatch = path.match(/^\/admin\/payroll\/(\d+)$/)
  if (delPayMatch) {
    const { error } = await supabase.from('payroll').delete().eq('id', delPayMatch[1])
    if (error) throw new Error(error.message)
    return { success: true }
  }

  // Admin: Delete Department
  const delDeptMatch_2 = path.match(/^\/admin\/departments\/(\d+)$/)
  if (delDeptMatch_2) {
    const { error } = await supabase.from('departments').delete().eq('id', delDeptMatch[1])
    if (error) throw new Error(error.message)
    return { success: true }
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
