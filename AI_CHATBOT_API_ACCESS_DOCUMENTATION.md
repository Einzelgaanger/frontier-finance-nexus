# AI Chatbot with Role-Based API Access Control - Complete Implementation Guide

## Overview

This documentation provides a complete guide to building an AI-powered chatbot with flexible role-based access control using API endpoints. The system allows administrators to dynamically manage roles and grant/revoke API endpoint access per role through a user-friendly interface.

## System Architecture

### Core Components

1. **AI Chat Interface** - Frontend chat UI where users interact with the AI
2. **AI Edge Function** - Backend function that processes requests and calls AI models
3. **Role Management System** - Database tables for roles, permissions, and users
4. **API Access Control** - System to manage which roles can access which API endpoints
5. **Admin Dashboard** - Interface for managing roles, users, and API permissions

## Database Schema

### Tables Required

```sql
-- 1. Roles table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. API endpoints table
CREATE TABLE public.api_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  endpoint_url TEXT NOT NULL,
  method TEXT NOT NULL, -- GET, POST, etc.
  description TEXT,
  category TEXT, -- e.g., 'users', 'analytics', 'content'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User roles junction table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 4. Role API permissions junction table
CREATE TABLE public.role_api_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  api_endpoint_id UUID REFERENCES public.api_endpoints(id) ON DELETE CASCADE NOT NULL,
  has_access BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, api_endpoint_id)
);

-- 5. Conversations table (for chat history)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enable RLS

```sql
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_api_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
```

### Security Functions

```sql
-- Function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1
      AND r.name = 'admin'
  );
$$;

-- Function to get user's accessible API endpoints
CREATE OR REPLACE FUNCTION public.get_user_api_access(user_id UUID)
RETURNS TABLE (
  endpoint_id UUID,
  endpoint_name TEXT,
  endpoint_url TEXT,
  method TEXT,
  category TEXT
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT
    ae.id,
    ae.name,
    ae.endpoint_url,
    ae.method,
    ae.category
  FROM public.api_endpoints ae
  JOIN public.role_api_permissions rap ON ae.id = rap.api_endpoint_id
  JOIN public.user_roles ur ON rap.role_id = ur.role_id
  WHERE ur.user_id = $1
    AND rap.has_access = true;
$$;

-- Function to get user's roles
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS TABLE (
  role_id UUID,
  role_name TEXT,
  role_description TEXT
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id,
    r.name,
    r.description
  FROM public.roles r
  JOIN public.user_roles ur ON r.id = ur.role_id
  WHERE ur.user_id = $1;
$$;
```

### RLS Policies

```sql
-- Roles policies
CREATE POLICY "Admins can manage all roles"
  ON public.roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view all roles"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

-- API endpoints policies
CREATE POLICY "Admins can manage all API endpoints"
  ON public.api_endpoints FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view API endpoints they have access to"
  ON public.api_endpoints FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.role_api_permissions rap
      JOIN public.user_roles ur ON rap.role_id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND rap.api_endpoint_id = api_endpoints.id
        AND rap.has_access = true
    )
  );

-- User roles policies
CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Role API permissions policies
CREATE POLICY "Admins can manage role permissions"
  ON public.role_api_permissions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Conversations policies
CREATE POLICY "Users can manage their own conversations"
  ON public.conversations FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Chat messages policies
CREATE POLICY "Users can view messages from their conversations"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.conversations
      WHERE id = chat_messages.conversation_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.conversations
      WHERE id = chat_messages.conversation_id
        AND user_id = auth.uid()
    )
  );
```

## Backend Implementation

### Edge Function: AI Chat with API Access Control

Create `supabase/functions/ai-chat-api/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Parse request
    const { message, conversationId, history = [] } = await req.json();

    // 3. Get user's roles
    const { data: userRoles, error: rolesError } = await supabaseClient
      .rpc('get_user_roles', { user_id: user.id });

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch user roles' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Get accessible API endpoints
    const { data: accessibleEndpoints, error: endpointsError } = await supabaseClient
      .rpc('get_user_api_access', { user_id: user.id });

    if (endpointsError) {
      console.error('Error fetching accessible endpoints:', endpointsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch API access' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Fetch data from accessible API endpoints
    const dataContext: any = {
      user_info: {
        id: user.id,
        email: user.email,
        roles: userRoles?.map((r: any) => r.role_name) || []
      },
      accessible_endpoints: accessibleEndpoints?.map((e: any) => ({
        name: e.endpoint_name,
        category: e.category,
        method: e.method
      })) || [],
      data: {}
    };

    // Fetch data from each accessible endpoint
    for (const endpoint of accessibleEndpoints || []) {
      try {
        // Only fetch GET endpoints automatically
        if (endpoint.method === 'GET') {
          const response = await fetch(endpoint.endpoint_url, {
            method: 'GET',
            headers: {
              'Authorization': req.headers.get('Authorization') || '',
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            dataContext.data[endpoint.category] = dataContext.data[endpoint.category] || {};
            dataContext.data[endpoint.category][endpoint.endpoint_name] = data;
          }
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint.endpoint_name}:`, error);
      }
    }

    // 6. Build AI context
    const systemPrompt = `You are an intelligent AI assistant with access to specific data based on the user's role and permissions.

USER INFORMATION:
- Email: ${user.email}
- Roles: ${userRoles?.map((r: any) => r.role_name).join(', ') || 'None'}

ACCESSIBLE DATA:
You have access to the following API endpoints and their data:
${JSON.stringify(dataContext.accessible_endpoints, null, 2)}

CURRENT DATA CONTEXT:
${JSON.stringify(dataContext.data, null, 2)}

INSTRUCTIONS:
1. Answer questions based ONLY on the data you have access to
2. If asked about data you don't have access to, politely explain that you don't have permission to access that information
3. Be helpful, accurate, and conversational
4. When providing statistics or counts, use the EXACT numbers from the data
5. If data is empty or zero, say so accurately - never make up numbers
6. Format responses clearly with markdown when appropriate
7. If asked to perform actions (like creating, updating, deleting), explain that you can only provide information but cannot perform actions directly

Always maintain a professional and helpful tone.`;

    // 7. Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || 'I apologize, but I was unable to generate a response.';

    // 8. Save message to database
    if (conversationId) {
      await supabaseClient.from('chat_messages').insert([
        { conversation_id: conversationId, role: 'user', content: message },
        { conversation_id: conversationId, role: 'assistant', content: reply }
      ]);
    }

    // 9. Return response
    return new Response(JSON.stringify({ reply, dataContext }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-api function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Update `supabase/config.toml`

```toml
[functions.ai-chat-api]
verify_jwt = true
```

## Frontend Implementation

### 1. AI Chat Interface Component

Create `src/components/AIChat.tsx`:

```typescript
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize conversation
  useEffect(() => {
    if (user) {
      initializeConversation();
    }
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = async () => {
    try {
      // Get or create conversation
      const { data: existingConversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingConversations && existingConversations.length > 0) {
        setConversationId(existingConversations[0].id);
        
        // Load message history
        const { data: messageHistory } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('conversation_id', existingConversations[0].id)
          .order('created_at', { ascending: true });

        if (messageHistory) {
          setMessages(messageHistory as Message[]);
        }
      } else {
        // Create new conversation
        const { data: newConversation } = await supabase
          .from('conversations')
          .insert({ user_id: user?.id, title: 'New Conversation' })
          .select()
          .single();

        if (newConversation) {
          setConversationId(newConversation.id);
        }
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize chat',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message optimistically
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-api', {
        body: {
          message: userMessage,
          conversationId,
          history: messages
        }
      });

      if (error) throw error;

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response',
        variant: 'destructive',
      });
      // Remove the optimistic user message on error
      setMessages(prev => prev.slice(0, -1));
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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert">
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-6 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="min-h-[60px] resize-none"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Admin Dashboard - Role Management

Create `src/components/admin/RoleManagement.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch roles',
        variant: 'destructive',
      });
    } else {
      setRoles(data || []);
    }
  };

  const createRole = async () => {
    if (!newRole.name.trim()) {
      toast({
        title: 'Error',
        description: 'Role name is required',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('roles')
      .insert([newRole]);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create role',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Role created successfully' });
      setNewRole({ name: '', description: '' });
      setIsDialogOpen(false);
      fetchRoles();
    }
  };

  const deleteRole = async (roleId: string) => {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Role deleted successfully' });
      fetchRoles();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Role Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g., manager, analyst"
                />
              </div>
              <div>
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Describe the role's purpose..."
                />
              </div>
              <Button onClick={createRole} className="w-full">
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRole(role.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

### 3. Admin Dashboard - API Endpoint Management

Create `src/components/admin/APIEndpointManagement.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  endpoint_url: string;
  method: string;
  description: string;
  category: string;
}

export default function APIEndpointManagement() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    endpoint_url: '',
    method: 'GET',
    description: '',
    category: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    const { data, error } = await supabase
      .from('api_endpoints')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch API endpoints',
        variant: 'destructive',
      });
    } else {
      setEndpoints(data || []);
    }
  };

  const createEndpoint = async () => {
    if (!newEndpoint.name.trim() || !newEndpoint.endpoint_url.trim()) {
      toast({
        title: 'Error',
        description: 'Name and URL are required',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('api_endpoints')
      .insert([newEndpoint]);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create endpoint',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'API endpoint created successfully' });
      setNewEndpoint({ name: '', endpoint_url: '', method: 'GET', description: '', category: '' });
      setIsDialogOpen(false);
      fetchEndpoints();
    }
  };

  const deleteEndpoint = async (endpointId: string) => {
    const { error } = await supabase
      .from('api_endpoints')
      .delete()
      .eq('id', endpointId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete endpoint',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Endpoint deleted successfully' });
      fetchEndpoints();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Endpoint Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Endpoint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New API Endpoint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="endpoint-name">Endpoint Name</Label>
                <Input
                  id="endpoint-name"
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                  placeholder="e.g., Get Users"
                />
              </div>
              <div>
                <Label htmlFor="endpoint-url">Endpoint URL</Label>
                <Input
                  id="endpoint-url"
                  value={newEndpoint.endpoint_url}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, endpoint_url: e.target.value })}
                  placeholder="https://api.example.com/users"
                />
              </div>
              <div>
                <Label htmlFor="endpoint-method">Method</Label>
                <Select
                  value={newEndpoint.method}
                  onValueChange={(value) => setNewEndpoint({ ...newEndpoint, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="endpoint-category">Category</Label>
                <Input
                  id="endpoint-category"
                  value={newEndpoint.category}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, category: e.target.value })}
                  placeholder="e.g., users, analytics, content"
                />
              </div>
              <div>
                <Label htmlFor="endpoint-description">Description</Label>
                <Input
                  id="endpoint-description"
                  value={newEndpoint.description}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, description: e.target.value })}
                  placeholder="Brief description..."
                />
              </div>
              <Button onClick={createEndpoint} className="w-full">
                Create Endpoint
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {endpoints.map((endpoint) => (
              <TableRow key={endpoint.id}>
                <TableCell className="font-medium">{endpoint.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{endpoint.endpoint_url}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                    {endpoint.method}
                  </span>
                </TableCell>
                <TableCell>{endpoint.category}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEndpoint(endpoint.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

### 4. Admin Dashboard - Role Permissions Management

Create `src/components/admin/RolePermissionsManagement.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Role {
  id: string;
  name: string;
}

interface APIEndpoint {
  id: string;
  name: string;
  category: string;
  method: string;
}

interface Permission {
  role_id: string;
  api_endpoint_id: string;
  has_access: boolean;
}

export default function RolePermissionsManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissions, setPermissions] = useState<Map<string, boolean>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
    fetchEndpoints();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchPermissions(selectedRole);
    }
  }, [selectedRole]);

  const fetchRoles = async () => {
    const { data } = await supabase
      .from('roles')
      .select('id, name')
      .order('name');
    if (data) setRoles(data);
  };

  const fetchEndpoints = async () => {
    const { data } = await supabase
      .from('api_endpoints')
      .select('id, name, category, method')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    if (data) setEndpoints(data);
  };

  const fetchPermissions = async (roleId: string) => {
    const { data } = await supabase
      .from('role_api_permissions')
      .select('api_endpoint_id, has_access')
      .eq('role_id', roleId);

    const permMap = new Map<string, boolean>();
    data?.forEach(perm => {
      permMap.set(perm.api_endpoint_id, perm.has_access);
    });
    setPermissions(permMap);
  };

  const togglePermission = async (endpointId: string, currentAccess: boolean) => {
    const { error } = await supabase
      .from('role_api_permissions')
      .upsert({
        role_id: selectedRole,
        api_endpoint_id: endpointId,
        has_access: !currentAccess
      }, {
        onConflict: 'role_id,api_endpoint_id'
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update permission',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Permission updated' });
      fetchPermissions(selectedRole);
    }
  };

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const category = endpoint.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(endpoint);
    return acc;
  }, {} as Record<string, APIEndpoint[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role API Permissions</CardTitle>
        <div className="mt-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedRole ? (
          <div className="space-y-6">
            {Object.entries(groupedEndpoints).map(([category, categoryEndpoints]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint Name</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryEndpoints.map((endpoint) => {
                      const hasAccess = permissions.get(endpoint.id) || false;
                      return (
                        <TableRow key={endpoint.id}>
                          <TableCell>{endpoint.name}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                              {endpoint.method}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={hasAccess}
                              onCheckedChange={() => togglePermission(endpoint.id, hasAccess)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Select a role to manage its API permissions</p>
        )}
      </CardContent>
    </Card>
  );
}
```

### 5. Admin Dashboard - User Role Assignment

Create `src/components/admin/UserRoleAssignment.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, X } from 'lucide-react';

interface User {
  id: string;
  email: string;
  roles: { id: string; name: string }[];
}

interface Role {
  id: string;
  name: string;
}

export default function UserRoleAssignment() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    // Fetch all roles
    const { data: rolesData } = await supabase
      .from('roles')
      .select('id, name')
      .order('name');

    if (rolesData) setRoles(rolesData);

    // Fetch users with their roles
    const { data: usersData } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        roles (id, name)
      `);

    // Get user emails from auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();

    // Combine the data
    const usersMap = new Map<string, User>();
    
    authUsers?.users.forEach(authUser => {
      usersMap.set(authUser.id, {
        id: authUser.id,
        email: authUser.email || '',
        roles: []
      });
    });

    usersData?.forEach(ur => {
      const user = usersMap.get(ur.user_id);
      if (user && ur.roles) {
        user.roles.push(ur.roles as any);
      }
    });

    setUsers(Array.from(usersMap.values()));
  };

  const assignRole = async (userId: string) => {
    if (!selectedRole) {
      toast({
        title: 'Error',
        description: 'Please select a role',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role_id: selectedRole });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Role assigned successfully' });
      fetchUsersAndRoles();
    }
  };

  const removeRole = async (userId: string, roleId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove role',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Role removed successfully' });
      fetchUsersAndRoles();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role Assignment</CardTitle>
        <div className="flex gap-4 mt-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select role to assign" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {user.roles.map((role) => (
                      <Badge key={role.id} variant="secondary" className="flex items-center gap-1">
                        {role.name}
                        <button
                          onClick={() => removeRole(user.id, role.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {user.roles.length === 0 && (
                      <span className="text-sm text-muted-foreground">No roles assigned</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => assignRole(user.id)}
                    disabled={!selectedRole}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Selected Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

## Key Features Summary

### 1. **Flexible Role System**
- Dynamic role creation
- Multiple roles per user
- No hardcoded role hierarchy

### 2. **API Access Control**
- Granular permissions per role per endpoint
- Easy grant/revoke via UI
- Support for all HTTP methods

### 3. **AI Integration**
- Context-aware responses based on accessible data
- Automatic data fetching from permitted endpoints
- Clear messaging when access is denied

### 4. **Admin Interface**
- Complete role management
- API endpoint registration
- Permission assignment UI
- User-role assignment

### 5. **Security**
- Row-Level Security on all tables
- Security definer functions for safe role checks
- No client-side role manipulation
- Proper authentication flow

## Implementation Checklist

1. ✅ Create all database tables
2. ✅ Enable RLS and create policies
3. ✅ Create security definer functions
4. ✅ Implement AI chat edge function
5. ✅ Build chat interface component
6. ✅ Build admin role management
7. ✅ Build API endpoint management
8. ✅ Build permissions management
9. ✅ Build user-role assignment
10. ✅ Test with different roles and permissions

## Testing Strategy

1. **Create Test Roles**: Create at least 3 different roles (e.g., viewer, analyst, admin)
2. **Add API Endpoints**: Register your actual API endpoints
3. **Assign Permissions**: Give different access levels to each role
4. **Create Test Users**: Create users with different role combinations
5. **Test AI Chat**: Verify AI only shows data from accessible endpoints
6. **Test Admin Functions**: Ensure only admins can modify roles/permissions

## Best Practices

1. **Start Simple**: Begin with a few roles and endpoints, expand as needed
2. **Document APIs**: Keep API endpoint descriptions clear and detailed
3. **Monitor Usage**: Track which endpoints are most frequently accessed
4. **Regular Audits**: Periodically review role permissions for security
5. **User Feedback**: Gather feedback on AI responses for accuracy
6. **Error Handling**: Implement comprehensive error handling for API failures
7. **Rate Limiting**: Consider rate limiting AI requests per user/role
8. **Caching**: Cache API responses where appropriate to improve performance

## Troubleshooting

### AI Returns No Data
- Check if user has roles assigned
- Verify roles have API permissions granted
- Confirm API endpoints are returning data
- Check edge function logs for errors

### Permission Changes Not Reflecting
- Clear user session and re-login
- Verify RLS policies are enabled
- Check for conflicting permissions
- Review edge function caching logic

### Admin Cannot Manage Roles
- Verify user has 'admin' role in database
- Check `is_admin()` function returns true
- Review RLS policies on admin tables
- Ensure user is properly authenticated

---

**This documentation provides everything needed to build a flexible, role-based AI chatbot system with API access control. The other Lovable instance can follow this guide step-by-step to implement the same functionality.**
