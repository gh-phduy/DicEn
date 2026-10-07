import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyProgress, type Progress } from '../lib/study';

const KEY = 'oxford-radio.library.v1';
export function useLibrary() {
  const [saved, setSaved] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const writeQueue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY).then(raw => {
      if (!active) return;
      if (raw) {
        const data = JSON.parse(raw);
        if (!Array.isArray(data.saved) || !data.saved.every((id: unknown) => typeof id === 'string') ||
            !data.progress || !data.progress.heard || !data.progress.known ||
            !Object.values(data.progress.heard).every(value => typeof value === 'number' && Number.isFinite(value)) ||
            !Object.values(data.progress.known).every(value => typeof value === 'number' && Number.isFinite(value))) {
          throw new Error('Invalid library');
        }
        setSaved(data.saved);
        setProgress(data.progress);
      }
      setReady(true);
    }).catch(() => { if (active) setError('Không đọc được dữ liệu đã lưu. Thử mở lại app; dữ liệu cũ vẫn được giữ.'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const snapshot = JSON.stringify({ saved, progress });
    writeQueue.current = writeQueue.current.then(() => AsyncStorage.setItem(KEY, snapshot))
      .catch(() => setError('Chưa lưu được thay đổi trên máy. Kiểm tra dung lượng rồi thử lại.'));
  }, [saved, progress, ready]);
  const toggleSaved = (id: string) => {
    if (!ready) return;
    setSaved(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  };
  return { saved, progress, setProgress, toggleSaved, ready, error };
}
