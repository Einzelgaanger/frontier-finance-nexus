
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface TeamSectionProps {
  form: UseFormReturn<any>;
}

interface TeamMember {
  name: string;
  role: string;
  experience: string;
}

export function TeamSection({ form }: TeamSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    form.getValues('team_members') || []
  );

  const addTeamMember = () => {
    const newMembers = [...teamMembers, { name: '', role: '', experience: '' }];
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="team_size_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Team Size *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
              <FormLabel>Maximum Team Size *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="team_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Description *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your team's background, experience, and key strengths..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Key Team Members</h3>
          <Button type="button" variant="outline" onClick={addTeamMember}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {teamMembers.map((member, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Team Member {index + 1}</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeTeamMember(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Full Name"
                value={member.name}
                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Role/Position"
                value={member.role}
                onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
              />
              <Textarea
                placeholder="Experience and background..."
                value={member.experience}
                onChange={(e) => updateTeamMember(index, 'experience', e.target.value)}
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
