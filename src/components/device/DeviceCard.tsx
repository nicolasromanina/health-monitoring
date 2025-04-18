
import React from 'react';
import { Device } from '@/lib/api';
import { formatTimeSince } from '@/lib/formatters';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Battery, 
  BatteryCharging, 
  BatteryFull, 
  BatteryLow, 
  BatteryMedium, 
  BatteryWarning, 
  Bluetooth, 
  BluetoothOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DeviceCardProps {
  device: Device;
  onConnect: (deviceId: string) => void;
  onDisconnect: (deviceId: string) => void;
  connecting: boolean;
  className?: string;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ 
  device, 
  onConnect,
  onDisconnect,
  connecting,
  className
}) => {
  const getBatteryIcon = () => {
    if (!device.batteryLevel) return <Battery className="h-5 w-5" />;
    
    if (device.batteryLevel > 80) {
      return <BatteryFull className="h-5 w-5 text-green-500" />;
    } else if (device.batteryLevel > 40) {
      return <BatteryMedium className="h-5 w-5 text-yellow-500" />;
    } else if (device.batteryLevel > 15) {
      return <BatteryLow className="h-5 w-5 text-orange-500" />;
    } else {
      return <BatteryWarning className="h-5 w-5 text-red-500" />;
    }
  };
  
  const getConnectionStatus = () => {
    if (device.connected) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 flex items-center">
        <XCircle className="h-3 w-3 mr-1" />
        Disconnected
      </Badge>
    );
  };
  
  const handleAction = () => {
    if (device.connected) {
      onDisconnect(device.id);
    } else {
      onConnect(device.id);
    }
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{device.name}</CardTitle>
            <CardDescription>{device.type}</CardDescription>
          </div>
          {device.connected ? 
            <Bluetooth className="h-5 w-5 text-primary" /> : 
            <BluetoothOff className="h-5 w-5 text-muted-foreground" />
          }
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center">
              {getBatteryIcon()}
              <span className="ml-1">Battery</span>
            </span>
            <span className="text-sm font-medium">
              {device.batteryLevel ? `${device.batteryLevel}%` : 'Unknown'}
            </span>
          </div>
          {device.batteryLevel && (
            <Progress value={device.batteryLevel} className="h-2" />
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Status</span>
            {getConnectionStatus()}
          </div>
          
          {device.lastSync && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Last synced</span>
              <span className="text-sm text-muted-foreground">
                {formatTimeSince(device.lastSync)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={device.connected ? "outline" : "default"}
          onClick={handleAction}
          disabled={connecting}
        >
          {connecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : device.connected ? (
            'Disconnect'
          ) : (
            'Connect'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
