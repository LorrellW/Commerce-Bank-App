--\src\app\db\migrations\001_travel_agent_init.sql


/* 0. ENUM & txn tweaks … unchanged */

/* 1. travel_profile */
CREATE TABLE IF NOT EXISTS travel_profile (
  "cID"         INTEGER PRIMARY KEY REFERENCES customer("cID"),
  max_trip_days INTEGER  DEFAULT 7 CHECK (max_trip_days BETWEEN 1 AND 30),
  fav_climate   TEXT     DEFAULT 'temperate',
  adventure_lvl INTEGER  DEFAULT 3 CHECK (adventure_lvl BETWEEN 1 AND 5),
  airline_miles INTEGER  DEFAULT 0,
  hotel_points  INTEGER  DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

/* 2. past_trip */
CREATE TABLE IF NOT EXISTS past_trip (
  id         SERIAL PRIMARY KEY,
  "cID"      INTEGER REFERENCES customer("cID"),
  country    TEXT,
  city       TEXT,
  start_date DATE,
  end_date   DATE
);

/* 3. airport … unchanged */

/* 4. view */
CREATE OR REPLACE VIEW vw_travel_context AS
SELECT
  cu."cID"                             AS userid,
  ad.city,
  ad.state,
  ad.country,
  tp.max_trip_days,
  tp.fav_climate,
  tp.adventure_lvl,
  tp.airline_miles,
  tp.hotel_points,
  COALESCE(sp.avg_monthly_travel,0)    AS monthly_travel_spend,
  COALESCE(sp.avg_monthly_total,0)     AS monthly_total_spend
FROM customer            cu
JOIN address             ad ON ad."addressID" = cu."addressID"
LEFT JOIN travel_profile tp ON tp."cID"       = cu."cID"
LEFT JOIN LATERAL (
    SELECT
      AVG(CASE WHEN t.category='travel' THEN ABS(t.amount) END)
          FILTER (WHERE t.category='travel')                 AS avg_monthly_travel,
      AVG(ABS(t.amount))                                     AS avg_monthly_total
    FROM   account  acc
    JOIN   transactions t ON t."accountID" = acc."accountID"
    WHERE  acc."cID" = cu."cID"
      AND  t."tDate" >= date_trunc('month', now()) - INTERVAL '6 months'
) sp ON TRUE;
