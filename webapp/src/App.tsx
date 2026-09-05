import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CitizenLayout from "./components/layouts/CitizenLayout";
import AgentLayout from "./components/layouts/AgentLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import Landing from "./pages/citizen/Landing";
import Login from "./pages/citizen/Login";
import Register from "./pages/citizen/Register";
import DeclarationsList from "./pages/citizen/DeclarationsList";
import DeclarationForm from "./pages/citizen/DeclarationForm";
import DeclarationDetail from "./pages/citizen/DeclarationDetail";
import MatchesList from "./pages/citizen/MatchesList";
import MatchDetail from "./pages/citizen/MatchDetail";
import Notifications from "./pages/citizen/Notifications";
import Profile from "./pages/citizen/Profile";
import TermsPage from "./pages/citizen/TermsPage";
import PrivacyPage from "./pages/citizen/PrivacyPage";
import RightsPage from "./pages/citizen/RightsPage";
import HelpPage from "./pages/citizen/HelpPage";
import ContactPage from "./pages/citizen/ContactPage";
import AboutPage from "./pages/citizen/AboutPage";
import AgentLogin from "./pages/agent/Login";
import AgentDashboard from "./pages/agent/Dashboard";
import AgentMatchesQueue from "./pages/agent/MatchesQueue";
import AgentMatchDetail from "./pages/agent/MatchDetail";
import RestitutionsList from "./pages/agent/RestitutionsList";
import RestitutionForm from "./pages/agent/RestitutionForm";
import AgentCenterDetail from "./pages/agent/CenterDetail";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import CentersList from "./pages/admin/CentersList";
import AdminCenterDetail from "./pages/admin/CenterDetail";
import AgentsList from "./pages/admin/AgentsList";
import Policies from "./pages/admin/Policies";
import Incidents from "./pages/admin/Incidents";
import Audit from "./pages/admin/Audit";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const portal = process.env.VITE_PORTAL || "citizen";

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PortalRoutes() {
  if (portal === "agent") {
    return (
      <Routes>
        <Route path="/login" element={<AgentLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["AGENT", "CENTER_MANAGER", "REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AgentLayout><AgentDashboard /></AgentLayout></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute allowedRoles={["AGENT", "CENTER_MANAGER", "REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AgentLayout><AgentMatchesQueue /></AgentLayout></ProtectedRoute>} />
        <Route path="/matches/:id" element={<ProtectedRoute allowedRoles={["AGENT", "CENTER_MANAGER", "REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AgentLayout><AgentMatchDetail /></AgentLayout></ProtectedRoute>} />
        <Route path="/restitutions" element={<ProtectedRoute allowedRoles={["AGENT", "CENTER_MANAGER", "REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AgentLayout><RestitutionsList /></AgentLayout></ProtectedRoute>} />
        <Route path="/restitutions/new" element={<ProtectedRoute allowedRoles={["AGENT", "CENTER_MANAGER", "REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AgentLayout><RestitutionForm /></AgentLayout></ProtectedRoute>} />
        <Route path="/centers/:id" element={<ProtectedRoute allowedRoles={["AGENT", "CENTER_MANAGER", "REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AgentLayout><AgentCenterDetail /></AgentLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (portal === "admin") {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/centers" element={<ProtectedRoute allowedRoles={["REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AdminLayout><CentersList /></AdminLayout></ProtectedRoute>} />
        <Route path="/centers/:id" element={<ProtectedRoute allowedRoles={["REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AdminLayout><AdminCenterDetail /></AdminLayout></ProtectedRoute>} />
        <Route path="/agents" element={<ProtectedRoute allowedRoles={["REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AdminLayout><AgentsList /></AdminLayout></ProtectedRoute>} />
        <Route path="/policies" element={<ProtectedRoute allowedRoles={["NATIONAL_ADMIN", "TECH_ADMIN"]}><AdminLayout><Policies /></AdminLayout></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute allowedRoles={["REGIONAL_ADMIN", "NATIONAL_ADMIN", "AUDITOR", "TECH_ADMIN"]}><AdminLayout><Incidents /></AdminLayout></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute allowedRoles={["AUDITOR", "NATIONAL_ADMIN", "TECH_ADMIN"]}><AdminLayout><Audit /></AdminLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Citizen portal
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/rights" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><RightsPage /></CitizenLayout></ProtectedRoute>} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/declarations" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><DeclarationsList /></CitizenLayout></ProtectedRoute>} />
      <Route path="/declarations/new" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><DeclarationForm /></CitizenLayout></ProtectedRoute>} />
      <Route path="/declarations/:id" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><DeclarationDetail /></CitizenLayout></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><MatchesList /></CitizenLayout></ProtectedRoute>} />
      <Route path="/matches/:id" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><MatchDetail /></CitizenLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><Notifications /></CitizenLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={["CITIZEN"]}><CitizenLayout><Profile /></CitizenLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <PortalRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
