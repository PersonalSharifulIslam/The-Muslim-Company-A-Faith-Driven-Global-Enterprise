import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Careers from "@/pages/careers";
import JobDetail from "@/pages/job-detail";
import JobApply from "@/pages/job-apply";
import RecruitmentStatus from "@/pages/recruitment-status";
import Newsroom from "@/pages/newsroom";
import NewsDetail from "@/pages/news-detail";
import Notices from "@/pages/notices";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminCareers from "@/pages/admin-careers";
import AdminApplications from "@/pages/admin-applications";
import AdminNewsroom from "@/pages/admin-newsroom";
import AdminNotices from "@/pages/admin-notices";
import AdminBlog from "@/pages/admin-blog";
import AdminEmployees from "@/pages/admin-employees";
import EmployeeDashboard from "@/pages/employee-dashboard";
import EmployeeAttendance from "@/pages/employee-attendance";
import EmployeeLeave from "@/pages/employee-leave";
import EmployeeTasks from "@/pages/employee-tasks";
import EmployeeNotifications from "@/pages/employee-notifications";
import EmployeeDocuments from "@/pages/employee-documents";
import EmployeeProfile from "@/pages/employee-profile";
import EmployeeSettings from "@/pages/employee-settings";
import LoginPage from "@/pages/LoginPage";
import AuthRedirect from "@/pages/AuthRedirect";
import { AdminRoute, EmployeeRoute } from "@/lib/protected-routes";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/careers" component={Careers} />
      <Route path="/careers/:slug" component={JobDetail} />
      <Route path="/careers/:slug/apply" component={JobApply} />
      <Route path="/recruitment-status" component={RecruitmentStatus} />
      <Route path="/newsroom" component={Newsroom} />
      <Route path="/newsroom/:slug" component={NewsDetail} />
      <Route path="/notices" component={Notices} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={({ params }) => <BlogDetail params={params} />} />

      {/* Unified login */}
      <Route path="/login" component={LoginPage} />
      <Route path="/admin" component={LoginPage} />
      <Route path="/employee" component={LoginPage} />
      <Route path="/auth-redirect" component={AuthRedirect} />

      {/* Admin protected routes */}
      <Route path="/admin/dashboard">
        <AdminRoute><AdminDashboard /></AdminRoute>
      </Route>
      <Route path="/admin/careers">
        <AdminRoute><AdminCareers /></AdminRoute>
      </Route>
      <Route path="/admin/applications">
        <AdminRoute><AdminApplications /></AdminRoute>
      </Route>
      <Route path="/admin/newsroom">
        <AdminRoute><AdminNewsroom /></AdminRoute>
      </Route>
      <Route path="/admin/notices">
        <AdminRoute><AdminNotices /></AdminRoute>
      </Route>
      <Route path="/admin/blog">
        <AdminRoute><AdminBlog /></AdminRoute>
      </Route>
      <Route path="/admin/employees">
        <AdminRoute><AdminEmployees /></AdminRoute>
      </Route>

      {/* Employee protected routes */}
      <Route path="/employee/dashboard">
        <EmployeeRoute><EmployeeDashboard /></EmployeeRoute>
      </Route>
      <Route path="/employee/attendance">
        <EmployeeRoute><EmployeeAttendance /></EmployeeRoute>
      </Route>
      <Route path="/employee/leave">
        <EmployeeRoute><EmployeeLeave /></EmployeeRoute>
      </Route>
      <Route path="/employee/tasks">
        <EmployeeRoute><EmployeeTasks /></EmployeeRoute>
      </Route>
      <Route path="/employee/notifications">
        <EmployeeRoute><EmployeeNotifications /></EmployeeRoute>
      </Route>
      <Route path="/employee/documents">
        <EmployeeRoute><EmployeeDocuments /></EmployeeRoute>
      </Route>
      <Route path="/employee/profile">
        <EmployeeRoute><EmployeeProfile /></EmployeeRoute>
      </Route>
      <Route path="/employee/settings">
        <EmployeeRoute><EmployeeSettings /></EmployeeRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
