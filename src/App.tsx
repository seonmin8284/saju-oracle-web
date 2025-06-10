import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Fortune from "./pages/Fortune";
import Celebrities from "./pages/Celebrities";
import SajuInput from "./pages/SajuInput";
import SajuResult from "./pages/SajuResult";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SajuInput />} />
            <Route path="/fortune" element={<Fortune />} />
            {/* <Route path="/celebrities" element={<Celebrities />} /> */}
            <Route path="/saju-input" element={<SajuInput />} />
            <Route path="/saju-result" element={<SajuResult />} />
            <Route path="/chat" element={<Chat />} />
            {/* <Route path="/auth" element={<Auth />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
