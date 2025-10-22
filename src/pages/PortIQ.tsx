import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
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

  // Minimal UI: no quick prompts grid, no marketing features

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header (minimal) */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">PortIQ</h1>
            <p className="text-sm text-gray-600 mt-1">Ask questions about surveys and network data.</p>
          </div>

          {/* Chat Area (minimal) */}
          <Card className="shadow-sm border">
            <CardHeader className="border-b">
              <CardTitle className="text-base font-semibold text-gray-900">AI Assistant</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Type a question below and press Send.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {/* Messages */}
              <div className="space-y-3 mb-4 max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-500">No messages yet.</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.role === 'user'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-900 border'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="text-left text-sm text-gray-500">Thinking…</div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question..."
                  rows={3}
                  className="resize-none border focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="self-end"
                >
                  <Send className="w-4 h-4 mr-2" /> Send
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">Enter to send • Shift+Enter for new line</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PortIQ;
