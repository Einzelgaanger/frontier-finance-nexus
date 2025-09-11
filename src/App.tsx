
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/ui/loading-screen";
import { useLoadingStore } from "@/store/loading-store";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NetworkWrapper from "./components/NetworkWrapper";
import FundManagerDetail from "./pages/FundManagerDetail";
import Survey from "./pages/Survey";
import Survey2021 from "./pages/Survey2021";
import Survey2022 from "./pages/Survey2022";
import Survey2023 from "./pages/Survey2023";
import Survey2024 from "./pages/Survey2024";
import Profile from "./pages/Profile";
import ViewerSettings from "./pages/ViewerSettings";
import Application from "./pages/Application";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AdminWrapper from "./components/AdminWrapper";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading && <LoadingScreen />}
        <Toaster />
        <Sonner />
        <AuthProvider>
        <BrowserRouter className="font-rubik">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/network" element={
              <ProtectedRoute>
                <NetworkWrapper />
              </ProtectedRoute>
            } />
            <Route path="/network/fund-manager/:id" element={
              <ProtectedRoute>
                <FundManagerDetail />
              </ProtectedRoute>
            } />
            <Route path="/survey" element={
              <ProtectedRoute>
                <Survey />
              </ProtectedRoute>
            } />
            <Route path="/survey/2021" element={
              <ProtectedRoute>
                <Survey2021 />
              </ProtectedRoute>
            } />
            <Route path="/survey/2022" element={
              <ProtectedRoute>
                <Survey2022 />
              </ProtectedRoute>
            } />
            <Route path="/survey/2023" element={
              <ProtectedRoute>
                <Survey2023 />
              </ProtectedRoute>
            } />
            <Route path="/survey/2024" element={
              <ProtectedRoute>
                <Survey2024 />
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
            <Route path="/application" element={
              <ProtectedRoute requiredRole="viewer">
                <Application />
              </ProtectedRoute>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminWrapper />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <AnalyticsWrapper />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
