-- Create payment_requests table
CREATE TABLE payment_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id VARCHAR NOT NULL UNIQUE,
  product_id VARCHAR NOT NULL,
  amount INTEGER NOT NULL,
  payment_method VARCHAR NOT NULL,
  payment_key VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment requests"
  ON payment_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can insert payment requests"
  ON payment_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only system can update payment requests"
  ON payment_requests FOR UPDATE
  USING (auth.uid() = user_id); 