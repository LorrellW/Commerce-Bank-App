// \app\context\getUserTravelContext.tsx
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface TravelContext {
    // derived
    homeAirport: string;          // computed from city / country
    // raw DB
    monthlyTravelSpend: number;   // ← new
    monthlyTotalSpend: number;    // ← new
    ptoHoursRemaining: number;
    preferences: {
      favClimate: string;
      adventureLevel: number;
    };
    miles: number;
    points: number;
    visited: string[];            // you’ll collect this separately
  }
  

export async function getTravelContext(userId: string): Promise<TravelContext> {
  const profile = await pool.travel_profile.findUnique({ where: { user_id: userId } });
  const history = await Pool.past_trip.findMany({ where: { user_id: userId } });
  return {
    homeAirport: profile.home_airport,
    monthlyBudget: Number(profile.monthly_budget),
    ptoHoursRemaining: profile.pto_hours_remaining,
    preferences: {
      favClimate: profile.fav_climate,
      adventureLevel: profile.adventure_level,
    },
    miles: profile.airline_miles,
    points: profile.hotel_points,
    visited: history.map(h => h.country),
  };
}

