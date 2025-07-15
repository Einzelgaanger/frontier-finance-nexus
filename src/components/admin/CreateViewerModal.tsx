import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';

const viewerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  // Survey fields - all sections
  vehicle_name: z.string().min(1, 'Fund name is required'),
  vehicle_websites: z.string().optional(),
  vehicle_type: z.string().optional(),
  vehicle_type_other: z.string().optional(),
  thesis: z.string().optional(),
  team_size_min: z.number().min(1, 'Team size must be at least 1'),
  team_size_max: z.number().min(1, 'Team size must be at least 1'),
  team_description: z.string().optional(),
  team_members: z.string().optional(),
  legal_domicile: z.string().optional(),
  markets_operated: z.string().optional(),
  ticket_size_min: z.number().min(0, 'Ticket size must be non-negative'),
  ticket_size_max: z.number().min(0, 'Ticket size must be non-negative'),
  ticket_description: z.string().optional(),
  target_capital: z.number().min(0, 'Target capital must be non-negative'),
  capital_raised: z.number().min(0, 'Capital raised must be non-negative'),
  capital_in_market: z.number().min(0, 'Capital in market must be non-negative'),
  supporting_document_url: z.string().optional(),
  information_sharing: z.string().optional(),
  expectations: z.string().optional(),
  how_heard_about_network: z.string().optional(),
  fund_stage: z.string().optional(),
  current_status: z.string().optional(),
  legal_entity_date_from: z.number().optional(),
  legal_entity_date_to: z.number().optional(),
  legal_entity_month_from: z.number().optional(),
  legal_entity_month_to: z.number().optional(),
  first_close_date_from: z.number().optional(),
  first_close_date_to: z.number().optional(),
  first_close_month_from: z.number().optional(),
  first_close_month_to: z.number().optional(),
  investment_instruments_priority: z.string().optional(),
  sectors_allocation: z.string().optional(),
  target_return_min: z.number().min(0, 'Target return must be non-negative'),
  target_return_max: z.number().min(0, 'Target return must be non-negative'),
  equity_investments_made: z.number().min(0, 'Equity investments must be non-negative'),
  equity_investments_exited: z.number().min(0, 'Equity investments exited must be non-negative'),
  self_liquidating_made: z.number().min(0, 'Self liquidating investments must be non-negative'),
  self_liquidating_exited: z.number().min(0, 'Self liquidating investments exited must be non-negative'),
  survey_year: z.number().min(2020, 'Year must be 2020 or later').max(2030, 'Year must be 2030 or earlier'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.team_size_max >= data.team_size_min, {
  message: "Maximum team size must be greater than or equal to minimum team size",
  path: ["team_size_max"],
}).refine((data) => data.ticket_size_max >= data.ticket_size_min, {
  message: "Maximum ticket size must be greater than or equal to minimum ticket size",
  path: ["ticket_size_max"],
}).refine((data) => data.target_return_max >= data.target_return_min, {
  message: "Maximum target return must be greater than or equal to minimum target return",
  path: ["target_return_max"],
});

type ViewerFormData = z.infer<typeof viewerSchema>;

interface CreateViewerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateViewerModal = ({ open, onClose, onSuccess }: CreateViewerModalProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ViewerFormData>({
    resolver: zodResolver(viewerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      vehicle_name: '',
      vehicle_websites: '',
      vehicle_type: '',
      vehicle_type_other: '',
      thesis: '',
      team_size_min: 1,
      team_size_max: 1,
      team_description: '',
      team_members: '',
      legal_domicile: '',
      markets_operated: '',
      ticket_size_min: 0,
      ticket_size_max: 0,
      ticket_description: '',
      target_capital: 0,
      capital_raised: 0,
      capital_in_market: 0,
      supporting_document_url: '',
      information_sharing: '',
      expectations: '',
      how_heard_about_network: '',
      fund_stage: '',
      current_status: '',
      legal_entity_date_from: undefined,
      legal_entity_date_to: undefined,
      legal_entity_month_from: undefined,
      legal_entity_month_to: undefined,
      first_close_date_from: undefined,
      first_close_date_to: undefined,
      first_close_month_from: undefined,
      first_close_month_to: undefined,
      investment_instruments_priority: '',
      sectors_allocation: '',
      target_return_min: 0,
      target_return_max: 0,
      equity_investments_made: 0,
      equity_investments_exited: 0,
      self_liquidating_made: 0,
      self_liquidating_exited: 0,
      survey_year: new Date().getFullYear(),
    }
  });

  const onSubmit = async (data: ViewerFormData) => {
    setIsCreating(true);

    try {
      // Prepare survey data for the database function
      const surveyData = {
        vehicle_name: data.vehicle_name,
        vehicle_websites: data.vehicle_websites,
        vehicle_type: data.vehicle_type,
        vehicle_type_other: data.vehicle_type_other,
        thesis: data.thesis,
        team_members: data.team_members ? JSON.parse(data.team_members) : [],
        team_size_min: data.team_size_min,
        team_size_max: data.team_size_max,
        team_description: data.team_description,
        legal_domicile: data.legal_domicile ? [data.legal_domicile] : [],
        markets_operated: data.markets_operated ? JSON.parse(data.markets_operated) : {},
        ticket_size_min: data.ticket_size_min,
        ticket_size_max: data.ticket_size_max,
        ticket_description: data.ticket_description,
        target_capital: data.target_capital,
        capital_raised: data.capital_raised,
        capital_in_market: data.capital_in_market,
        supporting_document_url: data.supporting_document_url,
        information_sharing: data.information_sharing,
        expectations: data.expectations,
        how_heard_about_network: data.how_heard_about_network,
        fund_stage: data.fund_stage ? [data.fund_stage] : [],
        current_status: data.current_status,
        legal_entity_date_from: data.legal_entity_date_from,
        legal_entity_date_to: data.legal_entity_date_to,
        legal_entity_month_from: data.legal_entity_month_from,
        legal_entity_month_to: data.legal_entity_month_to,
        first_close_date_from: data.first_close_date_from,
        first_close_date_to: data.first_close_date_to,
        first_close_month_from: data.first_close_month_from,
        first_close_month_to: data.first_close_month_to,
        investment_instruments_priority: data.investment_instruments_priority ? JSON.parse(data.investment_instruments_priority) : {},
        sectors_allocation: data.sectors_allocation ? JSON.parse(data.sectors_allocation) : {},
        target_return_min: data.target_return_min,
        target_return_max: data.target_return_max,
        equity_investments_made: data.equity_investments_made,
        equity_investments_exited: data.equity_investments_exited,
        self_liquidating_made: data.self_liquidating_made,
        self_liquidating_exited: data.self_liquidating_exited,
      };

      // Call the database function to create viewer with survey
      const { data: result, error } = await supabase.rpc('create_viewer_with_survey', {
        viewer_email: data.email,
        viewer_password: data.password,
        survey_data: surveyData,
        survey_year: data.survey_year
      });

      if (error) {
        console.error('Error creating viewer:', error);
        toast({
          title: "Error Creating Viewer",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Viewer Created Successfully",
        description: `Viewer account created for ${data.email} with survey for ${data.survey_year}`,
      });

      form.reset();
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error creating viewer:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Create Viewer with Complete Survey
          </DialogTitle>
          <DialogDescription>
            Create a new viewer account and complete a full survey for them. Copy data from Excel sheets and fill in all fields.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="viewer@example.com" />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="survey_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Survey Year *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="2020" max="2030" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 1: Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 1: Vehicle Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vehicle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fund Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter fund name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicle_websites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicle_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fund Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fund type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="venture_capital">Venture Capital</SelectItem>
                            <SelectItem value="private_equity">Private Equity</SelectItem>
                            <SelectItem value="growth_equity">Growth Equity</SelectItem>
                            <SelectItem value="angel_investor">Angel Investor</SelectItem>
                            <SelectItem value="family_office">Family Office</SelectItem>
                            <SelectItem value="sovereign_wealth_fund">Sovereign Wealth Fund</SelectItem>
                            <SelectItem value="pension_fund">Pension Fund</SelectItem>
                            <SelectItem value="endowment">Endowment</SelectItem>
                            <SelectItem value="foundation">Foundation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicle_type_other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Fund Type (if applicable)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Specify other fund type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thesis"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Investment Thesis</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe your investment thesis" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 2: Team & Leadership */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 2: Team & Leadership</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="team_size_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Team Size</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" />
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
                      <FormLabel>Max Team Size</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe your team" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_members"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>Team Members (JSON format)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder='[{"name":"John Doe","email":"john@example.com","role":"GP"}]' rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 3: Geographic & Market Focus */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 3: Geographic & Market Focus</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="legal_domicile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Domicile</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Delaware, USA" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="markets_operated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Markets Operated (JSON format)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder='{"North America": 60, "Europe": 40}' rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 4: Investment Strategy */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 4: Investment Strategy</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ticket_size_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Ticket Size (USD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticket_size_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Ticket Size (USD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_capital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Capital (USD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capital_raised"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capital Raised (USD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capital_in_market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capital in Market (USD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticket_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Size Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe your typical ticket size" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 5: Fund Operations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 5: Fund Operations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supporting_document_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supporting Document URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/document.pdf" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="information_sharing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Information Sharing Topics</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Topics you're willing to share" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expectations from Network</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="What do you expect from the network?" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="how_heard_about_network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about the network?</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="How did you discover this network?" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 6: Fund Status & Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 6: Fund Status & Timeline</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fund_stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fund Stage</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fund stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="seed">Seed</SelectItem>
                            <SelectItem value="series_a">Series A</SelectItem>
                            <SelectItem value="series_b">Series B</SelectItem>
                            <SelectItem value="series_c">Series C</SelectItem>
                            <SelectItem value="growth">Growth</SelectItem>
                            <SelectItem value="late_stage">Late Stage</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select current status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="raising">Raising</SelectItem>
                            <SelectItem value="investing">Investing</SelectItem>
                            <SelectItem value="exiting">Exiting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_entity_date_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Entity Date From (Year)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1900" max="2030" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_entity_date_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Entity Date To (Year)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1900" max="2030" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_entity_month_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Entity Month From</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_entity_month_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Entity Month To</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_close_date_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Close Date From (Year)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1900" max="2030" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_close_date_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Close Date To (Year)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1900" max="2030" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_close_month_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Close Month From</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_close_month_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Close Month To</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 7: Investment Instruments */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 7: Investment Instruments</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="investment_instruments_priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Instruments Priority (JSON format)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder='{"Senior Debt (Secured)": 1, "Convertible Notes": 2, "Common Equity": 3}' rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 8: Sector Focus & Returns */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Section 8: Sector Focus & Returns</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target_return_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Target Return (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_return_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Target Return (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equity_investments_made"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equity Investments Made</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equity_investments_exited"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equity Investments Exited</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="self_liquidating_made"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Self Liquidating Made</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="self_liquidating_exited"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Self Liquidating Exited</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sectors_allocation"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Sectors Allocation (JSON format)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder='{"Software Services / SaaS": 30, "Clean Energy": 25, "Healthcare": 20, "Education": 15, "Other": 10}' rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Viewer with Survey
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

export default CreateViewerModal; 