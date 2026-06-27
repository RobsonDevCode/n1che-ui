import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { PlaceResult } from '../../services/maps/googlePlaces';
import Panel from '../../components/common/Panel';
import Title from '../../components/common/Title';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';

interface Props {
  place: PlaceResult;
  description: string;
  onChangeDescription: (text: string) => void;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export default function AddShopPanel({
  place, description, onChangeDescription,
  submitting, onSubmit, onBack,
}: Props) {
  return (
    <Panel variant="paper">
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Title size={24} color={colors.ink}>{place.name.toUpperCase()}</Title>
            <Text style={styles.address}>{place.address}</Text>
          </View>
          <Button variant="icon" onPress={onBack} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>←</Text>
          </Button>
        </View>

        <View style={styles.form}>
          <FormField
            label="Why is this place niche?"
            placeholder="Tell us what makes it special…"
            value={description}
            onChangeText={onChangeDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            inputStyle={styles.descInput}
          />
          <Button
            variant="primary"
            label="Submit Shop"
            disabled={!description.trim()}
            loading={submitting}
            onPress={onSubmit}
          />
        </View>
      </ScrollView>
    </Panel>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  info: { flex: 1, gap: 4, marginRight: 12 },
  address: {
    fontFamily: fonts.special,
    fontSize: 12,
    color: colors.grey,
  },
  closeBtn: { padding: 4 },
  closeBtnText: {
    fontFamily: fonts.oswald,
    fontSize: 20,
    color: colors.ink,
    lineHeight: 22,
  },
  form: { padding: 16, gap: 8 },
  descInput: { minHeight: 80, textAlignVertical: 'top' },
});
