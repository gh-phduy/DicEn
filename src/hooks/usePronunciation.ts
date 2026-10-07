import { useCallback, useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

// Pronunciation belongs to the open dictionary entry; nothing plays automatically.
export function usePronunciation() {
  const [error, setError] = useState('');
  const generation = useRef(0);
  const stopSpeech = useCallback(() => {
    ++generation.current;
    setError('');
    void Speech.stop().catch(() => {});
  }, []);
  useEffect(() => () => {
    ++generation.current;
    void Speech.stop().catch(() => {});
  }, []);

  const speak = async (text: string) => {
    const request = ++generation.current;
    setError('');
    try {
      await Speech.stop();
      if (request !== generation.current) return;
      Speech.speak(text, {
        language: 'en-US', rate: 0.85,
        onError: () => {
          if (request === generation.current) setError('Máy chưa có giọng đọc tiếng Anh. Thêm giọng đọc trong cài đặt thiết bị.');
        },
      });
    } catch {
      if (request === generation.current) setError('Chưa đọc được từ này trên thiết bị.');
    }
  };
  return { speak, stopSpeech, error };
}
