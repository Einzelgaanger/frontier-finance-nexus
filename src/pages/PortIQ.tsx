import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
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
  const [conversationId, setConversationId] = useState<string | null>(null);
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

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!input.trim()) {
      resetTextareaHeight();
    }
  }, [input]);

  // Fetch user profile and load conversation history
  useEffect(() => {
    const initialize = async () => {
      if (user) {
        try {
          // Fetch profile
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('company_name, profile_picture_url, full_name')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setUserProfile(profileData);
          }

          // Get or create conversation
          const { data: conversations } = await supabase
            .from('chat_conversations' as any)
            .select('id')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1);

          let convId: string;
          if (conversations && (conversations as any).length > 0) {
            convId = (conversations as any)[0].id;
          } else {
            // Create new conversation
            const { data: newConv, error: createError } = await supabase
              .from('chat_conversations' as any)
              .insert({ user_id: user.id, title: 'PortIQ Chat' })
              .select('id')
              .single();
            
            if (createError) throw createError;
            convId = (newConv as any).id;
          }

          setConversationId(convId);

          // Load messages for this conversation
          const { data: messagesData } = await supabase
            .from('chat_messages' as any)
            .select('role, content, created_at')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

          if (messagesData && messagesData.length > 0) {
            setMessages(messagesData.map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content })));
          }
        } catch (error) {
          console.error('Error initializing:', error);
        }
      }
    };

    initialize();
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

  const resetTextareaHeight = () => {
    const textarea = document.querySelector('textarea[placeholder*="Ask about surveys"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = '36px'; // Reset to original height
    }
  };

  const truncateMessage = (message: string): string => {
    // Calculate max length based on 3/4 of screen width
    // Assuming average character width of ~8px, and 3/4 of screen width
    const screenWidth = window.innerWidth;
    const maxWidth = screenWidth * 0.75; // 3/4 of screen width
    const avgCharWidth = 8; // Approximate character width in pixels
    const maxLength = Math.floor(maxWidth / avgCharWidth);
    
    // Only truncate if message is much longer than max length (be very lenient)
    if (message.length <= maxLength * 1.5) return message;
    
    // Try to truncate at word boundary first
    const truncatedAtWord = message.substring(0, maxLength).lastIndexOf(' ');
    
    // Only truncate if we found a good word boundary (at least 30% of max length)
    if (truncatedAtWord > maxLength * 0.3) {
      return message.substring(0, truncatedAtWord) + '...';
    } else {
      // If no good word boundary, truncate at exact length with hyphen
      return message.substring(0, maxLength - 1) + '-';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !conversationId || !user) return;

    const originalMessage = input.trim();
    const userMessage = truncateMessage(originalMessage);
    setInput('');
    
    // Reset textarea height immediately
    resetTextareaHeight();
    
    // Optimistically add user message
    const userMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Save user message to DB
      await supabase.from('chat_messages' as any).insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'user',
        content: userMessage
      });

      // Send all messages for context
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw error;

      const resText = (data as any)?.reply ?? (data as any)?.response;
      if (resText) {
        const assistantMsg: Message = { role: 'assistant', content: resText };
        setMessages(prev => [...prev, assistantMsg]);
        
        // Stop loading immediately when we get the response
        setLoading(false);
        
        // Save assistant message to DB (async, don't wait)
        void supabase.from('chat_messages' as any).insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'assistant',
          content: resText
        });

        // Update conversation timestamp (async, don't wait)
        void supabase
          .from('chat_conversations' as any)
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setLoading(false); // Stop loading on error
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
      // Remove optimistic user message on error
      setMessages(prev => prev.slice(0, -1));
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
                        <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[80%] w-full`}>
                          {/* Avatar */}
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            {message.role === 'user' ? (
                              <>
                                <AvatarImage src={userProfile?.profile_picture_url} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                  {userProfile?.company_name 
                                    ? userProfile.company_name.charAt(0).toUpperCase() 
                                    : userProfile?.full_name 
                                    ? userProfile.full_name.charAt(0).toUpperCase() 
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
                                ? (userProfile?.company_name || userProfile?.full_name || user?.email?.split('@')[0] || 'You')
                                : 'PortIQ'
                              }
                            </div>
                            
                            {/* Message bubble */}
                            <div
                              className={`rounded-2xl px-4 py-3 break-words ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                  : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 shadow-lg border border-blue-200/50 backdrop-blur-sm'
                              }`}
                            >
                              {message.role === 'assistant' ? (
                                <div className="text-sm prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-gray-900 prose-strong:font-semibold">
                                  <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                              ) : (
                                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                              )}
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
                <div className="relative bg-white rounded-2xl border border-gray-300 shadow-lg w-[600px] min-h-[40px] max-h-[200px] focus-within:border-blue-400 focus-within:shadow-xl">
                  <Textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      // Auto-resize textarea
                      const textarea = e.target;
                      textarea.style.height = 'auto';
                      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about surveys, network data, your points, applications, trends, and more..."
                    rows={1}
                    className="resize-none !border-0 !focus:ring-0 !focus:border-0 !focus-visible:ring-0 !focus-visible:outline-none !ring-0 !ring-offset-0 bg-transparent pr-12 py-2 pl-4 min-h-[36px] max-h-[184px] overflow-y-auto scrollbar-hide"
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
