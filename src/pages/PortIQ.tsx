import React, { useState, useEffect, useRef } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Brain, Shield, BarChart3, Zap, TrendingUp, Database, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PortIQ = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('company_name, profile_picture, first_name, last_name')
            .eq('user_id', user.id)
            .single();
          
          if (data && !error) {
            console.log('User profile data:', data);
            console.log('Company name:', data.company_name);
            console.log('Profile picture:', data.profile_picture);
            console.log('First name:', data.first_name);
            setUserProfile(data);
          } else {
            console.error('Error fetching user profile:', error);
            console.log('No profile data found for user:', user.id);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // SEO: dynamic title and description
  useEffect(() => {
    document.title = 'PortIQ – AI Assistant for CFF Network';
    const desc = 'Ask PortIQ about fund data and surveys. Role-aware access with professional insights.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: userMessage }
      });

      if (error) throw error;

      const resText = (data as any)?.reply ?? (data as any)?.response;
      if (resText) {
        setMessages(prev => [...prev, { role: 'assistant', content: resText }]);
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Minimal UI: no quick prompts grid, no marketing features

  return (
    <div className="h-screen overflow-hidden">
      <SidebarLayout>
        <div className="h-screen bg-cover bg-center bg-fixed overflow-hidden" style={{ backgroundImage: 'url(/auth.jpg)' }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 h-full flex items-center justify-center p-6 pt-20">
            <div className="w-full max-w-5xl h-[calc(100vh-8rem)] flex flex-col">

            {/* Chat Area with warm design - Fixed height like WhatsApp */}
            <Card className="shadow-2xl border-2 border-blue-100 bg-white/90 backdrop-blur-sm h-full flex flex-col relative">
              {/* Fixed Header - like WhatsApp */}
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0 relative z-20 py-3 px-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="w-4 h-4 text-purple-600" />
                      Chat with PortIQ
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Ask about surveys, applications, blogs, network profiles, your engagement, and more
                    </CardDescription>
                  </div>
                  {/* Features - smaller, to the right */}
                  <div className="flex gap-2 ml-4">
                    <div className="text-center">
                      <Brain className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
                      <p className="text-xs font-medium text-blue-900">Multi-Table</p>
                      <p className="text-xs text-blue-700">Access</p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-3 h-3 text-purple-600 mx-auto mb-0.5" />
                      <p className="text-xs font-medium text-purple-900">Role-Based</p>
                      <p className="text-xs text-purple-700">Security</p>
                    </div>
                    <div className="text-center">
                      <BarChart3 className="w-3 h-3 text-pink-600 mx-auto mb-0.5" />
                      <p className="text-xs font-medium text-pink-900">Smart</p>
                      <p className="text-xs text-pink-700">Insights</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages Area - scrollable behind header */}
              <div className="flex-1 overflow-y-auto scrollbar-hide relative min-h-0">
                <div className="p-6 space-y-4 pb-20">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="w-10 h-10 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to PortIQ!</h3>
                        <p className="text-gray-600">
                          Start a conversation by typing a question or selecting a quick prompt above.
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[80%]`}>
                          {/* Avatar */}
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            {message.role === 'user' ? (
                              <>
                                <AvatarImage src={userProfile?.profile_picture} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                  {userProfile?.company_name 
                                    ? userProfile.company_name.charAt(0).toUpperCase() 
                                    : userProfile?.first_name 
                                    ? userProfile.first_name.charAt(0).toUpperCase() 
                                    : user?.email?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </>
                            ) : (
                              <>
                                <AvatarImage src="/robot.png" />
                                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                  <Brain className="w-4 h-4" />
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          
                          {/* Message content */}
                          <div className="flex flex-col">
                            {/* Name */}
                            <div className={`text-xs font-medium mb-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                              {message.role === 'user' 
                                ? (userProfile?.company_name || userProfile?.first_name || user?.email?.split('@')[0] || 'You')
                                : 'PortIQ'
                              }
                            </div>
                            
                            {/* Message bubble */}
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                  : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 shadow-lg border border-blue-200/50 backdrop-blur-sm'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-start gap-3">
                        {/* PortIQ Avatar */}
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src="/robot.png" />
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <Brain className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Thinking message */}
                        <div className="flex flex-col">
                          <div className="text-xs font-medium mb-1 text-left">PortIQ</div>
                          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl px-4 py-3 shadow-lg border border-blue-200/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                              <span className="text-sm text-gray-600">PortIQ is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Truly Floating Input Area */}
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                <div className="relative bg-white rounded-2xl border border-gray-300 shadow-lg w-[600px] h-10 focus-within:border-blue-400 focus-within:shadow-xl">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about surveys, network data, your points, applications, trends, and more..."
                    rows={1}
                    className="resize-none !border-0 !focus:ring-0 !focus:border-0 !focus-visible:ring-0 !focus-visible:outline-none !ring-0 !ring-offset-0 bg-transparent pr-12 py-2 pl-4 h-full"
                    disabled={loading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-7 h-7 p-0 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default PortIQ;
