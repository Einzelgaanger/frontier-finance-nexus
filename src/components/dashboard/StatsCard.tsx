
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatsCard = ({ title, value, description, icon: Icon, trend, color = 'bg-blue-500' }: StatsCardProps) => {
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; iconBg: string; iconText: string } } = {
      'bg-blue-500': {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600'
      },
      'bg-orange-500': {
        bg: 'bg-orange-500',
        text: 'text-orange-600',
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600'
      },
      'bg-green-500': {
        bg: 'bg-green-500',
        text: 'text-green-600',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600'
      },
      'bg-purple-500': {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600'
      }
    };
    return colorMap[color] || colorMap['bg-blue-500'];
  };

  const colors = getColorClasses(color);

  return (
    <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.bg}`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 ${colors.iconBg} rounded-lg`}>
          <Icon className={`h-4 w-4 ${colors.iconText}`} />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        
        {description && (
          <p className="text-xs text-gray-600 mb-2">{description}</p>
        )}
        
        {trend && (
          <div className="flex items-center text-xs">
            <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
