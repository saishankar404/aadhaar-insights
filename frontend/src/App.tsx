import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AnomalyRisk from "./pages/AnomalyRisk";
import TemporalTrends from "./pages/TemporalTrends";
import InclusionEquity from "./pages/InclusionEquity";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anomaly-risk" element={<AnomalyRisk />} />
          <Route path="/temporal-trends" element={<TemporalTrends />} />
          <Route path="/inclusion-equity" element={<InclusionEquity />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
