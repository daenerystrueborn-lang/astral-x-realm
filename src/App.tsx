import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Leaderboard from "@/pages/Leaderboard";
import Shop from "@/pages/Shop";
import Topup from "@/pages/Topup";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/shop" component={Shop} />
      <Route path="/topup" component={Topup} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AuthProvider>
          <div className="site-root">
            <div className="site-ambient" aria-hidden />
            <div className="site-aurora" aria-hidden />
            <div className="site-grain" aria-hidden />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Router />
            </div>
            <AuthModal />
          </div>
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}
