import React, { useEffect, useRef, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Word, WordFamily } from '../lib/study';
import { colors as C, Icon, IconButton, Level } from './ui';
import type { usePronunciation } from '../hooks/usePronunciation';

type Panel = 'family' | 'nuance' | 'examples';
type Props = {
  word: Word; saved: boolean; ready: boolean; onClose: () => void; onSave: () => void;
  review: boolean; onKnown: () => void; pronunciation: ReturnType<typeof usePronunciation>;
};
const groups: { key: keyof WordFamily; label: string; tag: string }[] = [
  { key: 'nouns', label: 'Danh từ', tag: 'NOUN' },
  { key: 'verbs', label: 'Động từ', tag: 'VERB' },
  { key: 'adjectives', label: 'Tính từ', tag: 'ADJECTIVE' },
  { key: 'adverbs', label: 'Trạng từ', tag: 'ADVERB' },
];

export function WordDetail({ word, saved, ready, onClose, onSave, review, onKnown, pronunciation }: Props) {
  const [panel, setPanel] = useState<Panel>('family');
  const [revealed, setRevealed] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, [panel]);
  const visible = !review || revealed;
  return <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}><View style={s.shell} role="dialog" aria-modal accessibilityLabel={`Chi tiết từ ${word.term}`} accessibilityViewIsModal>
      <View style={s.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Đóng chi tiết từ" onPress={onClose} style={s.back}><Icon name="arrow-back" size={24} /><Text style={s.backText}>{review ? 'Ôn từ' : 'Từ điển'}</Text></Pressable>
        <View style={s.headerActions}>
          <IconButton icon={saved ? 'bookmark' : 'bookmark-outline'} label={saved ? `Bỏ lưu ${word.term}` : `Lưu ${word.term}`} onPress={onSave} active={saved} disabled={!ready} /></View>
      </View>
      {!!pronunciation.error && <View accessibilityRole="alert" style={s.error}><Text style={s.errorText}>{pronunciation.error}</Text></View>}
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} stickyHeaderIndices={visible ? [1] : []} showsVerticalScrollIndicator={false}>
        <View style={s.wordHero}>
          <View style={s.meta}><Level label={(word.levels ?? [word.level]).join(' / ')} /><Text style={s.metaText}>{word.partOfSpeech}</Text>{review && <Text style={s.metaText}>Tự kiểm tra</Text>}</View>
          <Text selectable style={s.word}>{word.term}</Text>
          <View style={s.pronunciation}><Text selectable style={s.ipa}>{word.phonetic ?? 'Chưa có phiên âm'}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Nghe phát âm ${word.term}`} onPress={() => void pronunciation.speak(word.term.replace(/\s*\(.*?\)/g, ''))} style={s.pronounce}><Icon name="volume-high-outline" size={21} color={C.green} /><Text style={s.pronounceText}>Phát âm</Text></Pressable></View>
          {visible && <><Text style={s.meaningLabel}>NGHĨA ĐANG HỌC</Text><Text selectable style={s.meaning}>{word.definition ?? 'Chưa có nghĩa Việt cho từ này.'}</Text></>}
        </View>
        {visible ? <View style={s.sections}>
          {([{ id: 'family', title: 'Họ từ' }, { id: 'nuance', title: 'Sắc thái' }, { id: 'examples', title: 'Ví dụ' }] as const).map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.title} accessibilityState={{ selected: panel === item.id }} onPress={() => setPanel(item.id)} style={[s.sectionTab, panel === item.id && s.sectionActive]}><Text style={[s.sectionText, panel === item.id && { color: C.green }]}>{item.title}</Text></Pressable>)}
        </View> : <View style={s.recall}><Text style={s.recallTitle}>Còn nhớ nghĩa từ này?</Text><Text style={s.body}>Thử nhớ lại trước khi mở đáp án.</Text><Pressable accessibilityRole="button" accessibilityLabel="Xem nghĩa" onPress={() => setRevealed(true)} style={s.primary}><Text style={s.primaryText}>Xem nghĩa</Text></Pressable></View>}
        {visible && <View style={s.content}>
          {panel === 'family' && <>
            <Text style={s.sectionTitle}>Word family</Text><Text style={s.description}>{word.familyNote ?? 'Các dạng cùng họ từ, kèm nghĩa Việt. Những dạng thông dụng được chia theo loại từ.'}</Text>
            {!!word.forms?.length && <View style={s.familyGroup}><View style={s.groupHeading}><Text style={s.groupTitle}>Dạng ngữ pháp</Text></View><Text style={s.description}>Biến đổi của từ đang học, được tách riêng khỏi họ từ.</Text>{word.forms.map((member, i) => <View key={i} style={s.member}><Text selectable style={s.memberTerm}>{member.term}</Text><Text selectable style={s.memberMeaning}>{member.vi}</Text></View>)}</View>}
            {word.wordFamily && Object.values(word.wordFamily).some(members => members.length) ? groups.map(group => <View key={group.key} style={s.familyGroup}>
              <View style={s.groupHeading}><Text style={s.groupTitle}>{group.label}</Text><Text style={s.groupTag}>{group.tag}</Text></View>
              {word.wordFamily![group.key].length ? word.wordFamily![group.key].map((member, i) => <View key={i} style={s.member}>
                <Text selectable style={[s.memberTerm, member.term === word.term && { color: C.green }]}>{member.term}</Text><Text selectable style={s.memberMeaning}>{member.vi}</Text>
              </View>) : <Text style={s.emptyGroup}>Không có dạng thông dụng được chọn trong bộ này.</Text>}
            </View>) : !word.wordFamily ? <Text style={s.description}>Chưa bổ sung word family cho từ này.</Text> : null}
            <Text style={s.footnote}>Họ từ khác từ đồng nghĩa. Bộ này chọn các dạng thông dụng; các biến đổi ngữ pháp đã bổ sung nằm trong phần riêng. Danh sách không bao gồm mọi dạng hiếm.</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Xem sắc thái và cách dùng" onPress={() => setPanel('nuance')} style={s.nextSection}><Text style={s.nextText}>Phân biệt cách dùng</Text><Icon name="arrow-forward" color={C.green} size={21} /></Pressable>
          </>}
          {panel === 'nuance' && <>
            <Text style={s.sectionTitle}>Chọn từ đúng ngữ cảnh</Text><Text style={s.description}>Từ gần nghĩa, từ đối lập và các cặp dễ nhầm. Các từ được so sánh không luôn thay thế được nhau.</Text>
            {!!word.usageNote && <View style={s.usageBox}><Text style={s.usageTitle}>{word.term}</Text><Text selectable style={s.body}>{word.usageNote}</Text></View>}
            {word.comparisons?.length ? word.comparisons.map((item, i) => <View key={i} style={s.comparison}>
              <View style={s.comparisonTop}><Text selectable style={s.comparisonTerm}>{item.term}</Text>{!!item.register && <View style={s.register}><Text style={s.registerText}>{item.register}</Text></View>}</View>
              <Text style={s.comparisonMeaning}>{item.vi}</Text><Text selectable style={s.body}>{item.nuance}</Text>
              <View style={s.shortExample}><Text selectable style={s.english}>{item.example.en}</Text><Text selectable style={s.vietnamese}>{item.example.vi}</Text></View>
            </View>) : <Text style={s.description}>Bộ này chưa chọn cặp so sánh phù hợp cho nghĩa đang học. Xem ví dụ để hiểu cách dùng trong câu.</Text>}
            {!!word.references?.length && <View style={s.references}><Text style={s.referenceTitle}>Đọc thêm</Text>{word.references.map(reference => <Pressable key={reference.url} accessibilityRole="link" onPress={() => void Linking.openURL(reference.url)} style={s.reference}><Text style={s.referenceText}>{reference.title}</Text><Icon name="open-outline" color={C.green} size={18} /></Pressable>)}</View>}
          </>}
          {panel === 'examples' && <>
            <Text style={s.sectionTitle}>Dùng trong câu</Text>
            {word.examples?.map((example, i) => <View key={i} style={s.exampleBlock}><View style={s.exampleHeading}><Text style={s.exampleNumber}>VÍ DỤ {i + 1}</Text><IconButton icon="volume-high-outline" label={`Nghe ví dụ ${i + 1}`} onPress={() => void pronunciation.speak(example.en)} /></View><Text selectable style={s.english}>{example.en}</Text><Text selectable style={s.vietnamese}>{example.vi}</Text></View>)}
            {!!word.collocations?.length && <><Text style={[s.sectionTitle, { marginTop: 16 }]}>Cụm từ thường gặp</Text>{word.collocations.map((item, i) => <View key={i} style={s.collocation}><Text selectable style={s.memberTerm}>{item.phrase}</Text><Text selectable style={s.memberMeaning}>{item.vi}</Text></View>)}</>}
          </>}
        </View>}
      </ScrollView>
      {review && revealed && <View style={s.reviewFooter}><Text style={s.reviewHint}>Đánh dấu đã nhớ để ôn lại sau 1 ngày.</Text><View style={s.reviewActions}><Pressable accessibilityRole="button" disabled={!ready} onPress={onClose} style={s.secondary}><Text style={s.secondaryText}>Chưa nhớ</Text></Pressable><Pressable accessibilityRole="button" disabled={!ready} onPress={onKnown} style={[s.primary, { flex: 1 }]}><Text style={s.primaryText}>Đã nhớ</Text><Icon name="checkmark" size={20} /></Pressable></View></View>}
    </View></SafeAreaView>
  </Modal>;
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface }, shell: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', backgroundColor: C.white },
  header: { minHeight: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: C.border },
  back: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingRight: 12 }, backText: { color: C.ink, fontSize: 17, fontWeight: '600' }, headerActions: { flexDirection: 'row', gap: 3 },
  wordHero: { padding: 24, paddingBottom: 25 }, meta: { flexDirection: 'row', gap: 12, alignItems: 'center' }, metaText: { color: C.secondary, fontSize: 15 },
  word: { color: C.ink, fontSize: 43, lineHeight: 54, fontWeight: '800', letterSpacing: -1, marginTop: 15 },
  pronunciation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 5 }, ipa: { color: C.secondary, fontSize: 18, flexShrink: 1 },
  pronounce: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, minHeight: 48, borderRadius: 10, backgroundColor: C.surface }, pronounceText: { color: C.green, fontSize: 15, fontWeight: '600' },
  meaningLabel: { color: C.green, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginTop: 20 }, meaning: { color: C.ink, fontSize: 22, lineHeight: 32, fontWeight: '600', marginTop: 8 },
  sections: { backgroundColor: C.white, flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border, paddingHorizontal: 18, paddingVertical: 8, gap: 7 },
  sectionTab: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }, sectionActive: { backgroundColor: C.selected }, sectionText: { fontSize: 17, fontWeight: '700', color: C.secondary },
  content: { padding: 24 }, sectionTitle: { color: C.ink, fontSize: 23, lineHeight: 31, fontWeight: '700' }, description: { color: C.secondary, fontSize: 16, lineHeight: 25, marginTop: 8, marginBottom: 10 },
  familyGroup: { marginTop: 21 }, groupHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, padding: 12, borderRadius: 9 }, groupTitle: { color: C.ink, fontSize: 18, fontWeight: '700' }, groupTag: { color: C.green, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  member: { paddingVertical: 13, paddingHorizontal: 2, borderBottomWidth: 1, borderColor: C.border }, memberTerm: { color: C.ink, fontSize: 19, lineHeight: 27, fontWeight: '700' }, memberMeaning: { color: C.secondary, fontSize: 17, lineHeight: 26, marginTop: 4 }, emptyGroup: { color: C.secondary, fontSize: 16, lineHeight: 26, paddingTop: 12 },
  footnote: { color: C.secondary, fontSize: 14, lineHeight: 23, marginTop: 28 }, nextSection: { borderRadius: 11, backgroundColor: C.selected, marginTop: 18, minHeight: 54, paddingHorizontal: 14, gap: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, nextText: { color: C.green, fontSize: 16, fontWeight: '700', flexShrink: 1 },
  usageBox: { backgroundColor: C.surface, borderLeftWidth: 3, borderColor: C.green, borderRadius: 9, padding: 17, marginTop: 14, marginBottom: 9 }, usageTitle: { color: C.green, fontSize: 21, fontWeight: '700', marginBottom: 7 }, body: { color: C.ink, fontSize: 18, lineHeight: 29 },
  comparison: { paddingVertical: 23, borderBottomWidth: 1, borderColor: C.border }, comparisonTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }, comparisonTerm: { color: C.ink, fontSize: 24, fontWeight: '700', lineHeight: 32 }, register: { backgroundColor: C.selected, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 5 }, registerText: { color: C.green, fontSize: 12, fontWeight: '700' }, comparisonMeaning: { color: C.secondary, fontSize: 17, lineHeight: 26, marginTop: 5, marginBottom: 12 },
  shortExample: { marginTop: 15, paddingLeft: 13, borderLeftWidth: 2, borderColor: C.border }, english: { color: C.ink, fontSize: 18, lineHeight: 29, fontWeight: '500' }, vietnamese: { color: C.secondary, fontSize: 17, lineHeight: 27, marginTop: 8 },
  exampleBlock: { paddingVertical: 17, borderBottomWidth: 1, borderColor: C.border }, exampleHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }, exampleNumber: { color: C.green, fontSize: 12, fontWeight: '800', letterSpacing: 1 }, collocation: { paddingVertical: 16, borderBottomWidth: 1, borderColor: C.border },
  references: { marginTop: 22 }, referenceTitle: { color: C.secondary, fontSize: 14 }, reference: { flexDirection: 'row', minHeight: 48, alignItems: 'center', gap: 8 }, referenceText: { color: C.green, fontSize: 14, fontWeight: '600' },
  recall: { padding: 24, gap: 18 }, recallTitle: { color: C.ink, fontSize: 24, lineHeight: 32, fontWeight: '700' }, primary: { minHeight: 54, borderRadius: 11, paddingHorizontal: 17, backgroundColor: C.gold, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, primaryText: { color: C.ink, fontSize: 18, fontWeight: '700' },
  reviewFooter: { borderTopWidth: 1, borderColor: C.border, padding: 16, backgroundColor: C.white }, reviewHint: { color: C.secondary, fontSize: 14, marginBottom: 12 }, reviewActions: { flexDirection: 'row', gap: 12 }, secondary: { minHeight: 54, flex: 1, borderRadius: 11, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }, secondaryText: { color: C.ink, fontSize: 17, fontWeight: '600' },
  error: { backgroundColor: C.errorBg, padding: 12 }, errorText: { color: C.error, fontSize: 15, lineHeight: 24 },
});
