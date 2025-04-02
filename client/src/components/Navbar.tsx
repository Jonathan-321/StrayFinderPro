import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PawPrint, Menu } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { data: authData } = useQuery({
    queryKey: ['/api/auth/status'],
  });

  const isAuthenticated = authData?.authenticated;
  const isAdmin = isAuthenticated && authData?.user?.isAdmin;

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/logout', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/status'] });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <PawPrint className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-xl text-gray-900">PawFinder</span>
              </a>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className="text-primary font-medium">Home</a>
            </Link>
            <Link href="/found-dogs">
              <a className="text-gray-500 hover:text-primary font-medium">Found Dogs</a>
            </Link>
            <Link href="/report-dog">
              <a className="text-gray-500 hover:text-primary font-medium">Report Dog</a>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <a className="text-gray-500 hover:text-primary font-medium">Admin</a>
              </Link>
            )}
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-gray-500 hover:text-primary font-medium"
              >
                Logout
              </Button>
            ) : null}
          </nav>
          
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/">
                    <a className="text-lg font-medium" onClick={() => setIsOpen(false)}>Home</a>
                  </Link>
                  <Link href="/found-dogs">
                    <a className="text-lg font-medium" onClick={() => setIsOpen(false)}>Found Dogs</a>
                  </Link>
                  <Link href="/report-dog">
                    <a className="text-lg font-medium" onClick={() => setIsOpen(false)}>Report Dog</a>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <a className="text-lg font-medium" onClick={() => setIsOpen(false)}>Admin</a>
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="justify-start px-0 font-medium"
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
