import { RouteResponse } from '../../types/route';

export interface RouteCardProps {
  route: RouteResponse;
  rank: number;
  selected: boolean;
  onPress: () => void;
}
