import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { getSupabaseClient } from './supabase';

dotenv.config();

async function migrate() {
  try {
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Supabase migration instructions:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-schema.sql');
    console.log('4. Run the SQL script');
    console.log('');
    console.log('Schema file location:', schemaPath);
    console.log('');
    console.log('Alternatively, you can use the Supabase CLI:');
    console.log('  supabase db push');
    console.log('');

    // Try to validate Supabase connection
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      console.log('✅ Supabase connection validated');
    } catch (error) {
      console.warn('⚠️  Could not validate Supabase connection. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    }
  } catch (error) {
    console.error('❌ Migration setup failed:', error);
    process.exit(1);
  }
}

migrate();

