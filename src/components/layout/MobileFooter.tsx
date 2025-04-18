
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Smartphone, 
  Activity, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileFooter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Devices', icon: Smartphone, path: '/devices' },
    { name: 'Metrics', icon: Activity, path: '/metrics' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <nav className="flex justify-around">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.name}
              className={cn(
                "flex flex-col items-center py-2 px-4 flex-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={cn(
                "h-6 w-6 mb-1",
                isActive && "text-primary"
              )} />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default MobileFooter;
