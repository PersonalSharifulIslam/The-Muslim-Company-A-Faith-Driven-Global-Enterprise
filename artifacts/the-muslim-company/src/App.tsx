import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
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
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminCareers from "@/pages/admin-careers";
import AdminApplications from "@/pages/admin-applications";
import AdminNewsroom from "@/pages/admin-newsroom";
import AdminNotices from "@/pages/admin-notices";
import AdminBlog from "@/pages/admin-blog";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/careers" component={Careers} />
      <Route path="/careers/:slug/apply" component={({ params }) => <JobApply params={params} />} />
      <Route path="/careers/:slug" component={({ params }) => <JobDetail params={params} />} />
      <Route path="/recruitment-status" component={RecruitmentStatus} />
      <Route path="/newsroom" component={Newsroom} />
      <Route path="/newsroom/:slug" component={({ params }) => <NewsDetail params={params} />} />
      <Route path="/notices" component={Notices} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={({ params }) => <BlogDetail params={params} />} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/careers" component={AdminCareers} />
      <Route path="/admin/applications" component={AdminApplications} />
      <Route path="/admin/newsroom" component={AdminNewsroom} />
      <Route path="/admin/notices" component={AdminNotices} />
      <Route path="/admin/blog" component={AdminBlog} />
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
