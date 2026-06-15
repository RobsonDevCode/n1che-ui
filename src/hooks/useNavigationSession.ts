import { useCallback, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { distanceMiles } from '../utils/geo';
import { NavProgress, NavSessionOptions, NavState } from '../types/navigation';
import { RouteResponse, RouteStep } from '../types/route';

const METERS_PER_MILE = 1609.34;

const TURN_ANNOUNCE_METERS = 100;
const STOP_ARRIVED_METERS  = 30;
const OFF_ROUTE_METERS     = 80;
const REROUTE_DEBOUNCE_MS  = 30_000;

function metersTo(
  fromLat: number, fromLng: number,
  toLat: number,   toLng: number,
): number {
  return distanceMiles(fromLat, fromLng, toLat, toLng) * METERS_PER_MILE;
}

const IDLE_PROGRESS: NavProgress = {
  state: NavState.Idle,
  currentStopIndex: 0,
  currentInstruction: '',
  currentManeuver: '',
  nextInstruction: '',
  nextManeuver: '',
  currentHeading: -1,
  distanceToNextTurnMeters: Infinity,
  distanceToNextStopMeters: Infinity,
};

export function useNavigationSession({ onReroute, onPositionUpdate, muted }: NavSessionOptions) {
  const [progress, setProgress] = useState<NavProgress>(IDLE_PROGRESS);

  const routeRef        = useRef<RouteResponse | null>(null);
  const stopIndexRef    = useRef(0);
  const stepIndexRef    = useRef(0);
  const announcedSteps  = useRef<Set<string>>(new Set());
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const lastRerouteRef  = useRef<number>(0);
  const stateRef        = useRef<NavState>(NavState.Idle);

  const onRerouteRef        = useRef(onReroute);
  const onPositionUpdateRef = useRef(onPositionUpdate);
  const mutedRef            = useRef(muted ?? false);
  onRerouteRef.current        = onReroute;
  onPositionUpdateRef.current = onPositionUpdate;
  mutedRef.current            = muted ?? false;

  const speak = (text: string) => {
    if (!mutedRef.current) Speech.speak(text);
  };

  const setState = useCallback((s: NavState) => {
    stateRef.current = s;
    setProgress(p => ({ ...p, state: s }));
  }, []);

  const handlePosition = useCallback((position: Location.LocationObject) => {
    const route = routeRef.current;
    if (!route || stateRef.current === NavState.Idle || stateRef.current === NavState.Completed) return;

    const { latitude, longitude, heading } = position.coords;
    const resolvedHeading = heading ?? -1;

    onPositionUpdateRef.current({ latitude, longitude, heading: resolvedHeading });

    const stopIdx = stopIndexRef.current;
    const stop    = route.stops[stopIdx];
    if (!stop) return;

    const distToStop = metersTo(latitude, longitude, stop.latitude, stop.longitude);
    if (distToStop <= STOP_ARRIVED_METERS) {
      const nextIdx = stopIdx + 1;
      if (nextIdx >= route.stops.length) {
        speak('You have arrived at your final destination.');
        setState(NavState.Completed);
        subscriptionRef.current?.remove();
        subscriptionRef.current = null;
        setProgress(p => ({ ...p, currentStopIndex: nextIdx, distanceToNextStopMeters: 0 }));
        return;
      }
      speak(`Arrived at ${stop.name}. Heading to stop ${nextIdx + 1}.`);
      stopIndexRef.current = nextIdx;
      stepIndexRef.current = 0;
      announcedSteps.current.clear();
      setProgress(p => ({ ...p, currentStopIndex: nextIdx }));
      return;
    }

    const leg = stop.leg;
    if (leg && leg.polyline.length > 0 && stateRef.current === NavState.Navigating) {
      const distToRoute = Math.min(
        ...leg.polyline.map(p => metersTo(latitude, longitude, p.latitude, p.longitude)),
      );
      const now = Date.now();
      if (distToRoute > OFF_ROUTE_METERS && now - lastRerouteRef.current > REROUTE_DEBOUNCE_MS) {
        lastRerouteRef.current = now;
        setState(NavState.Rerouting);
        speak('Recalculating.');
        onRerouteRef.current({ latitude, longitude });
      }
    }

    if (stateRef.current !== NavState.Navigating) return;

    const steps: RouteStep[] = leg?.steps ?? [];
    let currentStep = steps[stepIndexRef.current];
    let distToTurn  = Infinity;

    if (currentStep) {
      const stepEnd = currentStep.polyline[currentStep.polyline.length - 1];
      if (stepEnd) {
        distToTurn = metersTo(latitude, longitude, stepEnd.latitude, stepEnd.longitude);

        if (distToTurn < 10 && stepIndexRef.current < steps.length - 1) {
          stepIndexRef.current += 1;
          currentStep = steps[stepIndexRef.current];
          const newEnd = currentStep?.polyline[currentStep.polyline.length - 1];
          distToTurn = newEnd
            ? metersTo(latitude, longitude, newEnd.latitude, newEnd.longitude)
            : Infinity;
        }

        const stepKey = `${stopIdx}-${stepIndexRef.current}`;
        if (distToTurn <= TURN_ANNOUNCE_METERS && !announcedSteps.current.has(stepKey)) {
          announcedSteps.current.add(stepKey);
          if (currentStep.instruction) speak(currentStep.instruction);
        }
      }
    }

    const nextStep = steps[stepIndexRef.current + 1];

    setProgress({
      state: NavState.Navigating,
      currentStopIndex: stopIdx,
      currentInstruction: currentStep?.instruction ?? `Head to ${stop.name}`,
      currentManeuver:    currentStep?.maneuver    ?? 'STRAIGHT',
      nextInstruction:    nextStep?.instruction    ?? '',
      nextManeuver:       nextStep?.maneuver       ?? '',
      currentHeading:     resolvedHeading,
      distanceToNextTurnMeters: distToTurn,
      distanceToNextStopMeters: distToStop,
    });
  }, [setState]);

  const start = useCallback(async (route: RouteResponse) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    routeRef.current     = route;
    stopIndexRef.current = 0;
    stepIndexRef.current = 0;
    announcedSteps.current.clear();
    lastRerouteRef.current = 0;

    setState(NavState.Navigating);
    speak(`Starting route: ${route.name}.`);

    subscriptionRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5 },
      handlePosition,
    );
  }, [handlePosition, setState]);

  const stop = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    routeRef.current = null;
    Speech.stop();
    setProgress(IDLE_PROGRESS);
    stateRef.current = NavState.Idle;
  }, []);

  const updateRoute = useCallback((newRoute: RouteResponse) => {
    routeRef.current     = newRoute;
    stepIndexRef.current = 0;
    announcedSteps.current.clear();
    setState(NavState.Navigating);
  }, [setState]);

  return { progress, start, stop, updateRoute };
}