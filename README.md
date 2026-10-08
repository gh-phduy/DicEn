# DicEn

Ứng dụng từ điển Anh–Việt độc lập, xây dựng bằng Expo và React Native cho Android.
Hiện có đủ **899 mục từ A1** và **810 mục B1** theo hai tài liệu Oxford đã nhập,
cùng các từ thử trước đó ở những mức chưa hoàn thiện. App mở mặc định ở A1;
chọn **B1** để xem bộ B1 và các nghĩa/cách dùng ở trình độ này.

## Tính năng

- Tra từ, nghĩa Việt có hoặc không dấu, và dạng trong họ từ.
- Lọc theo trình độ Oxford A1–C1.
- Chi tiết gồm **Họ từ**, **Sắc thái**, **Ví dụ Anh–Việt** và cụm từ thường gặp.
- Dạng ngữ pháp riêng cho đại từ, số nhiều bất quy tắc và một số động từ bất quy tắc.
  Tìm `wrote` để ra `write`, `children` để ra `child`, `happiness` để ra `happy`.
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

`src/data/a1.json` chứa toàn bộ 899 mục A1, mỗi mục có nghĩa Việt, phiên âm Mỹ
và ít nhất một ví dụ Anh–Việt. `src/data/a1-report.json` ghi kiểm tra độ bao phủ:
438 mục có thêm họ từ, 90 mục có dạng ngữ pháp, 372 mục có ghi chú cách dùng,
253 mục có so sánh. Không tạo từ bằng cách thêm hậu tố tự động hoặc coi các từ
đối lập/dễ nhầm là đồng nghĩa. Một số ví dụ được dùng chung cho các từ trong cùng câu.

Nguồn biên soạn A1 nằm trong các file `scripts/data/a1-*.txt`, snapshot phiên âm
`a1-pronunciations.json` và `scripts/a1-extra.mjs`. Nghĩa/loại từ hiển thị tập trung
vào A1; các dạng họ từ liên quan có thể thuộc mức cao hơn. Dữ liệu biên soạn phục vụ
học tập, chưa được chuyên gia từ điển rà soát từng mục. Không tuyên bố bao gồm mọi
nghĩa hoặc mọi dạng phái sinh của từng từ.

`src/data/b1.json` chứa 810 mục B1: 809 mục trong American Oxford 3000 và
`specialize` trong American Oxford 5000 bổ sung. Tất cả có nghĩa Việt, phiên âm Mỹ,
loại từ riêng của B1 và ví dụ Anh–Việt. `src/data/b1-report.json` ghi độ bao phủ:
454 mục có thêm họ từ, 37 mục có dạng ngữ pháp, 172 mục có ghi chú và 90 mục có
so sánh cách dùng. Các nguồn biên soạn nằm trong `scripts/data/b1-*.txt` và
`scripts/b1-extra.mjs`; có thể tạo lại ngoại tuyến bằng `npm run data:import`.

Một từ có thể được học ở nhiều mức với loại từ/nghĩa khác nhau: `water` là nước ở
A1 và tưới ở B1; `it` là đại từ A1 còn `IT` là công nghệ thông tin ở B1. Mục B1
dùng ID `b1:<sourceId>` để lưu đúng nghĩa, giữ nguyên ID của các từ A1 và bộ thử cũ.
Danh sách Tất cả có thể hiển thị cùng từ ở hai trình độ; chọn mức để tập trung đúng
nghĩa. Bộ lọc A1/B1 chỉ dùng các nghĩa đã biên soạn riêng cho mức đó.

`src/data/trial.json` giữ 50 từ thử có họ từ và so sánh ngữ cảnh.
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
Danh sách chính gồm A1, B1 và các từ thử ở những mức chưa hoàn thiện. Các mục thử
được thay bằng bản đầy đủ khi đã có dữ liệu phù hợp. Chỉ mục lớn được giữ để mở
rộng và đọc những từ đã lưu trước đây.
PDF gốc không được đưa vào repo.

Nhập lại từ hai PDF do người dùng cung cấp (tùy chọn; không cần để chạy app):

```sh
python -m pip install pypdf
python scripts/import-oxford.py /path/to/American_Oxford_3000.pdf /path/to/American_Oxford_5000.pdf
npm run data:import
```

Đối chiếu lại loại từ và chữ hoa của riêng A1 từ PDF gốc:

```sh
python scripts/extract-a1-metadata.py /path/to/American_Oxford_3000.pdf
npm run data:import
```

Đối chiếu lại riêng B1 (cần cả hai PDF để lấy `specialize`):

```sh
python scripts/extract-a1-metadata.py /path/to/American_Oxford_3000.pdf /path/to/American_Oxford_5000.pdf B1
npm run data:import
```

Snapshot phiên âm dùng [ipa-dict](https://github.com/open-dict-data/ipa-dict) và
được lưu kèm nguồn, phiên bản và thông báo bản quyền MIT tại
`scripts/data/attributions/`. Các ghi chú về hardly, each/every, can và bring/take
đã được đối chiếu với Cambridge và có liên kết trong chi tiết từ. Các mục B1 về
used, historic/historical, IT, sensible và đơn vị ton cũng có liên kết tham khảo
Cambridge/NIST. Các từ khác không được đánh dấu như đã kiểm chứng bằng từ điển.

Phát âm dùng `expo-speech`; khả năng đọc khi ngoại tuyến tùy thuộc giọng đã cài
trên thiết bị. Bookmark và tiến độ học lưu cục bộ. Giữ định danh ứng dụng Android/iOS
và khóa lưu trữ cũ để dữ liệu của bản thử trước vẫn tương thích.

## Kiểm tra

```sh
npm run typecheck
npm test
npx expo export --platform android --platform web --output-dir dist
```

Kiểm tra gồm bao phủ A1/B1 chính xác theo PDF, loại từ theo từng mức, đồng hình và
phiên âm theo nghĩa, tìm kiếm dạng biến đổi/họ từ, tìm không dấu, lọc nhiều trình độ,
lịch ôn 24 giờ, độ đầy đủ của 50 từ, nghĩa của lead, cách dùng rise/raise và việc
giữ riêng các nghĩa A1/B1 khi lọc, lưu và đọc lại.
Export tạo bundle, chưa phải APK; độ rõ dưới nắng và giọng đọc cần thử trên điện thoại.

## APK

Project đã liên kết với [@jayngl/dicen trên Expo](https://expo.dev/accounts/jayngl/projects/dicen).
Profile `preview` tạo APK cài trực tiếp trên Android. Đăng nhập bằng tài khoản
có quyền truy cập project (máy này đã đăng nhập `jayngl`):

```sh
npx eas-cli@latest whoami
# Chỉ đăng nhập nếu chưa có tài khoản đúng:
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

Khi build hoàn tất, mở link build trên điện thoại, chọn **Install/Download APK**
và cài file. Bản APK chứa dữ liệu từ điển, chạy độc lập với máy tính và Expo Go.
Các bản build nằm trong tab **Builds** của project Expo.

Tham khảo: [Expo](https://docs.expo.dev/) và
[Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/).
