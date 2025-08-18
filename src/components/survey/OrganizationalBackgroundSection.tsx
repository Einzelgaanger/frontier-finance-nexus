import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';

interface OrganizationalBackgroundSectionProps {
  form: UseFormReturn<any>;
}

export const OrganizationalBackgroundSection = ({ form }: OrganizationalBackgroundSectionProps) => {

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Organizational Background and Team</h2>
        <p className="text-gray-600">Tell us about your organization and team structure</p>
      </div>

      {/* Respondent Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Respondent Information</CardTitle>
          <CardDescription>Please provide your contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="respondent_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respondent_role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Role or title *</FormLabel>
                <FormControl>
                  <Input placeholder="Your role or title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respondent_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Name of organisation *</FormLabel>
                <FormControl>
                  <Input placeholder="Your organization name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
          <CardDescription>When did your current fund/investment vehicle achieve each of the following?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="legal_entity_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Legal Entity *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2015_or_earlier">2015 or earlier</SelectItem>
                      <SelectItem value="2016_2020">2016 - 2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_close_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">First Close (or equivalent) *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2015_or_earlier">2015 or earlier</SelectItem>
                      <SelectItem value="2016_2020">2016 - 2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_investment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">First Investment *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2015_or_earlier">2015 or earlier</SelectItem>
                      <SelectItem value="2016_2020">2016 - 2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Geographic Markets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Geographic Markets</CardTitle>
          <CardDescription>In what geographic markets do you operate?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="markets_operated"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa',
                    'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa',
                    'Middle East', 'Other'
                  ].map((market) => (
                    <FormField
                      key={market}
                      control={form.control}
                      name="markets_operated"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={market}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(market)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, market])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== market
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {market}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Team Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Location</CardTitle>
          <CardDescription>Where is your Team based?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="team_location"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa',
                    'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa',
                    'Middle East', 'Other'
                  ].map((location) => (
                    <FormField
                      key={location}
                      control={form.control}
                      name="team_location"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={location}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(location)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, location])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== location
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {location}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Team Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Size</CardTitle>
          <CardDescription>Number of current and forecasted Full Time Equivalent staff members (FTEs) including principals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="current_ftes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Current</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="≤2">≤ 2 FTEs</SelectItem>
                      <SelectItem value="3-5">3 - 5 FTEs</SelectItem>
                      <SelectItem value="6-10">6 - 10 FTEs</SelectItem>
                      <SelectItem value="&gt;10">&gt;10 FTEs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="forecasted_ftes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Year-End 2023 (est.)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="≤2">≤ 2 FTEs</SelectItem>
                      <SelectItem value="3-5">3 - 5 FTEs</SelectItem>
                      <SelectItem value="6-10">6 - 10 FTEs</SelectItem>
                      <SelectItem value="&gt;10">&gt;10 FTEs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Carried Interest Principals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carried Interest Principals</CardTitle>
          <CardDescription>Number of carried-interest/equity-interest principals currently in your Fund management team</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="carried_interest_principals"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="0" />
                      <Label htmlFor="0">0</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="1" />
                      <Label htmlFor="1">1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-3" id="2-3" />
                      <Label htmlFor="2-3">2 - 3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4-5" id="4-5" />
                      <Label htmlFor="4-5">4 - 5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="&gt;5" id="&gt;5" />
                      <Label htmlFor="&gt;5">&gt; 5</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Team Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Experience</CardTitle>
          <CardDescription>Within the GP leadership team / fund principals, what is their prior work experience as it relates to fund management?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              'New to investment and fund management',
              'Investment/ financial experience in adjacent finance field (e.g. banking, asset management, financial advisory)',
              'Relevant business management experience (e.g. Entrepreneur/CEO, business CFO, management consultancy)',
              'GP management/investment team has direct fund investment experience. However, lack well-documented data regarding prior investment performance, track record and exits.',
              'GP management/investment team has direct investment experience in senior fund management position. Have a well-documented data regarding prior investment performance, track record and exits.',
              'Other'
            ].map((experience, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`team_experience_${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not_applicable" id={`na-${index}`} />
                          <Label htmlFor={`na-${index}`}>Not Applicable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="applies_to_1" id={`1-${index}`} />
                          <Label htmlFor={`1-${index}`}>Applies to 1 Principal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="applies_to_2_or_more" id={`2+-${index}`} />
                          <Label htmlFor={`2+-${index}`}>Applies to 2 or more principals</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormLabel className="text-sm font-normal ml-0">
                      {experience}
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gender Orientation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gender Orientation</CardTitle>
          <CardDescription>Do any of the following apply to your fund?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="gender_orientation"
            render={() => (
              <FormItem>
                <div className="space-y-4">
                  {[
                    'Women ownership/participation interest is ≥ 50%',
                    'Women representation on the board/investment committee is ≥ 50%',
                    'Female staffing is ≥ 50%',
                    'Provide specific reporting on gender related indicators for your investors/funders',
                    'Require specific reporting on gender related indicators by your investees/borrowers',
                    'Other'
                  ].map((item, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name="gender_orientation"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={index}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Team Experience - Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Experience - Transactions</CardTitle>
          <CardDescription>Please specify cumulative number of investment/financing transactions completed by your principal(s) prior to this current fund/vehicle?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Investments</h4>
              <FormField
                control={form.control}
                name="prior_investments"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        {['0', '1 - 4', '5 - 9', '10 - 14', '15 - 24', '≥ 25'].map((range) => (
                          <div key={range} className="flex items-center space-x-2">
                            <RadioGroupItem value={range} id={`inv-${range}`} />
                            <Label htmlFor={`inv-${range}`}>{range}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="font-medium mb-3">Exits / Monetizations</h4>
              <FormField
                control={form.control}
                name="prior_exits"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        {['0', '1 - 4', '5 - 9', '10 - 14', '15 - 24', '≥ 25'].map((range) => (
                          <div key={range} className="flex items-center space-x-2">
                            <RadioGroupItem value={range} id={`exit-${range}`} />
                            <Label htmlFor={`exit-${range}`}>{range}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 