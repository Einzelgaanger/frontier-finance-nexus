import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserModal = ({ open, onClose, onSuccess }: CreateUserModalProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    }
  });

  // Load draft on modal open
  useEffect(() => {
    if (open) {
      const draft = localStorage.getItem('createUserDraft');
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          form.reset(draftData);
          setHasDraft(true);
        } catch (error) {
          console.error('Error loading draft:', error);
          localStorage.removeItem('createUserDraft');
        }
      }
    }
  }, [open, form]);

  // Save draft when form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (open && (value.email || value.firstName || value.lastName)) {
        const draftData = {
          email: value.email || '',
          firstName: value.firstName || '',
          lastName: value.lastName || '',
          password: '',
          confirmPassword: '',
        };
        localStorage.setItem('createUserDraft', JSON.stringify(draftData));
        setHasDraft(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, open]);

  const clearDraft = () => {
    localStorage.removeItem('createUserDraft');
    setHasDraft(false);
    form.reset();
  };

  const onSubmit = async (data: UserFormData) => {
    setIsCreating(true);

    try {
      // Use the project URL directly since supabaseUrl is protected
      const supabaseUrl = 'https://qiqxdivyyjcbegdlptuq.supabase.co';
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

      // Use the existing create-viewer Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/create-viewer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          survey_data: {
            vehicle_name: `${data.firstName} ${data.lastName}`,
            first_name: data.firstName,
            last_name: data.lastName
          },
          survey_year: new Date().getFullYear()
        })
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse response:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMessage = result?.error || result?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      console.log('User created successfully:', result);

      toast({
        title: "User Created Successfully",
        description: `User account created for ${data.email} with role: viewer`,
      });

      clearDraft(); // Clear the draft after successful creation
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error Creating User",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              <DialogTitle>Create User Account</DialogTitle>
            </div>
            {hasDraft && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearDraft}
                className="text-xs"
              >
                <Save className="w-3 h-3 mr-1" />
                Clear Draft
              </Button>
            )}
          </div>
          <DialogDescription>
            Create a new user account. The user will be able to log in and complete surveys.
            {hasDraft && <span className="text-blue-600"> Draft loaded from previous session.</span>}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="user@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal; 