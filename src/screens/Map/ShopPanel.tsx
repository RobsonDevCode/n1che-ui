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
import Title from '../../components/common/Title';
import Subtitle from '../../components/common/Subtitle';
import ReviewCard from '../../components/common/ReviewCard';
import { Review } from '../../types/review';

// TODO: replace with GET /shops/:id/reviews from the API
const MOCK_REVIEWS: Review[] = [
  { id: '1', shopId: '*', user: 'lucywears',   date: 'Mar 2026', text: 'Absolute gem. Found a perfect leather jacket for £35 — staff know their archive inside out.' },
  { id: '2', shopId: '*', user: 'thriftfiend', date: 'Feb 2026', text: 'Great selection, can get crowded on weekends. Worth the trip for the prices alone.' },
  { id: '3', shopId: '*', user: 'voidwalker',  date: 'Jan 2026', text: 'Asked about the provenance of a jacket and got a full history. This is what niche shopping is about.' },
];

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
    <View style={styles.panelShadow}>
    <View style={styles.panel}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Subtitle color={colors.grey}>← ALL SHOPS</Subtitle>
        </TouchableOpacity>
        <OpenBadge isOpen={shop.isOpen} closingTime={shop.closingTime} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.polPalette[shop.palIdx % colors.polPalette.length] }]}>
          {shop.photoUrl
            ? <Image source={{ uri: shop.photoUrl }} style={styles.heroImage} resizeMode="cover" />
            : <Title size={72} color="rgba(255,255,255,0.18)">{shop.name.charAt(0).toUpperCase()}</Title>
          }
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.heroGradient} pointerEvents="none" />
          <View style={styles.heroInfo}>
            <Title size={28} color={colors.white} style={styles.shopName}>{shop.name.toUpperCase()}</Title>
            <Text style={styles.shopAddr}>{shop.address} · {shop.distanceMi}</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statCell}>
            <Title size={18} color={colors.ink}>↑{shop.voteCount}</Title>
            <Subtitle size={7} color={colors.grey}>UPVOTES</Subtitle>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Title size={18} color={colors.ink} style={styles.statValueTruncate} numberOfLines={1}>@{shop.addedBy}</Title>
            <Subtitle size={7} color={colors.grey}>ADDED BY</Subtitle>
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
            <Title size={16} color={colors.ink}>COMMUNITY REVIEWS</Title>
            <Subtitle color={colors.grey} style={styles.reviewsCount}>({allReviews.length})</Subtitle>
          </View>

          {allReviews.map(r => (
            <ReviewCard key={r.id} review={r} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  panelShadow: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.paper,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    flexShrink: 0,
  },
  backBtn: { padding: 2 },
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
  shopName: { lineHeight: 30 },
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
  statValueTruncate: { maxWidth: '100%' },

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
  reviewsCount: { letterSpacing: 1 },
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
