
// This Edge Function is deployed automatically when you run the SQL migration
// It creates a public profile when a new user signs up

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = 'https://ijsydzfmyqbyaahsstoe.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  const { record } = await req.json()

  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', record.id)
      .single()

    if (!existingProfile) {
      // Create a new profile
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: record.id,
            email: record.email,
          }
        ])

      if (error) {
        console.error('Error creating profile:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error in handle-new-user function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
