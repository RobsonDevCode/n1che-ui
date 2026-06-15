export type BudgetTier = '£' | '££' | '£££';
export type RouteDuration = 60 | 120 | 180;

export interface RouteFilters {
  budget?: BudgetTier;
  maxRouteTime?: RouteDuration;
  openNow?: boolean;
  mode?: 'you' | 'loop';
}

export interface RouteStep {
  distanceMeters: number;
  durationSeconds: number;
  polyline: { latitude: number; longitude: number }[];
  instruction: string;
  maneuver: string;
}

export interface RouteLeg {
  distanceMeters: number;
  durationSeconds: number;
  polyline: { latitude: number; longitude: number }[];
  steps: RouteStep[];
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
  leg?: RouteLeg;
}

export interface RouteResponse {
  id: string;
  name: string;
  tag: string;
  createdBy: string;
  userId: string;
  stops: RouteStop[];
  estimatedRouteTime: string;
  totalDistanceStr: string;
  totalUpvotes: number;
  totalMinutes: number;
  mode: 'you' | 'loop';
}
