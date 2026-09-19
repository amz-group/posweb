import { createClient } from 'npm:@supabase/supabase-js@2.95.0';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { code = '' } = await req.json();
    const normalized = String(code).toUpperCase().trim();
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: dc } = await db.from('download_codes').select('*, systems(*)').eq('code', normalized).maybeSingle();
    const now = new Date();
    if (!dc || dc.status !== 'Active' || (dc.expiration_date && new Date(dc.expiration_date) < now) || (dc.max_downloads !== -1 && dc.current_downloads >= dc.max_downloads) || !dc.systems?.system_file_uri || dc.systems.status !== 'active') {
      return Response.json({ status: 'invalid', message: 'This code cannot be used.' }, { headers: corsHeaders });
    }
    const { data: signed, error } = await db.storage.from('system-files').createSignedUrl(dc.systems.system_file_uri, 300);
    if (error) throw error;
    const nextCount = dc.current_downloads + 1;
    await db.from('download_codes').update({ current_downloads: nextCount, status: dc.max_downloads !== -1 && nextCount >= dc.max_downloads ? 'Used' : dc.status }).eq('id', dc.id).eq('current_downloads', dc.current_downloads);
    await db.from('download_history').insert({ code: dc.code, system_id: dc.systems.id, system_name: dc.systems.name, customer_name: dc.customer_name, customer_phone: dc.customer_phone, download_date: now.toISOString().slice(0, 10), download_time: now.toISOString().slice(11, 19), download_status: 'success' });
    return Response.json({ status: 'valid', signed_url: signed.signedUrl, file_name: dc.systems.system_file_name || `${dc.systems.name}_${dc.systems.version || '1.0'}.zip` }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ status: 'error', message: error instanceof Error ? error.message : 'Download failed.' }, { status: 500, headers: corsHeaders });
  }
});
