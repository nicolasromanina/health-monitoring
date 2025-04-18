
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { 
  Bell, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { authAtom, removeAuthToken, removeUserData } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

interface MobileHeaderProps {
  title: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useAtom(authAtom);

  const handleLogout = async () => {
    // Remove auth token and user data
    await removeAuthToken();
    await removeUserData();
    
    // Update auth state
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out."
    });
    
    // Navigate to login page
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-10 border-b border-border">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Left side - Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
            <nav className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-primary">VitalSync</h2>
              </div>
              
              <div className="flex-1 py-2">
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start px-4 py-2" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start px-4 py-2" onClick={() => navigate('/devices')}>
                    Devices
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start px-4 py-2" onClick={() => navigate('/metrics')}>
                    Health Metrics
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start px-4 py-2" onClick={() => navigate('/profile')}>
                    Profile
                  </Button>
                </SheetClose>
              </div>
              
              <div className="p-4 border-t mt-auto">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </SheetClose>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        
        {/* Center - Title */}
        <h1 className="text-lg font-semibold">{title}</h1>
        
        {/* Right side - Profile menu */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-foreground mr-1">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={authState.user?.avatar} 
                    alt={authState.user?.name || authState.user?.username || ""} 
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {authState.user?.name 
                      ? getInitials(authState.user.name) 
                      : authState.user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {authState.user?.name || authState.user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
