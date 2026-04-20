-- ============================================================
--  Job Portal – Full Schema (PostgreSQL)
--  Run this as a superuser or a user with CREATE on public
-- ============================================================

-- ── Master tables ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS company_sizes (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(50)  NOT NULL,
  min_count  INTEGER,
  max_count  INTEGER,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS industries (
  industry_id        SERIAL PRIMARY KEY,
  industry_name      VARCHAR(100) NOT NULL,
  industry_code      VARCHAR(20)  UNIQUE,
  parent_industry_id INTEGER      REFERENCES industries(industry_id),
  is_active          BOOLEAN      DEFAULT TRUE,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id         SERIAL PRIMARY KEY,
  dept_name  VARCHAR(100) NOT NULL,
  dept_code  VARCHAR(20)  UNIQUE,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experience_levels (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(50)  NOT NULL,
  min_years  INTEGER,
  max_years  INTEGER,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_roles (
  id               SERIAL PRIMARY KEY,
  role_title       VARCHAR(100) NOT NULL,
  dept_id          INTEGER      REFERENCES departments(id),
  experience_level VARCHAR(50),
  is_active        BOOLEAN      DEFAULT TRUE,
  is_approved      BOOLEAN      DEFAULT FALSE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id          SERIAL PRIMARY KEY,
  skill_name  VARCHAR(100) NOT NULL UNIQUE,
  skill_type  VARCHAR(50),
  category    VARCHAR(100),
  is_active   BOOLEAN      DEFAULT TRUE,
  usage_count INTEGER      DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employment_types (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(50)  NOT NULL,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education_levels (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(100) NOT NULL,
  sort_order INTEGER      DEFAULT 0,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qualifications (
  id                 SERIAL PRIMARY KEY,
  label              VARCHAR(100) NOT NULL,
  education_level_id INTEGER      REFERENCES education_levels(id),
  is_active          BOOLEAN      DEFAULT TRUE,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS currencies (
  id         SERIAL PRIMARY KEY,
  code       VARCHAR(10)  NOT NULL UNIQUE,
  name       VARCHAR(50)  NOT NULL,
  symbol     VARCHAR(10),
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id         SERIAL PRIMARY KEY,
  city_name  VARCHAR(100) NOT NULL,
  state      VARCHAR(100),
  country    VARCHAR(100) DEFAULT 'India',
  is_remote  BOOLEAN      DEFAULT FALSE,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_modes (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(50)  NOT NULL,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notice_periods (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(50)  NOT NULL,
  days       INTEGER,
  is_active  BOOLEAN      DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Core auth tables ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  email                VARCHAR(150) NOT NULL UNIQUE,
  password             VARCHAR(255) NOT NULL,
  mobile               VARCHAR(20),
  role                 VARCHAR(50)  NOT NULL DEFAULT 'employer',
  status               VARCHAR(50)  NOT NULL DEFAULT 'pending_profile',
  email_verified       BOOLEAN      DEFAULT FALSE,
  email_verify_token   VARCHAR(255),
  email_verify_expires TIMESTAMPTZ,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64)  NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ  NOT NULL,
  is_revoked BOOLEAN      DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  module     VARCHAR(50)  NOT NULL,
  action     VARCHAR(50)  NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Employer tables ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS employers (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name        VARCHAR(200) NOT NULL,
  company_slug        VARCHAR(220) NOT NULL UNIQUE,
  company_email       VARCHAR(150) NOT NULL UNIQUE,
  company_phone       VARCHAR(20),
  industry_id         INTEGER      REFERENCES industries(industry_id),
  company_size_id     INTEGER      REFERENCES company_sizes(id),
  gst_number          VARCHAR(20),
  cin_number          VARCHAR(25),
  website_url         VARCHAR(255),
  logo_url            VARCHAR(255),
  description         TEXT,
  founded_year        INTEGER,
  headquarters_city   VARCHAR(100),
  company_address     TEXT,
  linkedin_url        VARCHAR(255),
  twitter_url         VARCHAR(255),
  glassdoor_url       VARCHAR(255),
  contact_name        VARCHAR(100),
  contact_designation VARCHAR(100),
  contact_phone       VARCHAR(20),
  verification_status VARCHAR(50)  DEFAULT 'PENDING',
  verification_note   TEXT,
  verified_by         INTEGER,
  verified_at         TIMESTAMPTZ,
  is_active           BOOLEAN      DEFAULT TRUE,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employer_roles (
  id          SERIAL PRIMARY KEY,
  employer_id INTEGER      NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  is_default  BOOLEAN      DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id            SERIAL PRIMARY KEY,
  role_id       INTEGER NOT NULL REFERENCES employer_roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id)    ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS employer_users (
  id                  SERIAL PRIMARY KEY,
  employer_id         INTEGER      NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  role_id             INTEGER      REFERENCES employer_roles(id),
  name                VARCHAR(100) NOT NULL,
  email               VARCHAR(150) NOT NULL UNIQUE,
  password            VARCHAR(255) NOT NULL,
  is_admin            BOOLEAN      DEFAULT FALSE,
  status              VARCHAR(50)  DEFAULT 'active',
  reset_token         VARCHAR(64),
  reset_token_expires TIMESTAMPTZ,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Job tables ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id                  SERIAL PRIMARY KEY,
  employer_id         INTEGER      NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title               VARCHAR(200) NOT NULL,
  slug                VARCHAR(250) NOT NULL UNIQUE,
  description         TEXT         NOT NULL,
  requirements        TEXT,
  department_id       INTEGER      REFERENCES departments(id),
  job_role_id         INTEGER      REFERENCES job_roles(id),
  employment_type_id  INTEGER      REFERENCES employment_types(id),
  experience_level_id INTEGER      REFERENCES experience_levels(id),
  min_experience      INTEGER,
  max_experience      INTEGER,
  education_level_id  INTEGER      REFERENCES education_levels(id),
  work_mode_id        INTEGER      REFERENCES work_modes(id),
  city_id             INTEGER      REFERENCES cities(id),
  salary_min          NUMERIC(12,2),
  salary_max          NUMERIC(12,2),
  currency_id         INTEGER      REFERENCES currencies(id),
  salary_disclosed    BOOLEAN      DEFAULT TRUE,
  notice_period_id    INTEGER      REFERENCES notice_periods(id),
  openings            INTEGER      DEFAULT 1,
  status              VARCHAR(50)  DEFAULT 'draft',
  expires_at          TIMESTAMPTZ,
  published_at        TIMESTAMPTZ,
  created_by          INTEGER      REFERENCES employer_users(id),
  views_count         INTEGER      DEFAULT 0,
  applications_count  INTEGER      DEFAULT 0,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_employer_id        ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status             ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_city_id            ON jobs(city_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type_id ON jobs(employment_type_id);

CREATE TABLE IF NOT EXISTS job_skills (
  id         SERIAL PRIMARY KEY,
  job_id     INTEGER NOT NULL REFERENCES jobs(id)   ON DELETE CASCADE,
  skill_id   INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (job_id, skill_id)
);

-- ── Seeker tables ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seeker_profiles (
  id                     SERIAL PRIMARY KEY,
  user_id                INTEGER      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  headline               VARCHAR(200),
  summary                TEXT,
  current_title          VARCHAR(150),
  total_experience_years NUMERIC(4,1),
  current_salary         NUMERIC(12,2),
  expected_salary        NUMERIC(12,2),
  currency_id            INTEGER      REFERENCES currencies(id),
  notice_period_id       INTEGER      REFERENCES notice_periods(id),
  city_id                INTEGER      REFERENCES cities(id),
  work_mode_id           INTEGER      REFERENCES work_modes(id),
  profile_photo_url      VARCHAR(255),
  resume_url             VARCHAR(255),
  linkedin_url           VARCHAR(255),
  github_url             VARCHAR(255),
  portfolio_url          VARCHAR(255),
  is_actively_looking    BOOLEAN      DEFAULT TRUE,
  profile_completion     INTEGER      DEFAULT 0,
  created_at             TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seeker_experiences (
  id                 SERIAL PRIMARY KEY,
  seeker_id          INTEGER      NOT NULL REFERENCES seeker_profiles(id) ON DELETE CASCADE,
  company_name       VARCHAR(200) NOT NULL,
  job_title          VARCHAR(150) NOT NULL,
  employment_type_id INTEGER      REFERENCES employment_types(id),
  city_id            INTEGER      REFERENCES cities(id),
  start_date         DATE         NOT NULL,
  end_date           DATE,
  is_current         BOOLEAN      DEFAULT FALSE,
  description        TEXT,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seeker_educations (
  id               SERIAL PRIMARY KEY,
  seeker_id        INTEGER      NOT NULL REFERENCES seeker_profiles(id) ON DELETE CASCADE,
  institution_name VARCHAR(200) NOT NULL,
  qualification_id INTEGER      REFERENCES qualifications(id),
  field_of_study   VARCHAR(150),
  start_year       INTEGER,
  end_year         INTEGER,
  is_current       BOOLEAN      DEFAULT FALSE,
  grade            VARCHAR(50),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seeker_skills (
  id          SERIAL PRIMARY KEY,
  seeker_id   INTEGER     NOT NULL REFERENCES seeker_profiles(id) ON DELETE CASCADE,
  skill_id    INTEGER     NOT NULL REFERENCES skills(id)          ON DELETE CASCADE,
  proficiency VARCHAR(50) DEFAULT 'intermediate',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (seeker_id, skill_id)
);

CREATE TABLE IF NOT EXISTS applications (
  id             SERIAL PRIMARY KEY,
  job_id         INTEGER NOT NULL REFERENCES jobs(id)  ON DELETE CASCADE,
  seeker_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status         VARCHAR(50) DEFAULT 'applied',
  cover_letter   TEXT,
  resume_url     VARCHAR(255),
  employer_notes TEXT,
  applied_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (job_id, seeker_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON applications(seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status    ON applications(status);

-- ── Search / saved ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_jobs (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id     INTEGER NOT NULL REFERENCES jobs(id)  ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS saved_searches (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(150) NOT NULL,
  filters    JSONB        NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

CREATE TABLE IF NOT EXISTS job_alerts (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(150) NOT NULL,
  filters      JSONB        NOT NULL,
  frequency    VARCHAR(20)  DEFAULT 'daily',
  is_active    BOOLEAN      DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_alerts_user_active ON job_alerts(user_id, is_active);

-- ── SequelizeMeta (required by sequelize-cli) ─────────────────

CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
  name VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (name)
);

-- Mark all migrations as done so sequelize-cli doesn't re-run them
INSERT INTO "SequelizeMeta" (name) VALUES
  ('20240001-create-users.js'),
  ('20240002-create-refresh-tokens.js'),
  ('20240003-create-masters.js'),
  ('20240004-create-permissions.js'),
  ('20240005-create-employer-tables.js'),
  ('20240006-create-jobs.js'),
  ('20240007-create-seeker-tables.js'),
  ('20240008-create-applications.js'),
  ('20240009-create-search-tables.js')
ON CONFLICT DO NOTHING;
