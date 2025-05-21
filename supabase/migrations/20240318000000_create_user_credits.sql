-- Create user_credits table
CREATE TABLE user_credits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can insert credits"
  ON user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only system can update credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 