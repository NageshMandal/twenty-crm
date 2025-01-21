import { useEffect, lazy } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { paths } from "../path";
import AiSdrInboxPage from "../../pages/Main/AiSdr/Detail";

//Layout
const MainLayout = lazy(() => import("../../layouts/MainLayout"));

//Automation
const AutomationPage = lazy(() => import("../../pages/Main/Automation"));
const AutomationCreatePage = lazy(() => import("../../pages/Main/Automation/Create"));

const MailBoxesPage = lazy(() => import("../../pages/Main/Mailboxes"));

const DashboardPage = lazy(() => import("../../pages/Main/Dashboard"));
const DemandPage = lazy(() => import("../../pages/Main/Demand"));
const InboxPage = lazy(() => import("../../pages/Main/Inbox"));
const KnowledgeBasePage = lazy(() => import("../../pages/Main/KnowledgeBase"));
const LinkedinPage = lazy(() => import("../../pages/Main/Linkedin"));

//Lead
const LeadPage = lazy(() => import("../../pages/Main/Lead/List"));
const LeadDetailPage = lazy(() => import("../../pages/Main/Lead/Detail"));

//1-1 Automation
const PersonalizationPage = lazy(() => import("../../pages/Main/1-1-Automations"));
const PersonalizationDetailPage = lazy(() => import("../../pages/Main/1-1-Automations/Detail"));

//Social Selling
const SettingPage = lazy(() => import("../../pages/Main/Setting"));
const SocialSellingPage = lazy(() => import("../../pages/Main/SocialSelling/Index"));

//Ai Sdr
const AiSdrPage = lazy(() => import("../../pages/Main/AiSdr/Index"));
const AiSdrSetupPage = lazy(() => import("../../pages/Main/AiSdrSetup/Index"));

//Integration
const IntegrationIndexPage = lazy(() => import("../../pages/Main/Integration/Index"));
const IntegrationDetailPage = lazy(() => import("../../pages/Main/Integration/Detail"));

const SalesAutomationDetailPage = lazy(() => import("../../pages/Main/SocialSelling/Detail"));

const TeamPage = lazy(() => import("../../pages/Main/Team"));

//Visitor
const VisitorPage = lazy(() => import("../../pages/Main/Visitor"));

//template
const AiTemplatePage = lazy(() => import("../../pages/Extra/AiTemplate/index"));

const MainRoute = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(paths.auth.login);
    }
  }, [token]);

  return (
    <MainLayout>
      <Routes>
        <Route path='/automation' element={<AutomationPage />} />
        <Route path='/automation/create' element={<AutomationCreatePage />} />

        <Route path='/dashboard' element={<DashboardPage />} />

        <Route path='/mailboxes' element={<MailBoxesPage />} />

        <Route path='/lead' element={<LeadPage />} />
        <Route path='/lead/:leadId' element={<LeadDetailPage />} />

        <Route path='/1-1-automation' element={<PersonalizationPage />} />
        <Route path='/1-1-automation/:wid' element={<PersonalizationDetailPage />} />

        <Route path='/social-selling' element={<SocialSellingPage />} />
        <Route path='/social-selling/:wid' element={<SalesAutomationDetailPage />} />
        <Route path='/aisdr' element={<AiSdrPage />} />
        <Route path='/aisdr/:wid' element={<AiSdrInboxPage />} />
        <Route path='/setup-aisdr' element={<AiSdrSetupPage />} />

        <Route path='/inbox' element={<InboxPage />} />
        <Route path='/setting' element={<SettingPage />} />

        <Route path='/integration' element={<IntegrationIndexPage />} />
        <Route path={paths.main.integration.detail} element={<IntegrationDetailPage />} />

        <Route path='/team' element={<TeamPage />} />
        <Route path='/demand' element={<DemandPage />} />
        <Route path='/knowledge-base' element={<KnowledgeBasePage />} />
        <Route path='/linkedin' element={<LinkedinPage />} />

        <Route path='/visitor' element={<VisitorPage />} />
        <Route path='/template' element={<AiTemplatePage />} />

        <Route path='/*' element={<Navigate to='automation' replace />} />
      </Routes>
    </MainLayout>
  );
};

export default MainRoute;
