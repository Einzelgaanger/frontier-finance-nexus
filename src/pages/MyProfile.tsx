import { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, User, Mail, Globe, Building2 } from 'lucide-react';

export default function MyProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    website: '',
    profile_picture_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          company_name: data.company_name || '',
          description: data.description || '',
          website: data.website || '',
          profile_picture_url: data.profile_picture_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert any image to PNG via canvas (used when uploading ICO files)
  const convertImageToPng = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 256;
          canvas.height = img.height || 256;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('PNG conversion failed'));
            resolve(blob);
          }, 'image/png', 0.92);
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file', variant: 'destructive' });
      e.currentTarget.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image smaller than 2MB', variant: 'destructive' });
      e.currentTarget.value = '';
      return;
    }

    // Handle supported types and convert unsupported (e.g., ICO) to PNG
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    let uploadBlob: Blob = file;
    let uploadExt = 'png';
    let contentType = 'image/png';

    if (!allowedTypes.includes(file.type)) {
      // Try converting ICO to PNG, otherwise block
      if (file.type === 'image/x-icon' || file.type === 'image/vnd.microsoft.icon' || file.name.toLowerCase().endsWith('.ico')) {
        try {
          uploadBlob = await convertImageToPng(file);
          uploadExt = 'png';
          contentType = 'image/png';
        } catch (err) {
          console.error('ICO conversion failed', err);
          toast({ title: 'Unsupported format', description: 'Please upload PNG, JPG or WEBP.', variant: 'destructive' });
          e.currentTarget.value = '';
          return;
        }
      } else {
        toast({ title: 'Unsupported format', description: 'Please upload PNG, JPG or WEBP.', variant: 'destructive' });
        e.currentTarget.value = '';
        return;
      }
    } else {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') { contentType = 'image/jpeg'; uploadExt = 'jpg'; }
      else if (file.type === 'image/webp') { contentType = 'image/webp'; uploadExt = 'webp'; }
      else { contentType = 'image/png'; uploadExt = 'png'; }
    }

    try {
      setUploading(true);
      const fileName = `${user.id}/avatar.${uploadExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, uploadBlob, { upsert: true, contentType, cacheControl: '3600' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfile(prev => ({ ...prev, profile_picture_url: publicUrl }));

      toast({ title: 'Success', description: 'Avatar uploaded successfully' });
      e.currentTarget.value = '';
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ title: 'Upload failed', description: 'Could not upload avatar', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('user_profiles')
        .update({
          company_name: profile.company_name,
          description: profile.description,
          website: profile.website,
          profile_picture_url: profile.profile_picture_url
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="container max-w-4xl mx-auto py-6 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <Card className="shadow-lg border-blue-100">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Name *
                    </Label>
                    <Input
                      id="company_name"
                      value={profile.company_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Company Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Company Description
                    </Label>
                    <Textarea
                      id="description"
                      value={profile.description}
                      onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your company"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Avatar and Email */}
              <div className="flex flex-col items-center justify-start pt-2">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={profile.profile_picture_url} />
                  <AvatarFallback className="text-4xl">
                    {profile.company_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <Label htmlFor="avatar-upload" className="cursor-pointer mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      {uploading ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Uploading
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 mr-1" />
                          Change Photo
                        </>
                      )}
                    </span>
                  </Button>
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleUploadAvatar}
                  disabled={uploading}
                />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
