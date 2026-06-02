import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { RouteResponse } from '../../types/route';
import Panel from '../../components/common/Panel';
import Title from '../../components/common/Title';
import Subtitle from '../../components/common/Subtitle';
import RouteCard from '../../components/RouteCard/RouteCard';

interface Props {
  routes: RouteResponse[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBegin: () => void;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function RoutePickerPanel({ routes, loading, selectedId, onSelect, onBegin, onClose, onSearch }: Props) {
  const selectedRoute = routes.find(r => r.id === selectedId);

  return (
    <Panel variant="ink">
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Title size={16} color={colors.paper}>
            {selectedRoute ? `SELECTED ROUTE: ${selectedRoute.name}` : 'SELECT ROUTE'}
          </Title>
          <Subtitle size={9} color="rgba(240,237,230,0.6)" style={styles.nearYou}>NEAR YOU</Subtitle>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search routes…"
          placeholderTextColor="rgba(240,237,230,0.4)"
          onChangeText={onSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* Route list */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.paper} size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {routes.map((r, i) => (
            <RouteCard
              key={r.id}
              route={r}
              rank={i + 1}
              selected={r.id === selectedId}
              onPress={() => onSelect(r.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* BEGIN pill — only visible once a route is selected */}
      {selectedId && (
        <TouchableOpacity style={styles.beginPill} onPress={onBegin} activeOpacity={0.85}>
          <Text style={styles.beginText}>BEGIN</Text>
          <Text style={styles.beginArrow}>→</Text>
        </TouchableOpacity>
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 13,
    flexShrink: 0,
  },
  nearYou: {
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.25,
    borderColor: 'rgba(240,237,230,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.paper,
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(240,237,230,0.15)',
    flexShrink: 0,
  },
  searchIcon: {
    fontFamily: fonts.special,
    fontSize: 16,
    color: 'rgba(240,237,230,0.5)',
    lineHeight: 18,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.paper,
    padding: 0,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 14,
    paddingBottom: 80,
  },

  beginPill: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: colors.paper,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  beginText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  beginArrow: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.ink,
  },
});
