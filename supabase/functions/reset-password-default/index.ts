// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESET_DEFAULT_TOKEN = Deno.env.get("RESET_DEFAULT_TOKEN")!;

const DEFAULT_PASSWORD = "@ESCPNetwork2025#";

interface ResetPayload {
  email?: string;
  all?: boolean;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const token = req.headers.get("x-reset-token") || new URL(req.url).searchParams.get("token");
    if (!token || token !== RESET_DEFAULT_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { email, all }: ResetPayload = await req.json().catch(() => ({}));

    if (!all && !email) {
      return new Response(JSON.stringify({ error: "Provide 'email' or set 'all': true" }), { status: 400 });
    }

    const results: any = { updated: 0, errors: [] as string[] };

    // Helper to update by user id
    const updateById = async (userId: string) => {
      const { error } = await supabase.auth.admin.updateUserById(userId, { password: DEFAULT_PASSWORD });
      if (error) throw new Error(error.message);
    };

    if (all) {
      // Iterate all users and reset passwords
      let page = 1;
      const perPage = 200;
      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
        if (error) throw new Error(error.message);
        const users = data?.users || [];
        if (!users.length) break;
        for (const u of users) {
          try {
            if (!u.email) continue;
            await updateById(u.id);
            results.updated++;
          } catch (e) {
            results.errors.push(`Failed for ${u.email}: ${(e as Error).message}`);
          }
        }
        if (users.length < perPage) break;
        page++;
      }
    } else if (email) {
      if (!isValidEmail(email)) {
        return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
      }
      // Find user by paging through list
      let page = 1; const perPage = 200; let found = false;
      while (!found) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
        if (error) throw new Error(error.message);
        const users = data?.users || [];
        if (!users.length) break;
        for (const u of users) {
          if (u.email?.toLowerCase() === email.toLowerCase()) {
            await updateById(u.id);
            results.updated++;
            found = true;
            break;
          }
        }
        if (users.length < perPage) break;
        page++;
      }
      if (!found) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }
    }

    return new Response(JSON.stringify({ ok: true, ...results }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
