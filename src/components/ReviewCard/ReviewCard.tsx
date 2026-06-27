import { Text, View } from 'react-native';
import { ReviewCardProps } from './types';
import { styles } from './constants';

export default function ReviewCard({ review }: ReviewCardProps) {
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
