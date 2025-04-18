
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Smartphone, Layers } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard or login page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-background p-4">
      <div className="max-w-md text-center">
        <div className="mb-8 relative inline-block">
          <div className="flex justify-center items-center h-24 w-24 mx-auto relative">
            <Heart className="h-16 w-16 text-primary absolute animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse-ring"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-primary-800">VitalSync</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your personal health companion
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
            <Activity className="h-8 w-8 text-health-heart mb-2" />
            <span className="text-sm font-medium">Health Metrics</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
            <Smartphone className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">IoT Devices</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
            <Layers className="h-8 w-8 text-health-sleep mb-2" />
            <span className="text-sm font-medium">Data Analysis</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
            <Heart className="h-8 w-8 text-health-steps mb-2" />
            <span className="text-sm font-medium">Health Insights</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full" 
            onClick={() => navigate('/dashboard')}
          >
            Enter Dashboard
          </Button>
          <p className="text-sm text-muted-foreground">
            Redirecting you automatically...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
