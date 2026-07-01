-- ============================================================
-- Weather Condition Management System - PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- SETTINGS ----------
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(10) NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    temp_unit VARCHAR(10) NOT NULL DEFAULT 'celsius' CHECK (temp_unit IN ('celsius', 'fahrenheit')),
    wind_unit VARCHAR(10) NOT NULL DEFAULT 'kmh' CHECK (wind_unit IN ('kmh', 'mph', 'ms')),
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ---------- FAVORITES ----------
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_name VARCHAR(120) NOT NULL,
    country VARCHAR(80),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, latitude, longitude)
);

-- ---------- SEARCH HISTORY ----------
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_name VARCHAR(120) NOT NULL,
    country VARCHAR(80),
    temperature NUMERIC(5,2),
    condition VARCHAR(100),
    searched_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- WEATHER ALERTS ----------
CREATE TABLE IF NOT EXISTS weather_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_name VARCHAR(120) NOT NULL,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN
        ('storm', 'heavy_rain', 'heat', 'flood', 'snow', 'wind', 'thunderstorm')),
    severity VARCHAR(20) NOT NULL DEFAULT 'moderate' CHECK (severity IN ('minor','moderate','severe','extreme')),
    message TEXT NOT NULL,
    starts_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- NOTIFICATIONS ----------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'info' CHECK (type IN ('info','alert','extreme')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- INDEXES ----------
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_city ON weather_alerts(city_name);

-- ---------- SEED ----------
-- Create your own admin account through /api/auth/register, then run:
-- UPDATE users SET role = 'admin' WHERE email = 'you@example.com';