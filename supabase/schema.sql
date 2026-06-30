-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('employer', 'housekeeper')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  house_type TEXT,
  rooms INTEGER,
  living_room BOOLEAN,
  kitchen BOOLEAN,
  bathroom BOOLEAN,
  requirements JSONB,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed')) DEFAULT 'open',
  price NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  housekeeper_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')) DEFAULT 'pending',
  price NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- todo_list table
CREATE TABLE todo_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = auth.uid());

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Employers can manage their jobs" ON jobs FOR ALL USING (employer_id = auth.uid());

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (housekeeper_id = auth.uid() OR employer_id = auth.uid());

ALTER TABLE todo_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage job todos" ON todo_list FOR ALL USING (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE housekeeper_id = auth.uid() OR employer_id = auth.uid()));