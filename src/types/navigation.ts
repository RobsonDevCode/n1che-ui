export enum NavState {
  Idle       = 'idle',
  Navigating = 'navigating',
  Rerouting  = 'rerouting',
  Completed  = 'completed',
}

export interface NavProgress {
  state: NavState;
  currentStopIndex: number;
  currentInstruction: string;
  currentManeuver: string;
  nextInstruction: string;
  nextManeuver: string;
  currentHeading: number;
  distanceToNextTurnMeters: number;
  distanceToNextStopMeters: number;
}

export interface NavPositionUpdate {
  latitude: number;
  longitude: number;
  heading: number;
}

export interface NavSessionOptions {
  onReroute: (coords: { latitude: number; longitude: number }) => void;
  onPositionUpdate: (pos: NavPositionUpdate) => void;
  muted?: boolean;
}
