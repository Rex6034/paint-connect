-- Create contact_messages table to store messages from the contact form
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false
);

-- Create index on created_at for efficient sorting
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at 
ON public.contact_messages(created_at DESC);

-- Create index on read status for filtering unread messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_read 
ON public.contact_messages(read);

-- Enable RLS (Row Level Security)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can send messages)
CREATE POLICY IF NOT EXISTS "Allow public insert messages"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated admins to view/update messages
CREATE POLICY IF NOT EXISTS "Allow admins to view messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Allow admins to update messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete messages
CREATE POLICY IF NOT EXISTS "Allow admins to delete messages"
ON public.contact_messages FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
