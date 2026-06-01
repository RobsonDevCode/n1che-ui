import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Review } from '../../types/review';

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.meta}>
        <Text style={styles.user}>@{review.user}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <Text style={styles.body}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
    gap: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  user: {
    fontFamily: fonts.bebas,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.ink,
    flex: 1,
  },
  date: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.grey,
  },
  body: {
    fontFamily: fonts.special,
    fontSize: 12,
    color: colors.ink2,
    lineHeight: 18,
  },
});
