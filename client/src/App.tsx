import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import FoundDogs from "@/pages/FoundDogs";
import ReportDog from "@/pages/ReportDog";
import DogDetails from "@/pages/DogDetails";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { useQuery } from "@tanstack/react-query";

function App() {
  // Check authentication status when app loads
  const { data: authData } = useQuery({
    queryKey: ['/api/auth/status'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isAdmin = authData?.authenticated && authData?.user?.isAdmin;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/found-dogs" component={FoundDogs} />
          <Route path="/report-dog" component={ReportDog} />
          <Route path="/dog/:id">
            {params => <DogDetails id={params.id} />}
          </Route>
          {isAdmin && <Route path="/admin" component={Admin} />}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;
