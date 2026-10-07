# DicEn

Ứng dụng từ điển Anh–Việt độc lập, xây dựng bằng Expo và React Native cho Android.
Bản thử tập trung **50 từ**, giúp học họ từ và chọn từ đúng ngữ cảnh.

## Tính năng

- Tra từ, nghĩa Việt có hoặc không dấu, và dạng trong họ từ.
- Lọc theo trình độ Oxford A1–C1.
- Chi tiết gồm **Họ từ**, **Sắc thái**, **Ví dụ Anh–Việt** và cụm từ thường gặp.
- Lưu từ trên thiết bị, tự kiểm tra và ôn lại sau 24 giờ.
- Phát âm riêng từng từ hoặc câu bằng giọng đọc của thiết bị; không có trình phát bài nghe.
- Nền sáng, chữ lớn, màu tương phản và nút dễ chạm.

## Chạy project

Cần Node.js 22.18+ hoặc 24+ và npm. Không cần QuizFlash, backend, tài khoản hay API key.

```sh
git clone https://github.com/gh-phduy/DicEn.git
cd DicEn
npm ci
npm start
```

Dùng Expo Go tương thích SDK 57 trên Android để quét QR trong terminal.
Điện thoại và máy tính cần cùng mạng Wi-Fi; giữ terminal chạy khi dùng Expo Go.

Xem trên trình duyệt:

```sh
npm run web
```

## Dữ liệu

`src/data/trial.json` chứa 50 từ được bổ sung họ từ và so sánh ngữ cảnh.
Danh sách họ từ chọn các dạng thông dụng, không bao gồm mọi dạng hiếm hoặc dạng chia.
Các ghi chú và ví dụ so sánh nằm trong `scripts/trial-notes.mjs`.

Nguồn song ngữ 147 từ đã được chuyển vào `scripts/data/bilingual.json` từ các lexicon
của QuizFlash. File nguồn nằm trong repo này; việc tạo dữ liệu không phụ thuộc project cũ.
Tạo lại dữ liệu đã chuẩn bị:

```sh
npm run data:import
```

Chỉ mục Oxford gồm 4.978 mục từ được nhập từ American Oxford 3000 và phần bổ sung
American Oxford 5000. PDF cung cấp từ, loại từ và trình độ; nghĩa Việt và ví dụ được
biên soạn riêng. `src/data/import-report.json` ghi số lượng thực tế.
Danh sách chính hiện chỉ hiển thị 50 từ thử nghiệm. Chỉ mục lớn được giữ để mở rộng
và đọc những từ đã lưu trước đây. PDF gốc không được đưa vào repo.

Nhập lại từ hai PDF do người dùng cung cấp (tùy chọn; không cần để chạy app):

```sh
python -m pip install pypdf
python scripts/import-oxford.py /path/to/American_Oxford_3000.pdf /path/to/American_Oxford_5000.pdf
npm run data:import
```

Phát âm dùng `expo-speech`; khả năng đọc khi ngoại tuyến tùy thuộc giọng đã cài
trên thiết bị. Bookmark và tiến độ học lưu cục bộ. Giữ định danh ứng dụng Android/iOS
và khóa lưu trữ cũ để dữ liệu của bản thử trước vẫn tương thích.

## Kiểm tra

```sh
npm run typecheck
npm test
npx expo export --platform android --platform web --output-dir dist
```

Kiểm tra gồm tìm kiếm không dấu và họ từ, lọc nhiều trình độ, lịch ôn 24 giờ,
độ đầy đủ của 50 từ, phân biệt nghĩa của lead và cách dùng rise/raise.
Export tạo bundle, chưa phải APK; độ rõ dưới nắng và giọng đọc cần thử trên điện thoại.

## APK

Repo có cấu hình EAS preview để tạo APK. Bước này cần tài khoản Expo:

```sh
npx eas-cli build --platform android --profile preview
```

Tham khảo: [Expo](https://docs.expo.dev/) và
[Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/).
