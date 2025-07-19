
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Users, User, Mail, Phone, Briefcase, Hash } from 'lucide-react';
import { useState, useEffect } from 'react';

import type { SurveyFormData } from '@/types/survey';
interface TeamSectionProps {
  form: UseFormReturn<SurveyFormData>;
}

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export function TeamSection({ form }: TeamSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    (form.getValues('team_members') as TeamMember[]) || []
  );

  // Filter out empty team members before form submission
  useEffect(() => {
    const validMembers = teamMembers.filter(member => 
      member.name.trim() !== '' || member.role.trim() !== '' || member.email.trim() !== '' || member.phone.trim() !== ''
    );
    if (validMembers.length !== teamMembers.length) {
      form.setValue('team_members', validMembers);
    }
  }, [teamMembers, form]);

  const addTeamMember = () => {
    const newMembers = [...teamMembers, { name: '', email: '', phone: '', role: '' }];
    setTeamMembers(newMembers);
    form.setValue('team_members', newMembers);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...teamMembers];
    newMembers[index][field] = value;
    setTeamMembers(newMembers);
    form.setValue('team_members', newMembers);
  };

  const removeTeamMember = (index: number) => {
    const newMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newMembers);
    form.setValue('team_members', newMembers);
  };

  return (
    <div className="space-y-8">
      {/* Team Size */}
      <Card className="border-indigo-200 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-900">
            <Hash className="w-5 h-5 mr-2" />
            Team Size
          </CardTitle>
          <CardDescription className="text-indigo-700">
            Specify the size range of your investment team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="team_size_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-800 font-medium">Minimum Team Size *</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="1"
                      className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200"
                      value={field.value ? field.value.toString() : ''}
                      onChange={(e) => {
                        const parsedValue = parseInt(e.target.value) || 0;
                        field.onChange(parsedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_size_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-800 font-medium">Maximum Team Size *</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="10"
                      className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200"
                      value={field.value ? field.value.toString() : ''}
                      onChange={(e) => {
                        const parsedValue = parseInt(e.target.value) || 0;
                        field.onChange(parsedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Description */}
      <Card className="border-teal-200 bg-teal-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-teal-900">
            <Users className="w-5 h-5 mr-2" />
            Team Overview
          </CardTitle>
          <CardDescription className="text-teal-700">
            Describe your team's background, experience, and key strengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="team_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800 font-medium">Team Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your team's background, experience, and key strengths..."
                    className="min-h-[100px] border-teal-200 focus:border-teal-400 focus:ring-teal-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Key Team Members */}
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center text-orange-900">
                <User className="w-5 h-5 mr-2" />
                GP Partners
              </CardTitle>
              <CardDescription className="text-orange-700">
                Add details for key GP partners and leadership
              </CardDescription>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addTeamMember}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamMembers.map((member, index) => (
            <Card key={index} className="border-orange-100 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-orange-800">GP Partner {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeTeamMember(index)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Full Name *"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Email *"
                      type="email"
                      value={member.email}
                      onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                      className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Phone *"
                      type="tel"
                      value={member.phone}
                      onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                      className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Role/Position *"
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                      className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
