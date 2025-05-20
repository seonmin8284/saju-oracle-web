
// This file contains the logic for the auth webhook
// It should be deployed as an Edge Function in Supabase

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = 'https://ijsydzfmyqbyaahsstoe.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  const url = new URL(req.url)
  const event = url.searchParams.get('event')
  const { user } = await req.json()

  if (event === 'SIGNED_UP') {
    // Create a new profile for the user
    const { error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: user.id,
          email: user.email,
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
})
