import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { a1Words, b1Words, learningWords, wordById } from './src/data/catalog';
import { dueWords, recordKnown, searchWords, type Word } from './src/lib/study';
import { useLibrary } from './src/hooks/useLibrary';
import { usePronunciation } from './src/hooks/usePronunciation';
import { colors as C, Icon, IconButton, Level } from './src/components/ui';
import { WordDetail } from './src/components/WordDetail';

const preparedLevelCounts: Record<string, number> = { A1: a1Words.length, B1: b1Words.length };

function AppContent() {
  const [tab, setTab] = useState<'dictionary' | 'saved'>('dictionary');
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('A1');
  const [detail, setDetail] = useState<Word | null>(null);
  const [review, setReview] = useState(false);
  const library = useLibrary();
  const pronunciation = usePronunciation();
  const savedWords = useMemo(() => library.saved.map(id => wordById.get(id)).filter((word): word is Word => !!word), [library.saved]);
  const reviews = dueWords(savedWords, library.saved, library.progress).filter(word => word.definition);
  const results = useMemo(() => searchWords(tab === 'dictionary' ? learningWords : savedWords, query, level), [tab, query, level, savedWords]);
  const openWord = (word: Word, forReview = false) => { pronunciation.stopSpeech(); setReview(forReview); setDetail(word); };
  const closeWord = () => { setDetail(null); pronunciation.stopSpeech(); };
  const markKnown = () => {
    if (!detail || !library.ready) return;
    library.setProgress(progress => recordKnown(progress, detail.id));
    const next = reviews.find(word => word.id !== detail.id);
    if (next) openWord(next, true); else closeWord();
  };
  const changeTab = (next: 'dictionary' | 'saved') => { setTab(next); setQuery(''); setLevel(next === 'dictionary' ? 'A1' : 'All'); };
  const renderWord = ({ item }: { item: Word }) => <View style={s.wordRow}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Xem từ ${item.term}`} onPress={() => openWord(item)}
      style={({ pressed }) => [s.wordButton, pressed && { opacity: 0.55 }]}>
      <View style={s.wordHeading}><Text style={s.word}>{item.term}</Text><Level label={item.level} /></View>
      <Text style={s.definition} numberOfLines={2}>{item.definition ?? 'Chưa có nghĩa Việt'}</Text>
      <Text style={s.wordHint}>{item.forms?.length ? 'Dạng ngữ pháp' : item.wordFamily && Object.values(item.wordFamily).flat().some(member => member.term !== item.term) ? 'Word family' : 'Chi tiết'}{item.comparisons?.length ? '  ·  Sắc thái' : ''}</Text>
    </Pressable>
    <IconButton icon={library.saved.includes(item.id) ? 'bookmark' : 'bookmark-outline'} label={library.saved.includes(item.id) ? `Bỏ lưu ${item.term}` : `Lưu ${item.term}`} active={library.saved.includes(item.id)} disabled={!library.ready} onPress={() => library.toggleSaved(item.id)} />
  </View>;

  return <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
    <StatusBar style="dark" />
    <View style={s.shell} aria-hidden={!!detail} accessibilityElementsHidden={!!detail} importantForAccessibility={detail ? 'no-hide-descendants' : 'auto'}>
      <View style={s.header}>
        <View style={s.brand}><Icon name="book-outline" color={C.green} size={24} /><Text style={s.brandName}>oxford <Text style={{ fontWeight: '500' }}>words.</Text></Text></View>
      </View>
      {!!library.error && <View accessibilityRole="alert" style={s.error}><Text style={s.errorText}>{library.error}</Text></View>}
      <View style={s.main}>
        <View style={s.intro}>
          <Text style={s.title}>{tab === 'dictionary' ? preparedLevelCounts[level] ? `${preparedLevelCounts[level]} từ ${level}.` : 'Từ điển của mình.' : 'Từ đã lưu.'}</Text>
          <Text style={s.subtitle}>{tab === 'dictionary' ? 'Họ từ · Sắc thái · Ví dụ Anh–Việt' : `${savedWords.length} từ của mình · Lưu trên máy`}</Text>
        </View>
        <View style={s.search}><Icon name="search-outline" color={C.secondary} size={23} />
          <TextInput accessibilityLabel="Tìm từ, họ từ hoặc nghĩa tiếng Việt" value={query} onChangeText={setQuery} placeholder="Tìm từ hoặc nghĩa Việt…" placeholderTextColor={C.secondary}
            style={s.searchInput} autoCapitalize="none" autoCorrect={false} returnKeyType="search" />
          {!!query && <IconButton icon="close" label="Xóa tìm kiếm" onPress={() => setQuery('')} />}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filters} contentContainerStyle={s.filterContent}>
          {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map(item => <Pressable key={item} accessibilityRole="button" accessibilityLabel={item === 'All' ? 'Tất cả trình độ' : `Trình độ ${item}`}
            accessibilityState={{ selected: level === item }} onPress={() => setLevel(item)} style={[s.filter, item === level && s.filterActive]}>
            <Text style={[s.filterText, item === level && { color: C.white }]}>{item === 'All' ? 'Tất cả' : item}</Text>
          </Pressable>)}
        </ScrollView>
        {tab === 'saved' && !!reviews.length && <Pressable accessibilityRole="button" accessibilityLabel="Bắt đầu ôn từ đã lưu" onPress={() => openWord(reviews[0], true)} style={s.reviewBanner}><View style={{ flex: 1 }}><Text style={s.reviewTitle}>Ôn {reviews.length} từ đang chờ</Text><Text style={s.reviewSubtitle}>Nhớ nghĩa trước khi mở đáp án</Text></View><Icon name="arrow-forward" color={C.green} /></Pressable>}
        <Text style={s.resultCount}>{results.length} từ{query ? ` khớp “${query}”` : ' · Chạm để mở chi tiết'}</Text>
        <FlatList data={results} keyExtractor={word => word.id} renderItem={renderWord} initialNumToRender={12} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={<View style={s.empty}><Icon name={tab === 'saved' && !query ? 'bookmark-outline' : 'search-outline'} size={37} color={C.green} /><Text style={s.emptyTitle}>{tab === 'saved' && !query ? 'Lưu những từ muốn nhớ' : 'Chưa tìm thấy từ'}</Text><Text style={s.emptyText}>{tab === 'saved' && !query ? 'Chạm biểu tượng lưu bên cạnh một từ để đưa vào bộ từ của mình.' : 'Thử tìm ngắn hơn hoặc chọn Tất cả. Các mức khác đang được bổ sung dần.'}</Text></View>} />
      </View>
      <View style={s.navigation}>{([{ id: 'dictionary', title: 'Từ điển', icon: 'book-outline', selected: 'book' }, { id: 'saved', title: 'Đã lưu', icon: 'bookmark-outline', selected: 'bookmark' }] as const).map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.title} accessibilityState={{ selected: tab === item.id }} onPress={() => changeTab(item.id)} style={[s.navTab, item.id === tab && s.navSelected]}><Icon name={item.id === tab ? item.selected : item.icon} size={23} color={item.id === tab ? C.green : C.secondary} /><Text style={[s.navText, item.id === tab && { color: C.green }]}>{item.title}</Text></Pressable>)}</View>
    </View>
    {!!detail && <WordDetail key={`${detail.id}-${review}`} word={detail} saved={library.saved.includes(detail.id)} ready={library.ready} onClose={closeWord} onSave={() => library.toggleSaved(detail.id)} review={review} onKnown={markKnown} pronunciation={pronunciation} />}
  </SafeAreaView>;
}
export default function App() { return <SafeAreaProvider><AppContent /></SafeAreaProvider>; }

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface }, shell: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', backgroundColor: C.white },
  header: { minHeight: 72, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 }, brandName: { fontSize: 21, color: C.ink, fontWeight: '800', letterSpacing: -0.6 },
  main: { flex: 1, paddingHorizontal: 24 }, intro: { paddingTop: 24, paddingBottom: 21 }, title: { color: C.ink, fontSize: 29, fontWeight: '800', lineHeight: 38, letterSpacing: -0.8 }, subtitle: { color: C.secondary, fontSize: 16, lineHeight: 25, marginTop: 5 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 58, borderWidth: 1.5, borderColor: C.controlBorder, borderRadius: 12, paddingLeft: 14, paddingRight: 3, backgroundColor: C.white }, searchInput: { flex: 1, paddingVertical: 16, fontSize: 18, color: C.ink, outlineWidth: 0 },
  filters: { minHeight: 72, maxHeight: 72 }, filterContent: { alignItems: 'center', gap: 8 }, filter: { borderWidth: 1, borderColor: C.controlBorder, minWidth: 49, minHeight: 44, paddingHorizontal: 13, justifyContent: 'center', alignItems: 'center', borderRadius: 9 }, filterActive: { backgroundColor: C.ink, borderColor: C.ink }, filterText: { color: C.secondary, fontSize: 15, fontWeight: '600' },
  resultCount: { fontSize: 14, color: C.secondary, lineHeight: 22, marginBottom: 6 }, wordRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: C.border, paddingVertical: 17 }, wordButton: { flex: 1, minHeight: 64 }, wordHeading: { flexDirection: 'row', alignItems: 'center', gap: 11 }, word: { color: C.ink, fontSize: 23, lineHeight: 31, fontWeight: '700', flexShrink: 1 }, definition: { color: C.secondary, fontSize: 17, lineHeight: 26, marginTop: 5 }, wordHint: { fontSize: 13, color: C.green, fontWeight: '600', lineHeight: 20, marginTop: 5 },
  navigation: { paddingHorizontal: 24, paddingVertical: 9, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 12, backgroundColor: C.white }, navTab: { flex: 1, minHeight: 53, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9, borderRadius: 11 }, navSelected: { backgroundColor: C.selected }, navText: { fontSize: 16, fontWeight: '700', color: C.secondary },
  reviewBanner: { backgroundColor: C.selected, padding: 15, borderRadius: 11, flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 }, reviewTitle: { color: C.green, fontSize: 18, fontWeight: '700' }, reviewSubtitle: { color: C.secondary, fontSize: 14, marginTop: 5, lineHeight: 23 },
  empty: { paddingVertical: 40, alignItems: 'center', gap: 14 }, emptyTitle: { color: C.ink, fontSize: 22, lineHeight: 31, fontWeight: '700', textAlign: 'center' }, emptyText: { color: C.secondary, fontSize: 17, lineHeight: 27, textAlign: 'center' },
  error: { backgroundColor: C.errorBg, padding: 14, borderBottomWidth: 1, borderColor: C.border }, errorText: { color: C.error, fontSize: 15, lineHeight: 24 },
});
