import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Brain, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PortIQWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        try {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('company_name, profile_picture_url, full_name')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setUserProfile(profileData);
          }

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
            const { data: newConv, error: createError } = await supabase
              .from('chat_conversations' as any)
              .insert({ user_id: user.id, title: 'PortIQ Chat' })
              .select('id')
              .single();
            
            if (createError) throw createError;
            convId = (newConv as any).id;
          }

          setConversationId(convId);

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

  const sendMessage = async () => {
    if (!input.trim() || loading || !conversationId || !user) return;

    const userMessage = input.trim();
    setInput('');
    
    const userMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { error: userMsgError } = await supabase.from('chat_messages' as any).insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'user',
        content: userMessage
      });

      if (userMsgError) {
        console.error('Error saving user message:', userMsgError);
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw error;

      const resText = (data as any)?.reply ?? (data as any)?.response;
      if (resText) {
        const assistantMsg: Message = { role: 'assistant', content: resText };
        setMessages(prev => [...prev, assistantMsg]);
        
        const { error: assistantMsgError } = await supabase.from('chat_messages' as any).insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'assistant',
          content: resText
        });

        if (assistantMsgError) {
          console.error('Error saving assistant message:', assistantMsgError);
        }

        await supabase
          .from('chat_conversations' as any)
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
        
        setLoading(false);
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0 py-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="w-4 h-4 text-purple-600" />
              PortIQ AI Assistant
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Ask about surveys, network data, and more
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/portiq')}
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto text-blue-500 mb-3" />
              <p className="text-sm text-muted-foreground">
                Start chatting with PortIQ
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[85%]`}>
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    {message.role === 'user' ? (
                      <>
                        <AvatarImage src={userProfile?.profile_picture_url} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                          {userProfile?.company_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/robot.png" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <Brain className="w-3 h-3" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-3 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask PortIQ..."
            className="resize-none min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={loading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
