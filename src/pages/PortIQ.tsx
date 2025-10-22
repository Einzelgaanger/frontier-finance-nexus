import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Brain, Zap, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PortIQ = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const quickPrompts = [
    { icon: TrendingUp, text: "What sectors are targeted in 2024 surveys?", color: "from-blue-500 to-cyan-500" },
    { icon: Brain, text: "Show me my points and engagement streak", color: "from-purple-500 to-pink-500" },
    { icon: Zap, text: "Compare fund sizes between 2023 and 2024", color: "from-orange-500 to-red-500" },
  ];

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                PortIQ
              </h1>
              <p className="text-lg text-gray-600 mt-2">Your Intelligent Network Assistant</p>
              <p className="text-sm text-gray-500">AI-powered insights across surveys, engagement, applications, and network data</p>
            </div>
          </div>

          {/* Quick Prompts */}
          {messages.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickPrompts.map((prompt, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                  onClick={() => setInput(prompt.text)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${prompt.color} rounded-lg flex items-center justify-center shadow-md`}>
                        <prompt.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{prompt.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Chat Area */}
          <Card className="shadow-2xl border-2 border-blue-100 bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Chat with PortIQ
              </CardTitle>
              <CardDescription>
                Ask about surveys, applications, blogs, network profiles, your engagement, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
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
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 shadow-md border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">PortIQ is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about surveys, network data, your points, applications, trends, and more..."
                  rows={3}
                  className="resize-none border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white shadow-sm"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-[52px] px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Helper Text */}
              <p className="text-xs text-gray-500 mt-3 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Multi-Table Access</h3>
                <p className="text-xs text-blue-700 mt-1">Surveys, apps, blogs, profiles, credits</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Role-Based Security</h3>
                <p className="text-xs text-purple-700 mt-1">See only what you're permitted</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <h3 className="font-semibold text-pink-900">Smart Insights</h3>
                <p className="text-xs text-pink-700 mt-1">Trends, comparisons, recommendations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PortIQ;
