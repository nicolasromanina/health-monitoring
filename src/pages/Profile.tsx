
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom, User, storeUserData } from '@/lib/auth';
import { getUserProfile, updateUserProfile } from '@/lib/api';
import PageContainer from '@/components/layout/PageContainer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  User as UserIcon,
  Weight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useAtom(authAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        
        // Update auth state with the latest user data
        setAuthState({
          ...authState,
          user: userData
        });
        
        // Initialize form data
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [authState.isAuthenticated, navigate, setAuthState]);
  
  const handleEditProfile = () => {
    setDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const updatedUser = await updateUserProfile(formData);
      
      // Update auth state with the updated user data
      setAuthState({
        ...authState,
        user: updatedUser
      });
      
      // Update stored user data
      await storeUserData(updatedUser);
      
      setDialogOpen(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (loading || !authState.user) {
    return (
      <PageContainer title="Profile">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Profile">
      <div className="space-y-6 mt-2">
        <ProfileHeader 
          user={authState.user} 
          onEdit={handleEditProfile} 
        />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="text-sm font-medium">{authState.user.username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{authState.user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gender</span>
              <span className="text-sm font-medium">Male</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date of Birth</span>
              <span className="text-sm font-medium">June 12, 1985</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Weight className="mr-2 h-4 w-4" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Height</span>
              <span className="text-sm font-medium">5'11" (180 cm)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weight</span>
              <span className="text-sm font-medium">172 lbs (78 kg)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">BMI</span>
              <span className="text-sm font-medium">24.1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Blood Type</span>
              <span className="text-sm font-medium">O+</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full text-left justify-start" onClick={() => {
              toast({
                title: "Privacy settings",
                description: "This feature will be available in the next update.",
              });
            }}>
              Data sharing preferences
            </Button>
            <Button variant="outline" className="w-full text-left justify-start mt-2" onClick={() => {
              toast({
                title: "Change password",
                description: "This feature will be available in the next update.",
              });
            }}>
              Change password
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Profile;
