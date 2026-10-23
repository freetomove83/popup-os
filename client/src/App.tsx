import { Route, Switch } from "wouter";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminConsole from "@/pages/admin/AdminConsole";
import AdminLogin from "@/pages/admin/login";
import Home from "@/pages/Home";
import Landing from "@/pages/landing/Landing";
import NotFound from "@/pages/NotFound";
import StaffDemo from "@/pages/StaffDemo";
import { StaffCheckinScreen } from "@/pages/staff/checkin";
import { StaffContractScreen } from "@/pages/staff/contract";
import WorkerApplications from "@/pages/worker/applications";
import WorkerJobDetail from "@/pages/worker/job-detail";
import WorkerJobs from "@/pages/worker/jobs";
import WorkerLogin from "@/pages/worker/login";
import WorkerProfile from "@/pages/worker/profile";
import WorkerSettle from "@/pages/worker/settle";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* 마케팅 랜딩 */}
      <Route path="/landing" component={Landing} />

      {/* 관리자 콘솔 */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminConsole} />

      {/* 스태프(워커) 앱 */}
      <Route path="/worker/login" component={WorkerLogin} />
      <Route path="/worker/job/:id" component={WorkerJobDetail} />
      <Route path="/worker/applications" component={WorkerApplications} />
      <Route path="/worker/profile" component={WorkerProfile} />
      <Route path="/worker/settle" component={WorkerSettle} />
      <Route path="/worker/contract" component={StaffContractScreen} />
      <Route path="/worker/checkin" component={StaffCheckinScreen} />
      <Route path="/worker" component={WorkerJobs} />

      {/* 디자인 레퍼런스(3화면 데모) */}
      <Route path="/staff" component={StaffDemo} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}
