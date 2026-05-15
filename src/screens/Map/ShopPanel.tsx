import { useState } from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../store/hooks';
import { colors, fonts } from '../../theme';
import { MockShop } from './mockShops';
import { BookmarkIcon, DirectionsIcon } from '../../components/icons';
import OpenBadge from '../../components/common/OpenBadge';
import Button from '../../components/common/Button';

// TODO: replace with GET /shops/:id/reviews from the API
const MOCK_REVIEWS = [
  { id: '1', user: 'lucywears',   date: 'Mar 2026', text: 'Absolute gem. Found a perfect leather jacket for £35 — staff know their archive inside out.' },
  { id: '2', user: 'thriftfiend', date: 'Feb 2026', text: 'Great selection, can get crowded on weekends. Worth the trip for the prices alone.' },
  { id: '3', user: 'voidwalker',  date: 'Jan 2026', text: 'Asked about the provenance of a jacket and got a full history. This is what niche shopping is about.' },
];

interface Review {
  id: string;
  shopId: string;
  user: string;
  date: string;
  text: string;
}

interface Props {
  shop: MockShop;
  onBack: () => void;
  onDirections: (shop: MockShop) => void;
}

export default function ShopPanel({ shop, onBack, onDirections }: Props) {
  const insets = useSafeAreaInsets();
  const username = useAppSelector(s => s.auth.username) ?? 'anonymous';

  const [voted, setVoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');

  const allReviews = [...MOCK_REVIEWS, ...userReviews.filter(r => r.shopId === shop.id)];

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    // TODO: POST /shops/:id/reviews
    setUserReviews(prev => [...prev, {
      id: Date.now().toString(),
      shopId: shop.id,
      user: username,
      date: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      text: reviewText.trim(),
    }]);
    setReviewText('');
    setShowReviewForm(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={styles.backText}>← ALL SHOPS</Text>
        </TouchableOpacity>
        <OpenBadge isOpen={shop.isOpen} closingTime={shop.closingTime} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.polPalette[shop.palIdx % colors.polPalette.length] }]}>
          {shop.photoUrl
            ? <Image source={{ uri: shop.photoUrl }} style={styles.heroImage} resizeMode="cover" />
            : <Text style={styles.heroInitial}>{shop.name.charAt(0).toUpperCase()}</Text>
          }
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.heroGradient} pointerEvents="none" />
          <View style={styles.heroInfo}>
            <Text style={styles.shopName}>{shop.name.toUpperCase()}</Text>
            <Text style={styles.shopAddr}>{shop.address} · {shop.distanceMi}</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>↑{shop.voteCount}</Text>
            <Text style={styles.statLabel}>UPVOTES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue} numberOfLines={1}>@{shop.addedBy}</Text>
            <Text style={styles.statLabel}>ADDED BY</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            variant="action"
            active={voted}
            label={voted ? '✓ UPVOTED' : '↑ UPVOTE'}
            onPress={() => setVoted(v => !v)}
            style={{ flex: 1 }}
          />
          <Button variant="action" active={saved} onPress={() => setSaved(v => !v)} style={styles.iconBtn}>
            <BookmarkIcon filled={saved} color={saved ? 'white' : colors.ink} />
          </Button>
          <Button variant="action" onPress={() => onDirections(shop)} style={styles.iconBtn}>
            <DirectionsIcon />
          </Button>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>COMMUNITY REVIEWS</Text>
            <Text style={styles.reviewsCount}>({allReviews.length})</Text>
          </View>

          {allReviews.map(r => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewUser}>@{r.user}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewBody}>{r.text}</Text>
            </View>
          ))}

          {showReviewForm ? (
            <View style={styles.reviewForm}>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience…"
                placeholderTextColor={colors.grey}
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.reviewFormActions}>
                <Button variant="outline" label="Cancel" onPress={() => { setShowReviewForm(false); setReviewText(''); }} style={{ flex: 1 }} />
                <Button variant="primary" label="Submit" disabled={!reviewText.trim()} onPress={handleSubmitReview} style={{ flex: 1, marginTop: 0, marginBottom: 0 }} />
              </View>
            </View>
          ) : (
            <Button variant="outline" label="+ Write a Review" onPress={() => setShowReviewForm(true)} style={styles.writeReviewBtn} />
          )}
        </View>

        <View style={{ height: Math.max(insets.bottom, 16) }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderTopWidth: 3,
    borderTopColor: colors.ink,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    flexShrink: 0,
  },
  backBtn: { padding: 2 },
  backText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.grey,
  },
  scroll: { flex: 1 },

  hero: {
    height: 140,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  heroInitial: {
    fontFamily: fonts.bebas,
    fontSize: 72,
    color: 'rgba(255,255,255,0.18)',
  },
  heroGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  heroInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  shopName: {
    fontFamily: fonts.bebas,
    fontSize: 28,
    color: colors.white,
    letterSpacing: 1,
    lineHeight: 30,
  },
  shopAddr: {
    fontFamily: fonts.special,
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 2,
  },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: colors.paper2,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  statCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 2,
    backgroundColor: colors.ink,
  },
  statValue: {
    fontFamily: fonts.bebas,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontFamily: fonts.mono,
    fontSize: 7,
    letterSpacing: 1.5,
    color: colors.grey,
  },

  actions: {
    flexDirection: 'row',
    gap: 6,
    padding: 14,
    backgroundColor: colors.paper,
  },
  iconBtn: { paddingHorizontal: 16 },

  reviewsSection: {
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    backgroundColor: colors.paper,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
  },
  reviewsTitle: {
    fontFamily: fonts.bebas,
    fontSize: 16,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  reviewsCount: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.grey,
  },
  reviewCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
    gap: 6,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewUser: {
    fontFamily: fonts.bebas,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.ink,
    flex: 1,
  },
  reviewDate: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.grey,
  },
  reviewBody: {
    fontFamily: fonts.special,
    fontSize: 12,
    color: colors.ink2,
    lineHeight: 18,
  },
  writeReviewBtn: { margin: 14 },
  reviewForm: {
    padding: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grey2,
  },
  reviewInput: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.ink,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
    padding: 10,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  reviewFormActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
