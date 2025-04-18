
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '@/lib/auth';
import { devicesAtom, connectingDeviceAtom } from '@/lib/store';
import { getConnectedDevices, connectToDevice, disconnectDevice } from '@/lib/api';
import PageContainer from '@/components/layout/PageContainer';
import DeviceCard from '@/components/device/DeviceCard';
import { Button } from '@/components/ui/button';
import { Bluetooth, PlusCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Devices: React.FC = () => {
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const [devices, setDevices] = useAtom(devicesAtom);
  const [connecting, setConnecting] = useAtom(connectingDeviceAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const deviceData = await getConnectedDevices();
        setDevices(deviceData);
      } catch (error) {
        console.error('Error fetching devices:', error);
        toast({
          title: "Could not load devices",
          description: "There was an error loading your connected devices.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [authState.isAuthenticated, navigate, setDevices]);
  
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const deviceData = await getConnectedDevices();
      setDevices(deviceData);
      toast({
        title: "Devices refreshed",
        description: "Your device list has been updated.",
      });
    } catch (error) {
      console.error('Error refreshing devices:', error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh your devices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleConnectDevice = async (deviceId: string) => {
    try {
      setConnecting(true);
      const updatedDevice = await connectToDevice(deviceId);
      
      // Update the devices list with the connected device
      const updatedDevices = devices.map(device => 
        device.id === deviceId ? updatedDevice : device
      );
      
      setDevices(updatedDevices);
      
      toast({
        title: "Device connected",
        description: `Successfully connected to ${updatedDevice.name}.`,
      });
    } catch (error) {
      console.error('Error connecting to device:', error);
      toast({
        title: "Connection failed",
        description: "Could not connect to the device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };
  
  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      setConnecting(true);
      await disconnectDevice(deviceId);
      
      // Update the devices list with the disconnected device
      const updatedDevices = devices.map(device => 
        device.id === deviceId ? { ...device, connected: false } : device
      );
      
      setDevices(updatedDevices);
      
      toast({
        title: "Device disconnected",
        description: `Successfully disconnected from the device.`,
      });
    } catch (error) {
      console.error('Error disconnecting device:', error);
      toast({
        title: "Disconnection failed",
        description: "Could not disconnect from the device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };
  
  if (loading) {
    return (
      <PageContainer title="Devices">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Scanning for devices...</p>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Devices">
      <div className="space-y-6 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Devices</h2>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {devices.length > 0 ? (
          <div className="space-y-4">
            {devices.map(device => (
              <DeviceCard 
                key={device.id}
                device={device}
                onConnect={handleConnectDevice}
                onDisconnect={handleDisconnectDevice}
                connecting={connecting}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bluetooth className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No devices found</h3>
            <p className="text-muted-foreground mt-1">
              Connect a new device to start tracking your health data
            </p>
          </div>
        )}
        
        <div className="pt-4">
          <Button className="w-full" onClick={() => {
            toast({
              title: "Scanning for devices",
              description: "VitalSync is scanning for nearby Bluetooth devices...",
            });
            
            // Mock finding new devices after 2 seconds
            setTimeout(() => {
              toast({
                title: "New devices found",
                description: "We found new devices! Check the devices page.",
              });
            }, 2000);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Device
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Devices;
