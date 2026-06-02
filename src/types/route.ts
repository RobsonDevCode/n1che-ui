export type BudgetTier = '£' | '££' | '£££';
export type RouteDuration = 60 | 120 | 180; // minutes

export interface RouteFilters {
  budget?: BudgetTier;
  maxRouteTime?: RouteDuration;
  openNow?: boolean;
  mode?: 'you' | 'loop';
}

export interface RouteLeg {
  walkTime: string; // "5 min"
  walkDist: string; // "0.3 mi"
}

export interface RouteStop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  voteCount: number;
  isOpen: boolean;
  palIdx: number;
  leg?: RouteLeg; // undefined for the last stop
}

export interface RouteResponse {
  id: string;
  name: string;
  tag: string;        // e.g. "TOP RATED", "UNDER 1H", "LOOP"
  stops: RouteStop[];
  estimatedRouteTime: string; // "1h 35m"
  totalDistanceStr: string;   // "1.4 mi"
  totalUpvotes: number;
  mode: 'you' | 'loop';
}
