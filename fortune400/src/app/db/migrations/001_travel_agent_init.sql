--\src\app\db\migrations\001_travel_agent_init.sql
/* ---------- 1. ENUM & transaction tweaks ---------- */

/* create enum only if it doesn’t exist yet */
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'txn_category') THEN
    CREATE TYPE txn_category AS ENUM (
      'salary','groceries','bills','travel','dining','shopping','other'
    );
  END IF;
END$$;

-- add category + merchant columns (idempotent)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS category txn_category          DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS merchant TEXT;

/* ---------- 2. travel_profile table ---------- */
CREATE TABLE IF NOT EXISTS travel_profile (
  cID           UUID PRIMARY KEY REFERENCES customer(cID),
  max_trip_days INTEGER        DEFAULT 7 CHECK (max_trip_days BETWEEN 1 AND 30),
  fav_climate   TEXT           DEFAULT 'temperate',
  adventure_lvl INTEGER        DEFAULT 3 CHECK (adventure_lvl BETWEEN 1 AND 5),
  airline_miles INTEGER        DEFAULT 0,
  hotel_points  INTEGER        DEFAULT 0,
  updated_at    TIMESTAMPTZ    DEFAULT now()
);

/* ---------- 3. past_trip history ---------- */
CREATE TABLE IF NOT EXISTS past_trip (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cID        UUID             REFERENCES customer(cID),
  country    TEXT,
  city       TEXT,
  start_date DATE,
  end_date   DATE
);

/* ---------- 4. airport lookup ---------- */
CREATE TABLE IF NOT EXISTS airport (
  iata       CHAR(3) PRIMARY KEY,
  city       TEXT,
  state      TEXT,
  country    TEXT,
  passengers BIGINT            -- optional but nice for “busiest” sort
);

/* ---------- 5. view for the AI layer ---------- */
CREATE OR REPLACE VIEW vw_travel_context AS
SELECT
  cu.cID                                 AS "userId",
  ad.city,
  ad.state,
  ad.country,
  tp.max_trip_days,
  tp.fav_climate,
  tp.adventure_lvl,
  tp.airline_miles,
  tp.hotel_points,
  COALESCE(sp.avg_monthly_travel, 0)     AS monthly_travel_spend,
  COALESCE(sp.avg_monthly_total, 0)      AS monthly_total_spend
FROM customer            cu
JOIN address             ad   ON ad.addressID = cu.addressID
LEFT JOIN travel_profile tp   ON tp.cID      = cu.cID
LEFT JOIN LATERAL (
    /* spend in the past 6 calendar months */
    SELECT
      AVG(CASE WHEN t.category = 'travel' THEN ABS(t.amount) END)
          FILTER (WHERE t.category = 'travel')                AS avg_monthly_travel,
      AVG(ABS(t.amount))                                      AS avg_monthly_total
    FROM account  acc
    JOIN transactions t ON t.accountID = acc.accountID
    WHERE acc.cID = cu.cID
      AND t.tDate >= date_trunc('month', now()) - INTERVAL '6 months'
) sp ON TRUE;
