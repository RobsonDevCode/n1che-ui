import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // TouchableOpacity kept for niche selection rows
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import { colors, fonts } from '../../theme';
import { RootNavigationProp } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { setNiche } from '../../store/slices/nicheSlice';
import InkHeader from '../../components/common/InkHeader';
import Tagline from '../../components/common/Tagline';
import HeaderTitle from '../../components/common/HeaderTitle';
import { NICHES } from './niches';

const NAME_FONTS  = [fonts.bebas, fonts.oswald, fonts.fellItalic] as const;
const NAME_SIZES  = [22, 18, 20] as const;

export default function NichePickerScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<string | null>(null);
  const selectedNiche = NICHES.find(n => n.id === selected);

  const handleContinue = () => {
    if (!selected) return;
    dispatch(setNiche(selected));
    navigation.navigate('Map');
  };

  return (
    <View style={styles.screen}>
      <InkHeader>
        <View style={styles.header}>
          <Button variant="ghost" label="← Back" onPress={() => navigation.goBack()} />
          <Text style={styles.step}>STEP 01 / 02</Text>
          <View style={styles.headerRow}>
            <HeaderTitle style={{ fontSize: 46, letterSpacing: 1.5, lineHeight: 50 }}>YOUR{'\n'}NICHE</HeaderTitle>
            <Tagline style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 120, textAlign: 'right' }}>
              pick what fits.{'\n'}add more later.
            </Tagline>
          </View>
        </View>
      </InkHeader>

      <View style={styles.separator} />

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {NICHES.map((niche, i) => {
          const isSel = selected === niche.id;
          return (
            <TouchableOpacity
              key={niche.id}
              style={[
                styles.row,
                { backgroundColor: isSel ? colors.ink : i % 2 === 0 ? colors.white : colors.paper2 },
                isSel && styles.rowSelected,
              ]}
              onPress={() => setSelected(niche.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.badge, isSel && styles.badgeSel]}>
                <Text style={[styles.badgeText, isSel && styles.badgeTextSel]}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
              </View>

              <View style={styles.rowContent}>
                <View style={styles.nameRow}>
                  <Text style={[
                    styles.nicheName,
                    {
                      fontFamily: NAME_FONTS[i % 3],
                      fontSize: NAME_SIZES[i % 3],
                      fontStyle: i % 3 === 2 ? 'italic' : 'normal',
                      fontWeight: i % 3 === 1 ? '700' : 'normal',
                    },
                    isSel && styles.textWhite,
                  ]}>
                    {niche.label}
                  </Text>
                  <Text style={[styles.nicheSub, isSel && styles.nicheSubSel]}>
                    ({niche.sub})
                  </Text>
                </View>
                <Text style={[styles.nicheDesc, isSel && styles.nicheDescSel]}>
                  {niche.desc}
                </Text>
              </View>

              <Text style={[styles.count, isSel && styles.countSel]}>
                {niche.count.toLocaleString()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Button
          variant="primary"
          disabled={!selected}
          label={selected ? `CONTINUE — ${selectedNiche?.label.toUpperCase()}` : 'SELECT A NICHE'}
          onPress={handleContinue}
          style={styles.continueBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  header: {
    flexShrink: 0,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 16,
  },
  separator: {
    height: 4,
    backgroundColor: colors.pop,
    flexShrink: 0,
  },
  step: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  rowSelected: {
    borderLeftColor: colors.pop,
  },

  badge: {
    width: 28,
    height: 28,
    flexShrink: 0,
    backgroundColor: colors.paper2,
    borderWidth: 2,
    borderColor: colors.grey2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSel: {
    backgroundColor: colors.pop,
    borderColor: colors.pop,
  },
  badgeText: {
    fontFamily: fonts.bebas,
    fontSize: 15,
    color: colors.grey,
  },
  badgeTextSel: {
    color: colors.white,
  },

  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexWrap: 'wrap',
  },
  nicheName: {
    color: colors.ink,
    lineHeight: 24,
  },
  nicheSub: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.grey,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  nicheSubSel: {
    color: 'rgba(255,255,255,0.5)',
  },
  nicheDesc: {
    fontFamily: fonts.special,
    fontSize: 11,
    color: colors.grey,
    marginTop: 3,
    lineHeight: 16,
  },
  nicheDescSel: {
    color: 'rgba(255,255,255,0.6)',
  },

  textWhite: {
    color: colors.white,
  },
  count: {
    fontFamily: fonts.oswald,
    fontWeight: '200',
    fontSize: 13,
    color: colors.grey2,
    flexShrink: 0,
  },
  countSel: {
    color: 'rgba(255,255,255,0.5)',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 3,
    borderTopColor: colors.ink,
  },
  continueBtn: {
    marginTop: 0,
    marginBottom: 0,
  },
});
