
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2, Mail, Send, User, Globe, Target, DollarSign, FileText, Users, MapPin, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MembershipRequestModalProps {
  open: boolean;
  onClose: () => void;
}

interface ESCPApplicationForm {
  // Background Information
  name: string;
  email: string;
  vehicle_name: string;
  vehicle_website: string;
  
  // Team Information
  role_job_title: string;
  team_size: string;
  location: string;
  
  // Vehicle Information
  thesis: string;
  ticket_size: string;
  portfolio_investments: string;
  capital_raised: string;
  supporting_documents: string;
  
  // ESCP Network Expectations
  information_sharing: {
    fundraising_experience: boolean;
    getting_started_experience: boolean;
    fund_economics: boolean;
    due_diligence_expertise: boolean;
    portfolio_support: boolean;
    market_data: boolean;
    local_market_insights: boolean;
    co_investing_opportunities: boolean;
    other: boolean;
    other_text: string;
  };
  expectations: string;
  how_heard_about_network: string;
}

export function MembershipRequestModal({ open, onClose }: MembershipRequestModalProps) {
  const [formData, setFormData] = useState<ESCPApplicationForm>({
    name: '',
    email: '',
    vehicle_name: '',
    vehicle_website: '',
    role_job_title: '',
    team_size: '',
    location: '',
    thesis: '',
    ticket_size: '',
    portfolio_investments: '',
    capital_raised: '',
    supporting_documents: '',
    information_sharing: {
      fundraising_experience: false,
      getting_started_experience: false,
      fund_economics: false,
      due_diligence_expertise: false,
      portfolio_support: false,
      market_data: false,
      local_market_insights: false,
      co_investing_opportunities: false,
      other: false,
      other_text: ''
    },
    expectations: '',
    how_heard_about_network: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: keyof ESCPApplicationForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof ESCPApplicationForm['information_sharing'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      information_sharing: {
        ...prev.information_sharing,
        [field]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('membership_requests')
        .insert({
          user_id: user.id,
          applicant_name: formData.name,
          email: formData.email,
          vehicle_name: formData.vehicle_name,
          vehicle_website: formData.vehicle_website,
          role_job_title: formData.role_job_title,
          team_size: formData.team_size,
          location: formData.location,
          thesis: formData.thesis,
          ticket_size: formData.ticket_size,
          portfolio_investments: formData.portfolio_investments,
          capital_raised: formData.capital_raised,
          supporting_documents: formData.supporting_documents,
          information_sharing: JSON.stringify(formData.information_sharing),
          expectations: formData.expectations,
          how_heard_about_network: formData.how_heard_about_network,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your ESCP Network application has been submitted for review. We'll get back to you once the review is completed."
      });

      setFormData({
        name: '',
        email: '',
        vehicle_name: '',
        vehicle_website: '',
        role_job_title: '',
        team_size: '',
        location: '',
        thesis: '',
        ticket_size: '',
        portfolio_investments: '',
        capital_raised: '',
        supporting_documents: '',
        information_sharing: {
          fundraising_experience: false,
          getting_started_experience: false,
          fund_economics: false,
          due_diligence_expertise: false,
          portfolio_support: false,
          market_data: false,
          local_market_insights: false,
          co_investing_opportunities: false,
          other: false,
          other_text: ''
        },
        expectations: '',
        how_heard_about_network: ''
      });
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Early Stage Capital Provider (ESCP) Network Application Form
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 space-y-2">
            <p>Thank you for showing interest in joining the Early Stage Capital Provider (ESCP) Network!</p>
            <p>Note that the individual seeking membership should be a GP or Vehicle lead. Once your application is received, we will share it with the membership committee from the network for review. We will get back to you with the decision once the review is completed. For any questions, do not hesitate to contact Arnold Byarugaba at arnold@frontierfinance.org</p>
            <p className="font-medium">Ready to join - Please complete the form below.</p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Background Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              BACKGROUND INFORMATION
            </h3>
            <p className="text-sm text-gray-600">Please provide the following contact information</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">1. Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
            <div className="space-y-2">
                <Label htmlFor="email">2. Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle_name">3. Vehicle Name *</Label>
                <Input
                  id="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={(e) => handleInputChange('vehicle_name', e.target.value)}
                  required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="vehicle_website">4. Vehicle Website *</Label>
                <Input
                  id="vehicle_website"
                  type="url"
                  value={formData.vehicle_website}
                  onChange={(e) => handleInputChange('vehicle_website', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Team Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              TEAM INFORMATION
            </h3>
            <p className="text-sm text-gray-600">Please provide the below information about your team structure</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role_job_title">5. Role/Job Title *</Label>
                <Textarea
                  id="role_job_title"
                  placeholder="Describe your role in the vehicle named and your previous relevant experience."
                  value={formData.role_job_title}
                  onChange={(e) => handleInputChange('role_job_title', e.target.value)}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team_size">6. Team Size *</Label>
                <Textarea
                  id="team_size"
                  placeholder="What is your team size and do you have a co-founder (please also indicate if you have plans to grow your team/recruit a co-founder and an expected timeline)? Briefly describe the respective roles of other team members, if applicable."
                  value={formData.team_size}
                  onChange={(e) => handleInputChange('team_size', e.target.value)}
                  required
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">7. Location *</Label>
                <Textarea
                  id="location"
                  placeholder="Where are you or your team located? Indicate if you or your team plan to relocate and if so, kindly share an expected timeline."
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              VEHICLE INFORMATION
            </h3>
            <p className="text-sm text-gray-600">Please provide the information below about your investment vehicle</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thesis">8. Thesis *</Label>
                <Textarea
                  id="thesis"
                  placeholder="Describe your vehicle's investment thesis i.e. target market(s), geography, sector(s), lens, instrument(s) etc."
                  value={formData.thesis}
                  onChange={(e) => handleInputChange('thesis', e.target.value)}
                  required
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ticket_size">9. Ticket Size *</Label>
                <Input
                  id="ticket_size"
                  placeholder="What is your average ticket size in USD (alternatively feel free to provide a range)?"
                  value={formData.ticket_size}
                  onChange={(e) => handleInputChange('ticket_size', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portfolio_investments">10. Portfolio *</Label>
                <Input
                  id="portfolio_investments"
                  placeholder="How many investments has your vehicle made to date?"
                  value={formData.portfolio_investments}
                  onChange={(e) => handleInputChange('portfolio_investments', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capital_raised">11. Capital Raised *</Label>
                <Textarea
                  id="capital_raised"
                  placeholder="Describe the soft and hard capital commitments secured by your vehicle to date, including whether you have personally contributed capital."
                  value={formData.capital_raised}
                  onChange={(e) => handleInputChange('capital_raised', e.target.value)}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supporting_documents">12. Supporting Documents *</Label>
                <Textarea
                  id="supporting_documents"
                  placeholder="Kindly upload your pitch deck, one-pager or other relevant documents. (Please provide links or describe the documents you would upload)"
                  value={formData.supporting_documents}
                  onChange={(e) => handleInputChange('supporting_documents', e.target.value)}
                  required
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* ESCP Network Expectations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              ESCP NETWORK EXPECTATIONS
            </h3>
            <p className="text-sm text-gray-600">Please respond to the following questions regarding expectations of the network</p>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>13. Information Sharing *</Label>
                <p className="text-sm text-gray-600">The ESCP Network is a peer-to-peer learning network with an expectation of transparent information sharing amongst members. Indicate the topics where you are willing to make regular contributions.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fundraising_experience"
                      checked={formData.information_sharing.fundraising_experience}
                      onCheckedChange={(checked) => handleCheckboxChange('fundraising_experience', checked as boolean)}
                    />
                    <Label htmlFor="fundraising_experience">Fundraising Experience</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="getting_started_experience"
                      checked={formData.information_sharing.getting_started_experience}
                      onCheckedChange={(checked) => handleCheckboxChange('getting_started_experience', checked as boolean)}
                    />
                    <Label htmlFor="getting_started_experience">Experience of getting started/launching</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fund_economics"
                      checked={formData.information_sharing.fund_economics}
                      onCheckedChange={(checked) => handleCheckboxChange('fund_economics', checked as boolean)}
                    />
                    <Label htmlFor="fund_economics">Fund Economics (eg vehicle structuring)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="due_diligence_expertise"
                      checked={formData.information_sharing.due_diligence_expertise}
                      onCheckedChange={(checked) => handleCheckboxChange('due_diligence_expertise', checked as boolean)}
                    />
                    <Label htmlFor="due_diligence_expertise">Due Diligence Expertise/Investment Readiness</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="portfolio_support"
                      checked={formData.information_sharing.portfolio_support}
                      onCheckedChange={(checked) => handleCheckboxChange('portfolio_support', checked as boolean)}
                    />
                    <Label htmlFor="portfolio_support">Portfolio Support/Technical Assistance</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="market_data"
                      checked={formData.information_sharing.market_data}
                      onCheckedChange={(checked) => handleCheckboxChange('market_data', checked as boolean)}
                    />
                    <Label htmlFor="market_data">Market Data (eg termsheets, valuations)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="local_market_insights"
                      checked={formData.information_sharing.local_market_insights}
                      onCheckedChange={(checked) => handleCheckboxChange('local_market_insights', checked as boolean)}
                    />
                    <Label htmlFor="local_market_insights">Local Market Insights (Geographical or sector expertise)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="co_investing_opportunities"
                      checked={formData.information_sharing.co_investing_opportunities}
                      onCheckedChange={(checked) => handleCheckboxChange('co_investing_opportunities', checked as boolean)}
                    />
                    <Label htmlFor="co_investing_opportunities">Co-investing Opportunities</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="other"
                      checked={formData.information_sharing.other}
                      onCheckedChange={(checked) => handleCheckboxChange('other', checked as boolean)}
                    />
                    <Label htmlFor="other">Other:</Label>
                  </div>
                  
                  {formData.information_sharing.other && (
                    <div className="ml-6">
                      <Input
                        placeholder="Please specify"
                        value={formData.information_sharing.other_text}
                        onChange={(e) => handleCheckboxChange('other_text', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectations">14. Expectations *</Label>
                <Textarea
                  id="expectations"
                  placeholder="Please let us know why you would like to join the ESCP Network and what your expectations of the network are?"
                  value={formData.expectations}
                  onChange={(e) => handleInputChange('expectations', e.target.value)}
                  required
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="how_heard_about_network">15. How did you hear about the ESCP Network? *</Label>
                <Input
                  id="how_heard_about_network"
                  placeholder="Please let us know where you heard about the ESCP Network."
                  value={formData.how_heard_about_network}
                  onChange={(e) => handleInputChange('how_heard_about_network', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
