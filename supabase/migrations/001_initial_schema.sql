-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  plan_id TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tools catalog
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit_free INTEGER DEFAULT 10,
  usage_limit_pro INTEGER DEFAULT 1000,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool usage tracking
CREATE TABLE IF NOT EXISTS public.tool_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  action TEXT,
  input_data JSONB,
  output_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites/bookmarks
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON public.tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_id ON public.tool_usage(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON public.tool_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON public.tools(slug);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for tools (public read)
CREATE POLICY "Anyone can view active tools"
  ON public.tools FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- RLS Policies for tool_usage
CREATE POLICY "Users can view own tool usage"
  ON public.tool_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tool usage"
  ON public.tool_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed initial tools data
INSERT INTO public.tools (slug, name, description, category, is_premium, usage_limit_free, usage_limit_pro) VALUES
  ('json-formatter', 'JSON Formatter & Validator', 'Format, validate, and beautify JSON data with syntax highlighting and error detection.', 'developer', false, 50, 1000),
  ('base64-encoder', 'Base64 Encoder/Decoder', 'Encode text to Base64 or decode Base64 strings back to plain text.', 'developer', false, 50, 1000),
  ('url-encoder', 'URL Encoder/Decoder', 'Encode special characters for URLs or decode URL-encoded strings.', 'developer', false, 50, 1000),
  ('hash-generator', 'Hash Generator', 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text input.', 'developer', false, 50, 1000),
  ('regex-tester', 'Regex Tester', 'Test and debug regular expressions with real-time matching and highlighting.', 'developer', false, 50, 1000),
  ('lorem-ipsum', 'Lorem Ipsum Generator', 'Generate placeholder text in paragraphs, sentences, or words for design mockups.', 'developer', false, 100, 1000),
  ('word-counter', 'Word Counter & Analyzer', 'Count words, characters, sentences, and analyze readability metrics.', 'academic', false, 100, 1000),
  ('citation-generator', 'Citation Generator', 'Generate citations in APA, MLA, Chicago, and Harvard formats.', 'academic', false, 20, 500),
  ('qr-code-generator', 'QR Code Generator', 'Create QR codes for URLs, text, WiFi, and contact information.', 'utilities', false, 30, 1000),
  ('image-compressor', 'Image Compressor', 'Compress images to reduce file size while maintaining quality.', 'ai-image', false, 10, 500)
ON CONFLICT (slug) DO NOTHING;
