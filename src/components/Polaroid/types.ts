import { ShopDisplay } from '../../types/shopDisplay';

export type PolaroidSize = 'home' | 'map';

export interface PolaroidDimensions {
  w: number;
  photoH: number;
  frame: number;
  capH: number;
  initialSize: number;
  nameSize: number;
}

export interface PolaroidProps {
  shop: ShopDisplay;
  size: PolaroidSize;
  index: number;
  selected?: boolean;
  onImageLoad?: () => void;
}
