
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '@/lib/auth';
import { healthDataAtom, activePeriodAtom, devicesAtom } from '@/lib/store';
import { getAllHealthData, getConnectedDevices, HealthMetric } from '@/lib/api';
import { getLatestMetric } from '@/lib/formatters';
import PageContainer from '@/components/layout/PageContainer';
import HealthMetricCard from '@/components/health/HealthMetricCard';
import HealthChart from '@/components/health/HealthChart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Smartphone } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const [healthData, setHealthData] = useAtom(healthDataAtom);
  const [devices, setDevices] = useAtom(devicesAtom);
  const [period, setPeriod] = useAtom(activePeriodAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('heart_rate');
  
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [healthData, devices] = await Promise.all([
          getAllHealthData(),
          getConnectedDevices()
        ]);
        
        setHealthData(healthData);
        setDevices(devices);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [authState.isAuthenticated, navigate, setHealthData, setDevices]);
  
  const getSelectedMetrics = (): HealthMetric[] => {
    return healthData[selectedMetric] || [];
  };
  
  const getMetricColor = (): string => {
    switch (selectedMetric) {
      case 'heart_rate': return 'heart';
      case 'steps': return 'steps';
      case 'sleep': return 'sleep';
      case 'calories': return 'calories';
      case 'oxygen': return 'oxygen';
      default: return 'heart';
    }
  };
  
  const getMetricUnit = (): string => {
    const metrics = getSelectedMetrics();
    const latestMetric = getLatestMetric(metrics);
    return latestMetric?.unit || '';
  };
  
  const getConnectedDeviceCount = () => {
    return devices.filter(d => d.connected).length;
  };
  
  if (loading) {
    return (
      <PageContainer title="Dashboard">
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
    <PageContainer title="Dashboard">
      <div className="space-y-6 mt-2">
        {/* Welcome section */}
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, {authState.user?.name?.split(' ')[0] || authState.user?.username || 'User'}
          </h2>
          <p className="text-muted-foreground">
            Track your health and connected devices
          </p>
        </div>
        
        {/* Device summary */}
        <Card className="bg-primary/5 border-none">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  <Smartphone className="w-4 h-4 mr-1" />
                  Connected Devices
                </h3>
                <p className="text-2xl font-bold">{getConnectedDeviceCount()}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => navigate('/devices')}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Health metrics summary */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              Health Metrics
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate('/metrics')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <HealthMetricCard 
              type="heart_rate" 
              title="Heart Rate" 
              metrics={healthData.heart_rate || []}
              onClick={() => {
                setSelectedMetric('heart_rate');
              }}
            />
            <HealthMetricCard 
              type="oxygen" 
              title="Oxygen" 
              metrics={healthData.oxygen || []}
              onClick={() => {
                setSelectedMetric('oxygen');
              }}
            />
            <HealthMetricCard 
              type="steps" 
              title="Steps" 
              metrics={healthData.steps || []}
              onClick={() => {
                setSelectedMetric('steps');
              }}
            />
            <HealthMetricCard 
              type="sleep" 
              title="Sleep" 
              metrics={healthData.sleep || []}
              onClick={() => {
                setSelectedMetric('sleep');
              }}
            />
          </div>
        </div>
        
        {/* Selected metric chart */}
        <div className="mt-6">
          <HealthChart 
            title={selectedMetric === 'heart_rate' ? 'Heart Rate' : 
                  selectedMetric === 'steps' ? 'Daily Steps' :
                  selectedMetric === 'sleep' ? 'Sleep Duration' :
                  selectedMetric === 'calories' ? 'Calories Burned' :
                  selectedMetric === 'oxygen' ? 'Blood Oxygen' : 'Health Metric'}
            metrics={getSelectedMetrics()}
            color={getMetricColor()}
            period={period}
            onPeriodChange={setPeriod}
            unit={getMetricUnit()}
            reference={selectedMetric === 'steps' ? 10000 : undefined}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
