import { createClient } from 'npm:@supabase/supabase-js@2.95.0';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { code = '' } = await req.json();
    const normalized = String(code).toUpperCase().trim();
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: dc } = await db.from('download_codes').select('*, systems(id,name,logo,version,file_size,platform,status,system_file_uri)').eq('code', normalized).maybeSingle();
    if (!dc) return Response.json({ status: 'invalid', message: 'Invalid download code.' }, { headers: corsHeaders });
    if (dc.status === 'Disabled') return Response.json({ status: 'disabled', message: 'This download code has been disabled.' }, { headers: corsHeaders });
    if (dc.expiration_date && new Date(dc.expiration_date) < new Date()) {
      await db.from('download_codes').update({ status: 'Expired' }).eq('id', dc.id);
      return Response.json({ status: 'expired', message: 'This download code has expired.' }, { headers: corsHeaders });
    }
    if (dc.max_downloads !== -1 && dc.current_downloads >= dc.max_downloads) return Response.json({ status: 'limit', message: 'The download limit for this code has been reached.' }, { headers: corsHeaders });
    if (!dc.systems || dc.systems.status !== 'active' || !dc.systems.system_file_uri) return Response.json({ status: 'invalid', message: 'System unavailable.' }, { headers: corsHeaders });
    return Response.json({ status: 'valid', system: dc.systems, remaining: dc.max_downloads === -1 ? 'Unlimited' : dc.max_downloads - dc.current_downloads }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ status: 'error', message: error instanceof Error ? error.message : 'Verification failed.' }, { status: 500, headers: corsHeaders });
  }
});
