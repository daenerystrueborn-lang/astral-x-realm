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
          {/* Fixed background layers — z-index: 0, pointer-events: none */}
          <div className="bg-base"    aria-hidden="true" />
          <div className="bg-ambient" aria-hidden="true" />
          <div className="bg-aurora"  aria-hidden="true" />
          <div className="bg-grain"   aria-hidden="true" />

          {/* All page content lives here — z-index: 1 */}
          <div className="page-root">
            <Router />
          </div>

          <AuthModal />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}
