// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Building2, 
  Mail, 
  Globe, 
  FileText, 
  Camera,
  Save,
  Loader2,
  Upload,
  X
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  company_name: string;
  email: string;
  website: string;
  description: string;
  profile_photo_url: string;
}

const MyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [credits, setCredits] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    website: '',
    description: '',
    profile_photo_url: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Fetch user profile
  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles' as any)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        // If table doesn't exist, create a default profile
        if (error.code === '42P01') { // Table doesn't exist
          console.log('user_profiles table does not exist, creating default profile');
          const defaultProfile = {
            id: 'temp',
            user_id: user.id,
            company_name: user.email?.split('@')[0] || 'CFF Network User',
            email: user.email || '',
            website: '',
            description: '',
            profile_photo_url: ''
          };
          setProfile(defaultProfile);
          setFormData({
            company_name: defaultProfile.company_name,
            email: defaultProfile.email,
            website: defaultProfile.website,
            description: defaultProfile.description,
            profile_photo_url: defaultProfile.profile_photo_url
          });
          return;
        }
        throw error;
      }

      if (data) {
        const profileData = data as unknown as UserProfile;
        setProfile(profileData);
        setFormData({
          company_name: profileData.company_name || '',
          email: profileData.email || '',
          website: profileData.website || '',
          description: profileData.description || '',
          profile_photo_url: profileData.profile_photo_url || ''
        });
      }

      // Fetch credits
      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (creditsData) {
        setCredits(creditsData);
      }

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityData) {
        setRecentActivity(activityData);
      }

      if (!data) {
        // Create default profile - handle case where user might not exist in auth.users
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles' as any)
          .insert({
            user_id: user.id,
            company_name: user.email?.split('@')[0] || 'CFF Network User',
            email: user.email || '',
            website: '',
            description: '',
            profile_photo_url: ''
          })
          .select()
          .single();

        if (createError) {
          // If user doesn't exist in auth.users, try to find them in user_backup
          console.log('User not found in auth.users, checking user_backup...');
          const { data: backupUser } = await supabase
            .from('user_backup')
            .select('id, email, first_name, last_name')
            .eq('id', user.id)
            .single();

          if (backupUser) {
            // Create profile using backup data
            const { data: newProfileFromBackup, error: createError2 } = await supabase
              .from('user_profiles' as any)
              .insert({
                user_id: user.id,
                company_name: backupUser.first_name && backupUser.last_name 
                  ? `${backupUser.first_name} ${backupUser.last_name}` 
                  : backupUser.email?.split('@')[0] || 'CFF Network User',
                email: backupUser.email || user.email || '',
                website: '',
                description: '',
                profile_photo_url: ''
              })
              .select()
              .single();

            if (createError2) throw createError2;
            
            const backupProfileData = newProfileFromBackup as unknown as UserProfile;
            setProfile(backupProfileData);
            setFormData({
              company_name: backupProfileData.company_name || '',
              email: backupProfileData.email || '',
              website: backupProfileData.website || '',
              description: backupProfileData.description || '',
              profile_photo_url: backupProfileData.profile_photo_url || ''
            });
          } else {
            throw createError;
          }
        } else {
          const newProfileData = newProfile as unknown as UserProfile;
          setProfile(newProfileData);
          setFormData({
            company_name: newProfileData.company_name || '',
            email: newProfileData.email || '',
            website: newProfileData.website || '',
            description: newProfileData.description || '',
            profile_photo_url: newProfileData.profile_photo_url || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);
      
      let profilePhotoUrl = formData.profile_photo_url;
      
      // Handle image upload if a new image was selected
      if (profileImage) {
        // For now, we'll use the data URL as the photo URL
        // In a real app, you'd upload to a storage service like Supabase Storage
        profilePhotoUrl = imagePreview;
      }

      const { error } = await supabase
        .from('user_profiles' as any)
        .update({
          company_name: formData.company_name,
          email: formData.email,
          website: formData.website,
          description: formData.description,
          profile_photo_url: profilePhotoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Clear the image state
      setProfileImage(null);
      setImagePreview('');

      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      profile_photo_url: ''
    }));
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">
        {/* Header Section */}
        <div className="relative z-10 pt-6 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                My Profile
              </h1>
              <p className="text-sm text-gray-600 mb-6 max-w-2xl">
                Manage your company information and profile details
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Profile Photo Section */}
            <div className="lg:col-span-1">
              <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Profile Photo</h2>
                    </div>
                    
                    <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white shadow-lg">
                      <AvatarImage src={imagePreview || formData.profile_photo_url} className="object-cover" />
                      <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {formData.company_name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
                          <Upload className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Upload Photo</span>
                        </div>
                      </Label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    
                    {profileImage && (
                      <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">
                          Selected: {profileImage.name}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove Image
                        </Button>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 text-center">
                      Max 5MB. JPG, PNG, GIF supported.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="lg:col-span-2">
              <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Company Information</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Company Name */}
                    <div className="space-y-3">
                      <Label htmlFor="company_name" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>Company Name</span>
                      </Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        placeholder="Enter your company name"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                      <Label htmlFor="email" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>Email</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-3">
                      <Label htmlFor="website" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>Website</span>
                      </Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourcompany.com"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label htmlFor="description" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Description</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Tell us about your company..."
                        rows={4}
                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-6">
                      <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Points</p>
                <p className="text-3xl font-bold text-primary">{credits?.total_points || 0}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">AI Queries</p>
                <p className="text-3xl font-bold text-blue-600">{credits?.ai_usage_count || 0}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/20 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Blog Posts</p>
                <p className="text-3xl font-bold text-green-600">{credits?.blog_posts_count || 0}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/20 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Login Streak</p>
                <p className="text-3xl font-bold text-orange-600">{credits?.login_streak || 0} days</p>
              </div>
            </div>
          </div>

          {/* Recent Activity & Points Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 sm:px-6 lg:px-8 pb-12">
            {/* Recent Activity */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No activity yet. Start using the platform to earn points!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {activity.description || activity.activity_type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
                          +{activity.points_earned}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Points Info */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">How to Earn Points</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                    <span className="font-bold text-lg text-primary">+10</span>
                    <span className="text-sm text-gray-700">Create a blog post</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                    <span className="font-bold text-lg text-primary">+5</span>
                    <span className="text-sm text-gray-700">Use AI assistant</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                    <span className="font-bold text-lg text-primary">+2</span>
                    <span className="text-sm text-gray-700">Daily login</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                    <span className="font-bold text-lg text-primary">+20</span>
                    <span className="text-sm text-gray-700">Complete survey</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default MyProfile;
