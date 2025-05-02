#!/usr/bin/env bash
set -e
: "${DATABASE_URL:?→  export DATABASE_URL first (e.g. postgres://postgres:pwd@localhost:5432/fortune400)}"

CSV="src/app/db/seed/airports.csv"   # absolute or relative path to the ready-made file

echo "Loading airports from: $CSV"
echo "Target database     : $DATABASE_URL"

# start fresh on every run
psql "$DATABASE_URL" -c 'TRUNCATE airport;'

# copy the five columns (no HEADER keyword because file already has none;
# add CSV HEADER if your file *does* include a header row)
psql "$DATABASE_URL" -c "\copy airport(iata,city,state,country,passengers) FROM '$CSV' CSV;"

rowcount=$(psql "$DATABASE_URL" -t -A -c 'SELECT COUNT(*) FROM airport;')
echo "✅  Seeded ${rowcount} airports"
