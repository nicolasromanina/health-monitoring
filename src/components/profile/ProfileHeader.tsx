
import React from 'react';
import { User } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage src={user.avatar} alt={user.name || user.username} />
          <AvatarFallback className="text-xl bg-primary text-primary-foreground">
            {user.name 
              ? getInitials(user.name) 
              : user.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <Button 
          size="icon" 
          variant="outline" 
          className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
          onClick={onEdit}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="mt-4 text-xl font-bold">
        {user.name || user.username}
      </h2>
      
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  );
};

export default ProfileHeader;
