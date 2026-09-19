import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const tableNames = {
  System: 'systems',
  SiteSetting: 'site_settings',
  DownloadHistory: 'download_history',
  PurchaseRequest: 'purchase_requests',
  DownloadCode: 'download_codes',
  ContactMessage: 'contact_messages',
};

const throwIfError = ({ error }) => {
  if (error) throw error;
};

const entity = (name) => {
  const table = tableNames[name];
  return {
    async list(sort = '-created_date', limit = 100) {
      const descending = sort.startsWith('-');
      const column = sort.replace(/^-/, '') || 'created_at';
      const normalizedColumn = column === 'created_date' ? 'created_at' : column;
      const result = await supabase.from(table).select('*').order(normalizedColumn, { ascending: !descending }).limit(limit);
      throwIfError(result);
      return result.data || [];
    },
    async filter(filters) {
      let query = supabase.from(table).select('*');
      Object.entries(filters).forEach(([key, value]) => { query = query.eq(key, value); });
      const result = await query;
      throwIfError(result);
      return result.data || [];
    },
    async get(id) {
      const result = await supabase.from(table).select('*').eq('id', id).single();
      throwIfError(result);
      return result.data;
    },
    async create(values) {
      const result = await supabase.from(table).insert(values).select().single();
      throwIfError(result);
      return result.data;
    },
    async update(id, values) {
      const result = await supabase.from(table).update(values).eq('id', id).select().single();
      throwIfError(result);
      return result.data;
    },
    async delete(id) {
      const result = await supabase.from(table).delete().eq('id', id);
      throwIfError(result);
    },
  };
};

const safeName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '_');
const uniquePath = (file) => `${crypto.randomUUID()}-${safeName(file.name)}`;

async function uploadPublicFile(file) {
  const path = uniquePath(file);
  const result = await supabase.storage.from('public-assets').upload(path, file, { upsert: false });
  throwIfError(result);
  return { file_url: supabase.storage.from('public-assets').getPublicUrl(path).data.publicUrl };
}

async function uploadPrivateFile(file) {
  const path = uniquePath(file);
  const result = await supabase.storage.from('system-files').upload(path, file, { upsert: false });
  throwIfError(result);
  return { file_uri: path };
}

async function currentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw error || new Error('Not authenticated');
  const profile = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile.error) throw profile.error;
  return { ...user, role: profile.data?.role || 'user' };
}

export const api = {
  entities: Object.fromEntries(Object.keys(tableNames).map((name) => [name, entity(name)])),
  auth: {
    me: currentUser,
    async isAuthenticated() {
      const { data: { session } } = await supabase.auth.getSession();
      return Boolean(session);
    },
    async loginViaEmailPassword(email, password) {
      const result = await supabase.auth.signInWithPassword({ email, password });
      throwIfError(result);
      return result.data;
    },
    async register({ email, password }) {
      const result = await supabase.auth.signUp({ email, password });
      throwIfError(result);
      return result.data;
    },
    async verifyOtp({ email, otpCode }) {
      const result = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' });
      throwIfError(result);
      return result.data.session;
    },
    async resendOtp(email) {
      const result = await supabase.auth.resend({ type: 'signup', email });
      throwIfError(result);
    },
    async loginWithProvider(provider, returnTo = '/') {
      const redirectTo = new URL(returnTo, window.location.origin).toString();
      const result = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      throwIfError(result);
    },
    async resetPasswordRequest(email) {
      const redirectTo = new URL('/reset-password', window.location.origin).toString();
      const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      throwIfError(result);
    },
    async resetPassword({ newPassword }) {
      const result = await supabase.auth.updateUser({ password: newPassword });
      throwIfError(result);
    },
    async logout() {
      const result = await supabase.auth.signOut();
      throwIfError(result);
    },
  },
  functions: {
    async invoke(name, body) {
      const result = await supabase.functions.invoke(name, { body });
      throwIfError(result);
      return { data: result.data };
    },
  },
  storage: {
    uploadPublicFile,
    uploadPrivateFile,
  },
};
