import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';

export const VehicleConstructSection = () => {
  const form = useFormContext();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle's Legal Construct</h2>
        <p className="text-gray-600">Tell us about your fund's legal structure and domicile</p>
      </div>

      {/* Legal Domicile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legal Domicile</CardTitle>
          <CardDescription>Where is your legal domicile?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="legal_domicile"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {[
                      'Location Pending. Dependent upon Anchor Investor preference',
                      'Mauritius', 'Netherlands', 'Dutch Antilles', 'Luxembourg',
                      'Ireland', 'Delaware', 'Cayman Island', 'Kenya', 'Senegal',
                      'Nigeria', 'South Africa', 'Ghana', 'Other'
                    ].map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <RadioGroupItem value={location} id={location} />
                        <Label htmlFor={location}>{location}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Currency Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Currency Management</CardTitle>
          <CardDescription>What currency do you make investments? What currency is your fund LP vehicle?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currency_for_investments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Currency for Investments</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="local_currency">Local Currency</SelectItem>
                      <SelectItem value="foreign_currency">Foreign Currency</SelectItem>
                      <SelectItem value="multiple_currencies">Multiple Currencies</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency_for_lp_commitments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Currency for LP Commitments</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="local_currency">Local Currency</SelectItem>
                      <SelectItem value="foreign_currency">Foreign Currency</SelectItem>
                      <SelectItem value="multiple_currencies">Multiple Currencies</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fund Vehicle Type and Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fund Vehicle Type and Status</CardTitle>
          <CardDescription>What is the type (closed vs. open ended) and current status of your fund vehicle's operations?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="fund_vehicle_status"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    {[
                      'Closed ended - fundraising',
                      'Closed ended - completed first close',
                      'Closed ended - completed second close',
                      'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)',
                      'Open ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics',
                      'Second fund/vehicle',
                      'Third or later fund/vehicle',
                      'Other'
                    ].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <RadioGroupItem value={status} id={status} />
                        <Label htmlFor={status}>{status}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Fund Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fund Size</CardTitle>
          <CardDescription>What are the current hard commitments raised, current amount invested/outstanding portfolio and target size of your fund vehicle? (USD Equivalent)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="current_funds_raised"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Current Funds Raised</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<1m">{"< $1 million"}</SelectItem>
                      <SelectItem value="1-4m">$1 - 4 million</SelectItem>
                      <SelectItem value="5-9m">$5 - 9 million</SelectItem>
                      <SelectItem value="10-19m">$10 - 19 million</SelectItem>
                      <SelectItem value="20-29m">$20 - 29 million</SelectItem>
                      <SelectItem value="30m+">$30 million or more</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_amount_invested"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Current Amount Invested by Fund</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<1m">{"< $1 million"}</SelectItem>
                      <SelectItem value="1-4m">$1 - 4 million</SelectItem>
                      <SelectItem value="5-9m">$5 - 9 million</SelectItem>
                      <SelectItem value="10-19m">$10 - 19 million</SelectItem>
                      <SelectItem value="20-29m">$20 - 29 million</SelectItem>
                      <SelectItem value="30m+">$30 million or more</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_fund_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Target Fund Size</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<1m">{"< $1 million"}</SelectItem>
                      <SelectItem value="1-4m">$1 - 4 million</SelectItem>
                      <SelectItem value="5-9m">$5 - 9 million</SelectItem>
                      <SelectItem value="10-19m">$10 - 19 million</SelectItem>
                      <SelectItem value="20-29m">$20 - 29 million</SelectItem>
                      <SelectItem value="30m+">$30 million or more</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Target Number of Investments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Target Number of Investments</CardTitle>
          <CardDescription>What is target number of investments / borrowers for your fund?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="target_investments"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {[
                      '< 10 Enterprises',
                      '11 - 20 Enterprises',
                      '21 - 30 Enterprises',
                      '> 30 Enterprises'
                    ].map((range) => (
                      <div key={range} className="flex items-center space-x-2">
                        <RadioGroupItem value={range} id={range} />
                        <Label htmlFor={range}>{range}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Follow-on Investment Permission */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Follow-on Investment Permission</CardTitle>
          <CardDescription>Does your LP agreement/governance permit "follow-on" investments?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="follow_on_investment_permission"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {[
                      'Not Permitted',
                      '< 25% of Fund',
                      '26% - 50% of Fund',
                      '> 50% of Fund'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Target IRR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Target IRR</CardTitle>
          <CardDescription>What is the target IRR for non-concessionary investors when investing in your capital vehicle (USD equivalent)?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="target_irr"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {[
                      'N/A - 100% of our capital is concessionary',
                      '≤ 5%', '6 – 9%', '10 – 14%', '15 – 19%', '≥ 20%', 'Other'
                    ].map((range) => (
                      <div key={range} className="flex items-center space-x-2">
                        <RadioGroupItem value={range} id={range} />
                        <Label htmlFor={range}>{range}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Concessionary Capital */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Concessionary Capital</CardTitle>
          <CardDescription>Has your fund/vehicle received concessionary capital for any of the following needs?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="concessionary_capital"
            render={() => (
              <FormItem>
                <div className="space-y-4">
                  {[
                    'No Concessionary Capital',
                    'Finance pre-launch set up costs (e.g. legal, GP team salaries, advisors, accountants, etc.)',
                    'Finance the fund\'s ongoing operating costs (post 1st Close)',
                    'Provide First Loss or Risk Mitigation for LPs',
                    'Finance business development costs associated with portfolio enterprises',
                    'Other'
                  ].map((item, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name="concessionary_capital"
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

      {/* Sources of LP Capital */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sources of LP Capital</CardTitle>
          <CardDescription>Please rank by percentage how much each of these categories represent within the existing and your intended make-up of your LP capital providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              'Local High net worth / Angel Networks / Family offices',
              'Domestic institutional capital (e.g. pension funds, asset mgt. firms, etc.)',
              'Local government agencies',
              'International Fund of Fund Vehicles',
              'International institutional capital (e.g. pension funds, asset mgt. firms, etc.)',
              'Development finance institutions (DFIs)',
              'International impact investors',
              'Donors / Bilateral Agencies / Foundations',
              'Other'
            ].map((source, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <Label className="text-sm font-medium">{source}</Label>
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name={`lp_capital_existing_${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="%"
                            className="w-20"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-sm text-gray-500">%</span>
                  <FormField
                    control={form.control}
                    name={`lp_capital_target_${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="%"
                            className="w-20"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GP Financial Commitment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">GP Financial Commitment</CardTitle>
          <CardDescription>In determining the capital contribution by the fund management team into the vehicle, what is the form of GP financial commitment?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="gp_financial_commitment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    {[
                      '"Sweat" equity of contributed work by GP management team to develop and launch fund',
                      'Cash investment by GP management team',
                      'Both',
                      'None of the above'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* GP Management Fee */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">GP Management Fee</CardTitle>
          <CardDescription>What is the GP Management Fee?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="gp_management_fee"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    {[
                      'Not Applicable',
                      '< 2% GP Management Fee',
                      '2% GP Management Fee',
                      '> 2% GP Management Fee',
                      'Sliding Scale based on Size of AUM (please describe in Other)',
                      'Other'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Carried Interest Hurdle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carried Interest Hurdle</CardTitle>
          <CardDescription>Does your carried interest have a hurdle target?</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="carried_interest_hurdle"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    {[
                      'N/A - No Carried Interest',
                      'Hurdle Target: IRR Returns > 5% (USD Equivalent)',
                      'Hurdle Target: IRR Returns > 8% (USD Equivalent)',
                      'Hurdle Target: IRR Returns > 10% (USD Equivalent)',
                      'Other'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Fundraising Constraints */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fundraising Constraints</CardTitle>
          <CardDescription>In raising funds for your vehicle, what are the factors that you perceive as the most consequential barriers/constraints in raising funds from potential investors?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              'Geography/ Country Targeted for Investing',
              'Size of Fund',
              'Lack of Alignment on Sectors/ Investment Thesis',
              'Perceived lack of sufficient prior fund management experience',
              'Target Investment Returns',
              'Perceived risk associated with underlying investment portfolio',
              'Fund Economics',
              'Currency',
              'Domicile of Vehicle',
              'Back-office systems/ Capabilities',
              'Governance / Risk Management Systems and Capabilities',
              'Other'
            ].map((constraint, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                <Label className="text-sm font-medium md:col-span-2">{constraint}</Label>
                <div className="flex space-x-2 md:col-span-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <FormField
                      key={rating}
                      control={form.control}
                      name={`fundraising_constraint_${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex space-x-1"
                            >
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value={rating.toString()} id={`${constraint}-${rating}`} />
                                <Label htmlFor={`${constraint}-${rating}`} className="text-xs">
                                  {rating === 1 ? 'Least' : rating === 5 ? 'Most' : rating}
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 