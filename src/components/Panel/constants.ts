import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { PanelVariant } from './types';

export const VARIANT_BG: Record<PanelVariant, string> = {
  paper: colors.paper,
  ink: colors.ink,
};

export const VARIANT_SHADOW_OPACITY: Record<PanelVariant, number> = {
  paper: 0.12,
  ink: 0.3,
};

export const styles = StyleSheet.create({
  shadow: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 20,
    elevation: 20,
  },
  inner: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
});
