export const NAV_ZOOM             = 17.5;
export const NAV_PITCH            = 60;
export const NAV_FOLLOW_OFFSET_M  = 140;  // metres ahead to project camera centre, pushing user into lower third
export const HEADING_SMOOTH_ALPHA = 0.2;
export const BEARING_MIN_DIST_M   = 3;    // ignore bearing from consecutive fixes closer than this

export const MANEUVER_ICON: Record<string, string> = {
  TURN_LEFT:         '↰',
  TURN_RIGHT:        '↱',
  TURN_SLIGHT_LEFT:  '↰',
  TURN_SLIGHT_RIGHT: '↱',
  TURN_SHARP_LEFT:   '↰',
  TURN_SHARP_RIGHT:  '↱',
  UTURN_LEFT:        '↩',
  UTURN_RIGHT:       '↪',
  STRAIGHT:          '↑',
  RAMP_LEFT:         '↰',
  RAMP_RIGHT:        '↱',
  MERGE:             '↑',
  ROUNDABOUT_LEFT:   '↺',
  ROUNDABOUT_RIGHT:  '↻',
  ARRIVE:            '⬤',
  DEPART:            '↑',
};
