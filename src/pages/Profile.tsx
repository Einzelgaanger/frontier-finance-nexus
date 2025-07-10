
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Settings, FileText, Eye, Edit, Shield, Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    profile_picture_url: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchSurveyResponses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', user?.id)
        .order('year', { ascending: false });

      if (error) throw error;
      setSurveyResponses(data || []);
    } catch (error) {
      console.error('Error fetching survey responses:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSurveyResponses();
    }
  }, [user, fetchProfile, fetchSurveyResponses]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const updateProfile = async () => {
    try {
      let profilePictureUrl = profile.profile_picture_url;

      // Upload new image if selected
      if (profileImage) {
        profilePictureUrl = await uploadProfileImage(profileImage);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          profile_picture_url: profilePictureUrl,
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => ({ ...prev, profile_picture_url: profilePictureUrl }));
      setProfileImage(null);
      setImagePreview('');

      toast({
        title: "Profile Updated",
        description: "Your profile picture has been updated successfully.",
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200 border';
      case 'member': return 'bg-blue-100 text-blue-800 border-blue-200 border';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 border';
    }
  };

  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Viewer Access
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Profile settings are not available for Viewer accounts. Please upgrade to Member access to manage your profile.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black flex items-center">
            <User className="w-8 h-8 mr-3 text-blue-600" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and survey responses</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Profile</TabsTrigger>
            <TabsTrigger value="surveys" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Survey Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-black">Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getRoleBadgeColor(userRole)} capitalize`}>
                      {userRole}
                    </Badge>
                    {userRole === 'member' && !editMode ? (
                      <Button onClick={() => setEditMode(true)} variant="outline" size="sm" className="border-gray-300">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : userRole === 'member' && editMode ? (
                      <div className="flex space-x-2">
                        <Button onClick={updateProfile} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Save
                        </Button>
                        <Button onClick={() => setEditMode(false)} variant="outline" size="sm" className="border-gray-300">
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-black font-medium">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      disabled
                      className="border-gray-300 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-black font-medium">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      disabled
                      className="border-gray-300 bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-black font-medium">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="border-gray-300 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                {userRole === 'member' && (
                  <div>
                    <Label htmlFor="profile_picture" className="text-black font-medium">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {imagePreview || profile.profile_picture_url ? (
                            <img 
                              src={imagePreview || profile.profile_picture_url} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        {editMode && (imagePreview || profile.profile_picture_url) && (
                          <button
                            type="button"
                            onClick={removeProfileImage}
                            aria-label="Remove profile picture"
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          ref={fileInputRef}
                          id="profile_picture"
                          type="file"
                          accept="image/*"
                          disabled={!editMode}
                          onChange={handleImageChange}
                          className="border-gray-300"
                        />
                        <p className="text-xs text-gray-500">
                          {editMode ? "Click to upload or change profile picture (max 5MB)" : "Profile picture"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Survey Responses
                </CardTitle>
                <CardDescription>View and manage your submitted surveys</CardDescription>
              </CardHeader>
              <CardContent>
                {surveyResponses.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Survey Responses</h3>
                    <p className="text-gray-600 mb-4">You haven't completed any surveys yet.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Take Survey
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {surveyResponses.map((response: any) => (
                      <Card key={response.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-black">Survey for {response.year}</h4>
                              <p className="text-sm text-gray-500">
                                {response.completed_at 
                                  ? `Completed on ${new Date(response.completed_at).toLocaleDateString()}`
                                  : 'In Progress'
                                }
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="border-gray-300">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="border-gray-300">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
