import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { getBadge } from "@/utils/badgeSystem";

interface LeaderboardUser {
  user_id: string;
  total_points: number;
  profile: {
    full_name: string;
    company_name: string;
    profile_picture_url: string | null;
  } | null;
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data: credits, error } = await supabase
        .from("user_credits")
        .select(`
          user_id,
          total_points
        `)
        .order("total_points", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch profiles for these users
      const userIds = credits?.map(c => c.user_id) || [];
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, full_name, company_name, profile_picture_url")
        .in("id", userIds);

      const leaderboardData = (credits || []).map(credit => ({
        ...credit,
        profile: profiles?.find(p => p.id === credit.user_id) || null
      }));

      setLeaders(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-orange-600" />;
      default: return <Award className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaders.map((leader, index) => {
            const badge = getBadge(leader.total_points);
            return (
              <div
                key={leader.user_id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  index < 3 ? 'bg-muted/50' : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2 min-w-[40px]">
                  <span className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  {getRankIcon(index)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={leader.profile?.profile_picture_url || ""} />
                  <AvatarFallback>
                    {leader.profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {leader.profile?.full_name || "Unknown User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {leader.profile?.company_name || "No company"}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xl">{badge.icon}</span>
                    <Badge variant="secondary" className="text-xs">
                      {badge.name}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {leader.total_points} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
