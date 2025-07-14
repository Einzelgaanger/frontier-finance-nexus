
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Network from "./pages/Network";
import FundManagerDetail from "./pages/FundManagerDetail";
import Survey from "./pages/Survey";
import Profile from "./pages/Profile";
import ViewerSettings from "./pages/ViewerSettings";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/network" element={
              <ProtectedRoute requiredRole="viewer">
                <Network />
              </ProtectedRoute>
            } />
            <Route path="/network/fund-manager/:userId" element={
              <ProtectedRoute requiredRole="viewer">
                <FundManagerDetail />
              </ProtectedRoute>
            } />
            <Route path="/survey" element={
              <ProtectedRoute requiredRole="viewer">
                <Survey />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requiredRole="member">
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/viewer-settings" element={
              <ProtectedRoute requiredRole="viewer">
                <ViewerSettings />
              </ProtectedRoute>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
