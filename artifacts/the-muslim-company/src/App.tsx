import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const AboutPage = lazy(() => import("@/pages/about"));
const Careers = lazy(() => import("@/pages/careers"));
const JobDetail = lazy(() => import("@/pages/job-detail"));
const JobApply = lazy(() => import("@/pages/job-apply"));
const RecruitmentStatus = lazy(() => import("@/pages/recruitment-status"));
const Newsroom = lazy(() => import("@/pages/newsroom"));
const NewsDetail = lazy(() => import("@/pages/news-detail"));
const Notices = lazy(() => import("@/pages/notices"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogDetail = lazy(() => import("@/pages/blog-detail"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AdminCareers = lazy(() => import("@/pages/admin-careers"));
const AdminApplications = lazy(() => import("@/pages/admin-applications"));
const AdminNewsroom = lazy(() => import("@/pages/admin-newsroom"));
const AdminNotices = lazy(() => import("@/pages/admin-notices"));
const AdminTransparencyReports = lazy(() => import("@/pages/admin-transparency-reports"));
const AdminBlog = lazy(() => import("@/pages/admin-blog"));
const AdminEmployees = lazy(() => import("@/pages/admin-employees"));
const AdminLeaves = lazy(() => import("@/pages/admin-leaves"));
const AdminAttendance = lazy(() => import("@/pages/admin-attendance"));
const AdminTasks = lazy(() => import("@/pages/admin-tasks"));
const AdminPayroll = lazy(() => import("@/pages/admin-payroll"));
const AdminDepartments = lazy(() => import("@/pages/admin-departments"));
const AdminAuditLog = lazy(() => import("@/pages/admin-audit-log"));
const AdminOrgChart = lazy(() => import("@/pages/admin-org-chart"));
const AdminInvites = lazy(() => import("@/pages/admin-invites"));
const AdminDocuments = lazy(() => import("@/pages/admin-documents"));
const AdminHolidays = lazy(() => import("@/pages/admin-holidays"));
const AdminPerformance = lazy(() => import("@/pages/admin-performance"));
const AdminExits = lazy(() => import("@/pages/admin-exits"));
const AdminAssets = lazy(() => import("@/pages/admin-assets"));
const AdminLeaveBalances = lazy(() => import("@/pages/admin-leave-balances"));
const EmployeeOnboard = lazy(() => import("@/pages/employee-onboard"));
const EmployeeDashboard = lazy(() => import("@/pages/employee-dashboard"));
const EmployeeAttendance = lazy(() => import("@/pages/employee-attendance"));
const EmployeeLeave = lazy(() => import("@/pages/employee-leave"));
const EmployeeTasks = lazy(() => import("@/pages/employee-tasks"));
const EmployeeNotifications = lazy(() => import("@/pages/employee-notifications"));
const EmployeeDocuments = lazy(() => import("@/pages/employee-documents"));
const EmployeeProfile = lazy(() => import("@/pages/employee-profile"));
const EmployeeSettings = lazy(() => import("@/pages/employee-settings"));
const EmployeePayslip = lazy(() => import("@/pages/employee-payslip"));
const EmployeeHolidays = lazy(() => import("@/pages/employee-holidays"));
const EmployeeDirectory = lazy(() => import("@/pages/employee-directory"));
const EmployeePerformance = lazy(() => import("@/pages/employee-performance"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const AuthRedirect = lazy(() => import("@/pages/AuthRedirect"));
const FounderPage = lazy(() => import("@/pages/founder"));
const CeoSharifulIslamPage = lazy(() => import("@/pages/ceo-sharifulislam"));
const BaytAlMalBankPage = lazy(() => import("@/pages/bayt-al-mal-bank"));
const VisionPage = lazy(() => import("@/pages/vision"));
const MissionPage = lazy(() => import("@/pages/mission"));
const SectorDetail = lazy(() => import("@/pages/sector-detail"));
const ContactPage = lazy(() => import("@/pages/contact"));
const TransparencyPage = lazy(() => import("@/pages/transparency"));
const GetInvolvedPage = lazy(() => import("@/pages/get-involved"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
import { AdminRoute, EmployeeRoute } from "@/lib/protected-routes";

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #d4af37", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/our-story" component={Home} />
      <Route path="/foundation" component={Home} />
      <Route path="/sectors" component={Home} />
      <Route path="/governance" component={Home} />
      <Route path="/constitution" component={Home} />
      <Route path="/careers" component={Careers} />
      <Route path="/careers/:slug" component={JobDetail} />
      <Route path="/careers/:slug/apply" component={JobApply} />
      <Route path="/recruitment-status" component={RecruitmentStatus} />
      <Route path="/newsroom" component={Newsroom} />
      <Route path="/newsroom/:slug" component={NewsDetail} />
      <Route path="/notices" component={Notices} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={({ params }) => <BlogDetail params={params} />} />
      <Route path="/sectors/:slug" component={SectorDetail} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/transparency" component={TransparencyPage} />
      <Route path="/get-involved" component={GetInvolvedPage} />
      <Route path="/employee/onboard/:token" component={({ params }) => <EmployeeOnboard params={params} />} />

      {/* Unified login */}
      <Route path="/login" component={LoginPage} />
      <Route path="/admin" component={LoginPage} />
      <Route path="/employee" component={LoginPage} />
      <Route path="/auth-redirect" component={AuthRedirect} />
      <Route path="/founder" component={FounderPage} />
      <Route path="/ceo/Sharifulislam" component={CeoSharifulIslamPage} />
      <Route path="/BaytAlMalBank" component={BaytAlMalBankPage} />
      <Route path="/baytalmalbank" component={BaytAlMalBankPage} />
      <Route path="/vision" component={VisionPage} />
      <Route path="/mission" component={MissionPage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />

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
      <Route path="/admin/transparency-reports">
        <AdminRoute><AdminTransparencyReports /></AdminRoute>
      </Route>
      <Route path="/admin/blog">
        <AdminRoute><AdminBlog /></AdminRoute>
      </Route>
      <Route path="/admin/employees">
        <AdminRoute><AdminEmployees /></AdminRoute>
      </Route>
      <Route path="/admin/leaves">
        <AdminRoute><AdminLeaves /></AdminRoute>
      </Route>
      <Route path="/admin/attendance">
        <AdminRoute><AdminAttendance /></AdminRoute>
      </Route>
      <Route path="/admin/tasks">
        <AdminRoute><AdminTasks /></AdminRoute>
      </Route>
      <Route path="/admin/payroll">
        <AdminRoute><AdminPayroll /></AdminRoute>
      </Route>
      <Route path="/admin/departments">
        <AdminRoute><AdminDepartments /></AdminRoute>
      </Route>
      <Route path="/admin/audit-log">
        <AdminRoute><AdminAuditLog /></AdminRoute>
      </Route>
      <Route path="/admin/org-chart">
        <AdminRoute><AdminOrgChart /></AdminRoute>
      </Route>
      <Route path="/admin/invites">
        <AdminRoute><AdminInvites /></AdminRoute>
      </Route>
      <Route path="/admin/documents">
        <AdminRoute><AdminDocuments /></AdminRoute>
      </Route>
      <Route path="/admin/holidays">
        <AdminRoute><AdminHolidays /></AdminRoute>
      </Route>
      <Route path="/admin/performance">
        <AdminRoute><AdminPerformance /></AdminRoute>
      </Route>
      <Route path="/admin/exits">
        <AdminRoute><AdminExits /></AdminRoute>
      </Route>
      <Route path="/admin/assets">
        <AdminRoute><AdminAssets /></AdminRoute>
      </Route>
      <Route path="/admin/leave-balances">
        <AdminRoute><AdminLeaveBalances /></AdminRoute>
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
      <Route path="/employee/payslip">
        <EmployeeRoute><EmployeePayslip /></EmployeeRoute>
      </Route>
      <Route path="/employee/holidays">
        <EmployeeRoute><EmployeeHolidays /></EmployeeRoute>
      </Route>
      <Route path="/employee/directory">
        <EmployeeRoute><EmployeeDirectory /></EmployeeRoute>
      </Route>
      <Route path="/employee/performance">
        <EmployeeRoute><EmployeePerformance /></EmployeeRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    // Skip auto-scroll-to-top if navigating to a hash anchor (handled by the hash link itself)
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
