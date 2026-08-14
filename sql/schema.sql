CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text,
  name_en text NOT NULL,
  org_type text NOT NULL CHECK (org_type IN ('brand','rights_holder','creator','agency','community','media','other')),
  country_code char(2) NOT NULL DEFAULT 'SA',
  city text,
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected','suspended')),
  commercial_registration text,
  mawthooq_license text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  password_hash text,
  locale text NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar','en')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memberships (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('advertiser','owner','agency','admin','finance','reviewer')),
  PRIMARY KEY (organization_id,user_id)
);

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  category text NOT NULL CHECK (category IN ('events','creators','podcasts','sports','digital','ooh','community','gaming')),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text,
  description_en text,
  city text,
  country_code char(2) NOT NULL DEFAULT 'SA',
  starting_price numeric(14,2) NOT NULL CHECK (starting_price >= 0),
  currency char(3) NOT NULL DEFAULT 'SAR',
  estimated_reach bigint NOT NULL DEFAULT 0 CHECK (estimated_reach >= 0),
  audience_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  format_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','paused','archived')),
  featured boolean NOT NULL DEFAULT false,
  trust_score numeric(5,2) NOT NULL DEFAULT 55,
  availability_score numeric(5,2) NOT NULL DEFAULT 80,
  performance_score numeric(5,2) NOT NULL DEFAULT 70,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  price numeric(14,2) NOT NULL CHECK (price >= 0),
  currency char(3) NOT NULL DEFAULT 'SAR',
  quantity integer,
  entitlements jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  owner_user_id uuid REFERENCES users(id),
  title text NOT NULL,
  objective text NOT NULL,
  target_audience jsonb NOT NULL DEFAULT '{}'::jsonb,
  budget numeric(14,2) NOT NULL CHECK (budget > 0),
  currency char(3) NOT NULL DEFAULT 'SAR',
  starts_at timestamptz,
  ends_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  score numeric(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  explanation jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_id,opportunity_id)
);

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id),
  buyer_org_id uuid NOT NULL REFERENCES organizations(id),
  seller_org_id uuid NOT NULL REFERENCES organizations(id),
  stage text NOT NULL DEFAULT 'request' CHECK (stage IN ('request','negotiation','approval','contract','payment','delivery','completed')),
  agreed_amount numeric(14,2),
  currency char(3) NOT NULL DEFAULT 'SAR',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  version integer NOT NULL,
  amount numeric(14,2) NOT NULL,
  terms jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(deal_id,version)
);

CREATE TABLE IF NOT EXISTS deal_events (
  id bigserial PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES users(id),
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS measurement_events (
  id bigserial PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  metric text NOT NULL,
  value numeric(18,4) NOT NULL,
  source text,
  measured_at timestamptz NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS verification_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  check_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  source_reference text,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  checked_at timestamptz
);

CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_search ON opportunities(category,country_code,city,status,starting_price);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON opportunities(featured,status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_parties ON deals(buyer_org_id,seller_org_id,stage);
CREATE INDEX IF NOT EXISTS idx_measurement_deal ON measurement_events(deal_id,metric,measured_at);
CREATE INDEX IF NOT EXISTS idx_campaign_org ON campaigns(organization_id,status,created_at DESC);
