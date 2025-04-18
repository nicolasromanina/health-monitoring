
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '@/lib/auth';
import { healthDataAtom, activePeriodAtom } from '@/lib/store';
import { getAllHealthData } from '@/lib/api';
import PageContainer from '@/components/layout/PageContainer';
import HealthChart from '@/components/health/HealthChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Footprints, 
  Moon, 
  Flame, 
  Droplets,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Metrics: React.FC = () => {
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const [healthData, setHealthData] = useAtom(healthDataAtom);
  const [period, setPeriod] = useAtom(activePeriodAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('heart_rate');
  
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const data = await getAllHealthData();
        setHealthData(data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
  }, [authState.isAuthenticated, navigate, setHealthData]);
  
  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Your health data is being prepared for export as PDF.",
    });
    
    // Mock export success after 2 seconds
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your health data has been exported successfully.",
      });
    }, 2000);
  };
  
  if (loading) {
    return (
      <PageContainer title="Health Metrics">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Loading your health data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Health Metrics">
      <div className="space-y-6 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Metrics</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        
        <Tabs defaultValue="heart_rate" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="heart_rate" className="px-1 sm:px-3">
              <Heart className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Heart</span>
            </TabsTrigger>
            <TabsTrigger value="steps" className="px-1 sm:px-3">
              <Footprints className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Steps</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="px-1 sm:px-3">
              <Moon className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sleep</span>
            </TabsTrigger>
            <TabsTrigger value="calories" className="px-1 sm:px-3">
              <Flame className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Calories</span>
            </TabsTrigger>
            <TabsTrigger value="oxygen" className="px-1 sm:px-3">
              <Droplets className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Oxygen</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="heart_rate" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Heart Rate</CardTitle>
                <CardDescription>
                  Track your heart rate throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Resting heart rate</span>
                    <span className="font-medium">68 bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average heart rate</span>
                    <span className="font-medium">72 bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maximum heart rate</span>
                    <span className="font-medium">118 bpm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <HealthChart 
              title="Heart Rate"
              metrics={healthData.heart_rate || []}
              color="heart"
              period={period}
              onPeriodChange={setPeriod}
              unit="bpm"
            />
          </TabsContent>
          
          <TabsContent value="steps" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Steps</CardTitle>
                <CardDescription>
                  Track your daily step count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Today's steps</span>
                    <span className="font-medium">6,482 steps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily average</span>
                    <span className="font-medium">7,234 steps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly total</span>
                    <span className="font-medium">42,195 steps</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <HealthChart 
              title="Daily Steps"
              metrics={healthData.steps || []}
              color="steps"
              period={period}
              onPeriodChange={setPeriod}
              unit=" steps"
              reference={10000}
            />
          </TabsContent>
          
          <TabsContent value="sleep" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sleep</CardTitle>
                <CardDescription>
                  Track your sleep duration and quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Last night</span>
                    <span className="font-medium">7.2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly average</span>
                    <span className="font-medium">6.8 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sleep quality</span>
                    <span className="font-medium">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <HealthChart 
              title="Sleep Duration"
              metrics={healthData.sleep || []}
              color="sleep"
              period={period}
              onPeriodChange={setPeriod}
              unit=" hours"
              reference={8}
            />
          </TabsContent>
          
          <TabsContent value="calories" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Calories</CardTitle>
                <CardDescription>
                  Track your daily calorie burn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Today's burn</span>
                    <span className="font-medium">1,845 kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active calories</span>
                    <span className="font-medium">543 kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly average</span>
                    <span className="font-medium">1,920 kcal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <HealthChart 
              title="Calories Burned"
              metrics={healthData.calories || []}
              color="calories"
              period={period}
              onPeriodChange={setPeriod}
              unit=" kcal"
            />
          </TabsContent>
          
          <TabsContent value="oxygen" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Blood Oxygen</CardTitle>
                <CardDescription>
                  Track your blood oxygen saturation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Current level</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily average</span>
                    <span className="font-medium">97%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lowest reading</span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <HealthChart 
              title="Blood Oxygen"
              metrics={healthData.oxygen || []}
              color="oxygen"
              period={period}
              onPeriodChange={setPeriod}
              unit="%"
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Metrics;
