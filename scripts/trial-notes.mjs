// Editorial learning notes, limited to common forms and the senses shown here.
// Examples are original teaching examples, not quotations from a dictionary.
const items = values => values.map(value => { const [term, vi] = value.split('|'); return { term, vi }; });
const family = (nouns, verbs, adjectives = [], adverbs = []) => ({ nouns: items(nouns), verbs: items(verbs), adjectives: items(adjectives), adverbs: items(adverbs) });
const compare = (term, vi, nuance, en, translation, register = 'Trung tính') => ({ term, vi, nuance, register, example: { en, vi: translation } });
const entry = (definition, usageNote, wordFamily, comparisons) => ({ definition, usageNote, wordFamily, comparisons });

export const TRIAL_NOTES = {
  afford: entry('có đủ tiền hoặc điều kiện để làm gì', 'Thường dùng can/cannot afford + danh từ hoặc to + động từ. Nhấn mạnh khả năng chi trả, không phải việc đã trả tiền.',
    family(['affordability|khả năng chi trả; mức giá vừa túi tiền'], ['afford|có đủ khả năng chi trả'], ['affordable|có giá phải chăng', 'unaffordable|quá đắt, không đủ khả năng chi trả'], ['affordably|với giá phải chăng']), [
      compare('pay for', 'trả tiền cho', 'Nói về hành động trả tiền. Có thể afford một món đồ nhưng chưa pay for nó.', 'I paid for the tickets yesterday.', 'Tôi đã trả tiền vé hôm qua.'),
      compare('manage', 'xoay xở, làm được', 'Rộng hơn tiền bạc: làm được việc dù khó. Manage to buy không chỉ nói về khả năng tài chính.', 'We managed to buy the last two tickets.', 'Chúng tôi đã xoay xở mua được hai vé cuối.'),
    ]),
  assist: entry('giúp đỡ, hỗ trợ', 'Assist thường trang trọng hơn help; hay gặp trong công việc, dịch vụ và hướng dẫn. Assist someone with something / in doing something.',
    family(['assistance|sự hỗ trợ', 'assistant|người trợ lý', 'assist|pha kiến tạo trong thể thao'], ['assist|hỗ trợ'], ['assisted|có sự hỗ trợ', 'unassisted|không có sự hỗ trợ', 'assistive|hỗ trợ chức năng, thường nói về thiết bị hoặc công nghệ'], []), [
      compare('help', 'giúp', 'Từ rộng, tự nhiên trong giao tiếp hằng ngày; dùng được cho việc lớn lẫn việc nhỏ.', 'Could you help me carry this bag?', 'Bạn giúp tôi mang túi này được không?'),
      compare('support', 'hỗ trợ, ủng hộ', 'Thường nhấn mạnh sự hậu thuẫn về tinh thần, tài chính hoặc trong thời gian dài.', 'Her family supported her through college.', 'Gia đình hỗ trợ cô ấy suốt thời gian học đại học.'),
    ]),
  annoy: entry('làm bực mình, gây khó chịu', 'Annoy thường là sự khó chịu vì việc lặp lại hoặc phiền toái. Annoyed nói về người cảm thấy khó chịu; annoying nói về thứ gây khó chịu.',
    family(['annoyance|sự bực mình; điều gây phiền'], ['annoy|làm bực mình'], ['annoyed|cảm thấy bực mình', 'annoying|gây bực mình'], ['annoyingly|một cách gây khó chịu']), [
      compare('irritate', 'làm cáu, gây kích ứng', 'Gần annoy nhưng cũng dùng cho kích ứng cơ thể; thường gợi cảm giác khó chịu dai dẳng.', 'This soap irritates my skin.', 'Loại xà phòng này gây kích ứng da tôi.'),
      compare('bother', 'làm phiền, khiến lo lắng', 'Rộng hơn bực mình: một vấn đề có thể bother bạn vì nó khiến bạn lo.', 'Does the noise bother you?', 'Tiếng ồn có làm phiền bạn không?'),
    ]),
  attach: entry('gắn vào; đính kèm', 'Attach A to B: gắn A vào B. Với email, attach a file là đính kèm tệp; attached to còn chỉ sự gắn bó tình cảm.',
    family(['attachment|tệp đính kèm; sự gắn bó'], ['attach|gắn vào, đính kèm'], ['attached|được gắn vào; gắn bó', 'unattached|không gắn vào; chưa có ràng buộc'], []), [
      compare('connect', 'kết nối', 'Nhấn mạnh liên kết giữa hai vật, người hoặc hệ thống, không nhất thiết gắn vật lý.', 'Connect your phone to the speaker.', 'Kết nối điện thoại với loa.'),
      compare('fasten', 'cài, buộc chặt', 'Nhấn mạnh giữ chắc bằng khóa, dây, nút; attach chỉ việc gắn vào.', 'Fasten the strap before lifting the bag.', 'Cài chặt dây trước khi nhấc túi.'),
    ]),
  combine: entry('kết hợp, gộp lại', 'Combine A with B: kết hợp hai thứ để cùng sử dụng hoặc tạo kết quả chung; chúng không nhất thiết mất đặc điểm riêng.',
    family(['combination|sự kết hợp; tổ hợp'], ['combine|kết hợp'], ['combined|được kết hợp, chung'], []), [
      compare('mix', 'trộn', 'Thường nói về trộn nguyên liệu, chất hoặc các thành phần; thiên về quá trình pha trộn.', 'Mix the flour with water.', 'Trộn bột với nước.'),
      compare('merge', 'sáp nhập, nhập thành một', 'Nhấn mạnh các phần trở thành một đơn vị, hay dùng với công ty, tệp và làn đường.', 'The two companies merged last year.', 'Hai công ty sáp nhập năm ngoái.'),
    ]),
  conclude: entry('kết luận; kết thúc', 'Có hai nghĩa chính: conclude that + mệnh đề là rút ra kết luận; conclude a talk là kết thúc bài nói.',
    family(['conclusion|kết luận; phần kết'], ['conclude|kết luận, kết thúc'], ['conclusive|mang tính quyết định, đủ để kết luận', 'inconclusive|chưa đủ để kết luận', 'concluding|thuộc phần kết'], ['conclusively|một cách dứt khoát', 'inconclusively|không đưa đến kết luận chắc chắn']), [
      compare('finish', 'làm xong, kết thúc', 'Tự nhiên trong đời thường; nói xong một việc, không mang nghĩa suy luận ra kết quả.', 'I finished my homework.', 'Tôi đã làm xong bài tập.'),
      compare('infer', 'suy ra', 'Nhấn mạnh suy luận từ bằng chứng gián tiếp; không dùng để nói kết thúc buổi họp.', 'We inferred that someone had been there.', 'Chúng tôi suy ra rằng đã có người ở đó.'),
    ]),
  confuse: entry('làm bối rối; nhầm lẫn', 'Confuse A with B: nhầm A với B. Confused là cảm thấy bối rối; confusing là khó hiểu, gây bối rối.',
    family(['confusion|sự bối rối; sự nhầm lẫn'], ['confuse|làm bối rối, nhầm'], ['confused|bối rối', 'confusing|gây khó hiểu'], ['confusingly|một cách gây khó hiểu']), [
      compare('puzzle', 'làm khó hiểu', 'Thường gợi một vấn đề khiến người ta phải suy nghĩ tìm lời giải.', 'Her sudden decision puzzled me.', 'Quyết định đột ngột của cô ấy khiến tôi khó hiểu.'),
      compare('mislead', 'khiến hiểu sai', 'Dẫn người ta đến niềm tin hoặc hướng đi sai, có thể do thông tin sai hay gây hiểu lầm.', 'The advertisement misled customers.', 'Quảng cáo đã khiến khách hàng hiểu sai.'),
    ]),
  count: entry('đếm; tính là quan trọng', 'Count the tickets là đếm vé. Every minute counts là mỗi phút đều quan trọng; count on someone là tin cậy vào ai.',
    family(['count|lần đếm; tổng số', 'counting|việc đếm'], ['count|đếm'], ['countable|đếm được', 'uncountable|không đếm được', 'countless|vô số'], []), [
      compare('calculate', 'tính toán', 'Dùng phép toán để tìm kết quả; count thường đếm từng đơn vị.', 'Calculate the total cost.', 'Tính tổng chi phí.'),
      compare('matter', 'có ý nghĩa, quan trọng', 'Gần nghĩa count trong every vote counts; không dùng thay count khi đếm số lượng.', 'Your opinion matters to me.', 'Ý kiến của bạn quan trọng với tôi.'),
    ]),
  cover: entry('che phủ; bao quát; chi trả', 'Cover có nhiều nghĩa: phủ bề mặt, bao quát nội dung, đưa tin hoặc chi trả chi phí. Chọn từ gần nghĩa theo từng ngữ cảnh.',
    family(['cover|vật che; bìa', 'coverage|phạm vi bao phủ; sự đưa tin', 'covering|lớp phủ'], ['cover|che phủ', 'uncover|bỏ lớp che; phát hiện'], ['covered|được che phủ', 'uncovered|không được che; được phát hiện'], []), [
      compare('hide', 'giấu, che khuất', 'Nhấn mạnh không để nhìn thấy hoặc biết đến; cover có thể chỉ phủ mà không có ý giấu.', 'She hid the gift in a drawer.', 'Cô ấy giấu món quà trong ngăn kéo.'),
      compare('include', 'bao gồm', 'Chỉ có một phần trong tổng thể. Cover a topic thường là đề cập hoặc giải thích chủ đề đó.', 'The price includes breakfast.', 'Giá đã bao gồm bữa sáng.'),
    ]),
  decorate: entry('trang trí', 'Decorate something with something: trang trí bằng gì. Trong ngữ cảnh quân đội, decorate còn có nghĩa trao huân chương.',
    family(['decoration|đồ trang trí; việc trang trí', 'decorator|người trang trí'], ['decorate|trang trí', 'redecorate|trang trí lại'], ['decorative|có tính trang trí', 'decorated|được trang trí'], ['decoratively|theo cách có tính trang trí']), [
      compare('adorn', 'tô điểm', 'Gần decorate nhưng thiên về làm đẹp, thường gặp trong văn viết giàu hình ảnh.', 'Flowers adorned the table.', 'Hoa tô điểm cho chiếc bàn.', 'Văn viết'),
      compare('furnish', 'trang bị nội thất', 'Cung cấp bàn ghế, đồ dùng cho phòng; không chỉ thêm đồ trang trí.', 'They furnished the apartment cheaply.', 'Họ trang bị nội thất căn hộ với chi phí thấp.'),
    ]),
  define: entry('định nghĩa; xác định rõ', 'Define a word là giải thích nghĩa; define a role hoặc boundary là làm rõ phạm vi, vai trò hay ranh giới.',
    family(['definition|định nghĩa; độ rõ nét'], ['define|định nghĩa', 'redefine|định nghĩa lại'], ['defined|được xác định rõ', 'undefined|chưa xác định', 'definable|có thể xác định được'], []), [
      compare('describe', 'mô tả', 'Nêu đặc điểm của một thứ; không nhất thiết xác lập nghĩa hay giới hạn chính xác.', 'Describe your ideal home.', 'Mô tả ngôi nhà lý tưởng của bạn.'),
      compare('specify', 'nêu cụ thể', 'Chỉ rõ chi tiết hoặc yêu cầu, thường trong hướng dẫn và văn bản kỹ thuật.', 'Please specify the delivery date.', 'Vui lòng nêu cụ thể ngày giao hàng.'),
    ]),
  deliver: entry('giao, chuyển đến; trình bày', 'Deliver a parcel: giao kiện hàng. Deliver a speech: đọc hoặc trình bày bài phát biểu. Deliver on a promise: thực hiện lời hứa.',
    family(['delivery|việc giao hàng; cách trình bày', 'deliverer|người giao hoặc giải cứu'], ['deliver|giao, chuyển đến'], ['deliverable|có thể giao được', 'undelivered|chưa được giao'], []), [
      compare('send', 'gửi', 'Nhấn mạnh bắt đầu gửi đi; deliver nhấn mạnh chuyển đến người hoặc nơi nhận.', 'I sent the package on Monday.', 'Tôi gửi kiện hàng vào thứ Hai.'),
      compare('bring', 'mang đến', 'Tự nhiên, rộng hơn, không nhất thiết là dịch vụ giao hàng hay giao cho người nhận cụ thể.', 'Bring your notebook tomorrow.', 'Mang sổ tay của bạn đến vào ngày mai.'),
    ]),
  determine: entry('xác định; quyết định kết quả', 'Determine the cause là tìm ra nguyên nhân. Một yếu tố determines an outcome khi nó quyết định kết quả; determined còn có nghĩa quyết tâm.',
    family(['determination|sự quyết tâm; việc xác định'], ['determine|xác định'], ['determined|quyết tâm', 'determining|mang tính quyết định', 'undetermined|chưa xác định'], ['determinedly|một cách kiên quyết']), [
      compare('decide', 'quyết định', 'Thường là chọn giữa các khả năng; determine còn là xác định sự thật sau khi tìm hiểu.', 'We decided to leave early.', 'Chúng tôi quyết định rời đi sớm.'),
      compare('establish', 'xác lập', 'Trong nghĩa tìm ra sự thật, nhấn mạnh xác nhận điều đó bằng bằng chứng.', 'The test established the cause.', 'Xét nghiệm đã xác định nguyên nhân.'),
    ]),
  divide: entry('chia, phân chia', 'Divide something into parts: chia thành các phần; divide by dùng trong phép chia. Chia không đồng nghĩa với phân phối cho từng người.',
    family(['division|sự chia; phép chia; bộ phận', 'divider|vật ngăn, vạch phân cách'], ['divide|chia'], ['divided|bị chia; bất đồng', 'divisible|chia hết được', 'undivided|không bị phân chia'], []), [
      compare('split', 'tách, chia', 'Hay dùng khi chia thành nhóm hoặc phần; split a bill là chia tiền thanh toán.', 'We split the bill equally.', 'Chúng tôi chia đều tiền hóa đơn.'),
      compare('separate', 'tách riêng', 'Nhấn mạnh các phần không còn ở cùng nhau, không nhất thiết chia một tổng thể.', 'Separate the dark clothes from the white ones.', 'Tách quần áo tối màu khỏi quần áo trắng.'),
    ]),
  donate: entry('quyên góp; hiến tặng', 'Donate tiền, đồ dùng hoặc máu cho người hay tổ chức; thường không trông chờ nhận lại khoản trả tương ứng.',
    family(['donation|khoản quyên góp; sự hiến tặng', 'donor|người quyên góp, người hiến'], ['donate|quyên góp'], ['donated|được hiến tặng'], []), [
      compare('give', 'cho', 'Rộng nhất, dùng cho mọi kiểu trao cho người khác; không nhất thiết vì mục đích từ thiện.', 'She gave me a book.', 'Cô ấy cho tôi một cuốn sách.'),
      compare('contribute', 'đóng góp', 'Góp một phần vào mục tiêu chung; có thể là tiền, thời gian, ý tưởng hoặc công sức.', 'Everyone contributed an idea.', 'Mọi người đều đóng góp một ý tưởng.'),
    ]),
  escape: entry('trốn thoát; thoát khỏi', 'Escape from a place: thoát khỏi một nơi. Escape danger: tránh hoặc thoát được nguy hiểm; không phải mọi lần rời đi đều là escape.',
    family(['escape|sự trốn thoát; lối thoát', 'escapee|người trốn thoát'], ['escape|trốn thoát'], ['escaped|đã trốn thoát', 'inescapable|không thể tránh khỏi'], ['inescapably|một cách không thể tránh khỏi']), [
      compare('flee', 'chạy trốn', 'Nhấn mạnh rời đi nhanh vì sợ hãi hoặc nguy hiểm, chưa khẳng định đã thoát thành công.', 'They fled the burning house.', 'Họ chạy trốn khỏi căn nhà đang cháy.'),
      compare('avoid', 'tránh', 'Ngăn mình gặp hoặc làm một điều ngay từ đầu; escape thường là thoát khỏi tình thế đã có.', 'Avoid that road during rush hour.', 'Tránh con đường đó vào giờ cao điểm.'),
    ]),
  exchange: entry('trao đổi; đổi', 'Exchange A for B: đổi A lấy B. Thường có sự trao qua lại; exchange ideas là trao đổi ý kiến.',
    family(['exchange|sự trao đổi; nơi giao dịch'], ['exchange|trao đổi'], ['exchangeable|có thể đổi được'], []), [
      compare('swap', 'đổi cho nhau', 'Gần exchange, hay dùng trong giao tiếp cho việc đổi chỗ hoặc đổi đồ giữa hai bên.', 'Can we swap seats?', 'Chúng ta đổi chỗ cho nhau được không?', 'Giao tiếp'),
      compare('trade', 'trao đổi, buôn bán', 'Hay gắn với mua bán hoặc giao dịch; có thể nói trade A for B khi đổi thứ này lấy thứ khác.', 'They trade goods across the border.', 'Họ buôn bán hàng hóa qua biên giới.'),
    ]),
  expand: entry('mở rộng; nở ra', 'Expand nói về tăng kích thước, phạm vi hay hoạt động. Expand on a point là giải thích thêm một ý.',
    family(['expansion|sự mở rộng, sự giãn nở'], ['expand|mở rộng'], ['expanded|được mở rộng', 'expandable|có thể mở rộng', 'expansive|rộng; cởi mở, hay trò chuyện'], ['expansively|một cách rộng rãi hoặc cởi mở']), [
      compare('grow', 'lớn lên, phát triển', 'Thường gợi quá trình phát triển tự nhiên; expand nhấn mạnh tăng phạm vi hoặc kích thước.', 'The business grew slowly.', 'Doanh nghiệp phát triển chậm.'),
      compare('extend', 'kéo dài, mở rộng đến', 'Hay dùng khi kéo dài thời gian, chiều dài hoặc phạm vi đến một điểm mới.', 'We extended the deadline by a week.', 'Chúng tôi gia hạn thêm một tuần.'),
    ]),
  explore: entry('khám phá; tìm hiểu các khả năng', 'Explore a place: đi tìm hiểu một nơi. Explore options: xem xét các khả năng trước khi quyết định.',
    family(['exploration|sự khám phá', 'explorer|người thám hiểm'], ['explore|khám phá'], ['exploratory|mang tính thăm dò'], []), [
      compare('discover', 'phát hiện ra', 'Nhấn mạnh tìm thấy điều mới; explore là quá trình tìm hiểu, chưa chắc dẫn đến phát hiện.', 'We discovered a small cave.', 'Chúng tôi phát hiện một hang nhỏ.'),
      compare('investigate', 'điều tra, xem xét kỹ', 'Có mục tiêu tìm sự thật hoặc nguyên nhân cụ thể, thường có hệ thống hơn.', 'They investigated the accident.', 'Họ điều tra vụ tai nạn.'),
    ]),
  fasten: entry('cài, buộc, giữ chặt', 'Fasten dùng với dây an toàn, khóa, nút áo hoặc vật cần giữ chắc. Không chỉ là chạm hoặc đặt hai vật cạnh nhau.',
    family(['fastener|vật cài, khóa hoặc chi tiết giữ chặt', 'fastening|khóa, dây buộc; việc cài'], ['fasten|cài chặt', 'unfasten|mở khóa, tháo dây'], ['fastened|đã cài, đã buộc'], []), [
      compare('tie', 'buộc bằng dây hoặc nút thắt', 'Cụ thể hơn fasten: thường cần dây và nút thắt.', 'Tie the rope to the pole.', 'Buộc dây vào cột.'),
      compare('secure', 'giữ chắc, cố định', 'Nhấn mạnh vật không bị di chuyển hoặc rơi; không quy định phải dùng khóa hay dây.', 'Secure the shelf to the wall.', 'Cố định kệ vào tường.'),
    ]),
  fold: entry('gấp, gập lại', 'Fold giấy, vải hoặc vật có thể gập. Fold your arms là khoanh tay; unfold là mở phần đã gấp.',
    family(['fold|nếp gấp', 'folding|việc gấp'], ['fold|gấp', 'unfold|mở ra, trải ra'], ['folded|được gấp', 'folding|có thể gập, loại gập', 'foldable|gập được'], []), [
      compare('bend', 'uốn, cong, cúi', 'Không nhất thiết tạo nếp gấp hoặc chồng hai phần lên nhau như fold.', 'Bend your knees slightly.', 'Hơi khuỵu đầu gối.'),
      compare('crease', 'làm có nếp, làm nhàu', 'Nhấn mạnh đường hoặc nếp xuất hiện trên giấy, vải; thường nói về kết quả.', 'Sitting down creased his trousers.', 'Ngồi xuống làm quần anh ấy có nếp nhăn.'),
    ]),
  gather: entry('tập hợp; thu thập; tụ họp', 'Gather người hoặc đồ về một chỗ; gather information là thu thập thông tin. I gather that còn là tôi hiểu hoặc suy ra rằng.',
    family(['gathering|buổi tụ họp', 'gatherer|người thu thập'], ['gather|tập hợp'], ['gathered|được tập hợp, được thu thập'], []), [
      compare('collect', 'thu thập', 'Hay gợi thu gom có mục đích hoặc theo một tập hợp, như tem, dữ liệu, tiền.', 'She collects old postcards.', 'Cô ấy sưu tầm bưu thiếp cũ.'),
      compare('assemble', 'tập hợp; lắp ráp', 'Trang trọng hơn khi tập hợp người; với đồ vật còn là lắp các bộ phận thành một thứ.', 'The workers assembled the machine.', 'Công nhân lắp ráp chiếc máy.'),
    ]),
  guard: entry('canh gác; bảo vệ', 'Guard thường nhấn mạnh theo dõi, canh giữ người hoặc địa điểm để ngăn nguy hiểm hay tiếp cận trái phép.',
    family(['guard|người bảo vệ; bộ phận chắn', 'guardian|người giám hộ, người bảo vệ'], ['guard|canh gác'], ['guarded|thận trọng, dè dặt; được bảo vệ', 'unguarded|không được bảo vệ; thiếu đề phòng'], ['guardedly|một cách dè dặt']), [
      compare('protect', 'bảo vệ', 'Rộng hơn canh gác: bảo vệ sức khỏe, quyền lợi hoặc đồ vật khỏi tổn hại.', 'Sunscreen protects your skin.', 'Kem chống nắng bảo vệ làn da.'),
      compare('defend', 'bảo vệ, chống lại', 'Thường có sự tấn công hoặc chỉ trích cần chống lại, bằng hành động hay lập luận.', 'She defended her decision.', 'Cô ấy bảo vệ quyết định của mình.'),
    ]),
  hurry: entry('vội, làm nhanh; thúc giục', 'Hurry nói về làm hoặc di chuyển nhanh vì ít thời gian; in a hurry là đang vội.',
    family(['hurry|sự vội vàng'], ['hurry|vội, thúc giục'], ['hurried|vội vàng', 'unhurried|thong thả'], ['hurriedly|một cách vội vàng', 'unhurriedly|một cách thong thả']), [
      compare('rush', 'vội vã, lao nhanh', 'Thường gợi nhanh và gấp hơn, đôi khi làm thiếu cẩn thận hoặc đột ngột.', 'Do not rush your answer.', 'Đừng trả lời quá vội.'),
      compare('hasten', 'làm nhanh hơn, đẩy nhanh', 'Trang trọng hơn; cũng dùng cho việc làm một sự kiện xảy ra sớm hơn.', 'The new road hastened development.', 'Con đường mới đẩy nhanh sự phát triển.', 'Trang trọng'),
    ]),
  indicate: entry('chỉ ra; cho thấy; ra tín hiệu', 'Indicate thường là cho thấy một dấu hiệu hoặc thông tin, chưa nhất thiết chứng minh chắc chắn. Indicate that + mệnh đề.',
    family(['indication|dấu hiệu, sự chỉ ra', 'indicator|chỉ báo; đèn báo'], ['indicate|chỉ ra'], ['indicative|cho thấy, biểu thị'], []), [
      compare('show', 'cho thấy, chỉ cho xem', 'Từ rộng và tự nhiên hơn; có thể trực tiếp làm cho người khác thấy điều gì.', 'Show me the photo.', 'Cho tôi xem bức ảnh.'),
      compare('suggest', 'gợi ra, cho thấy có thể', 'Khi nói về bằng chứng, thường nhấn mạnh khả năng hơn là kết luận chắc chắn.', 'The results suggest a connection.', 'Kết quả gợi ra khả năng có một mối liên hệ.'),
    ]),
  investigate: entry('điều tra; tìm hiểu kỹ', 'Investigate thường tìm sự thật, nguyên nhân hoặc chi tiết một vấn đề theo cách có hệ thống.',
    family(['investigation|cuộc điều tra', 'investigator|người điều tra'], ['investigate|điều tra'], ['investigative|thuộc hoạt động điều tra'], []), [
      compare('examine', 'xem xét kỹ', 'Tập trung quan sát, kiểm tra đối tượng; không nhất thiết điều tra cả một vụ việc.', 'The doctor examined my hand.', 'Bác sĩ kiểm tra bàn tay tôi.'),
      compare('look into', 'tìm hiểu, xem xét', 'Cụm tự nhiên trong giao tiếp, thường dùng khi hứa xem xét một vấn đề.', 'We will look into your complaint.', 'Chúng tôi sẽ xem xét khiếu nại của bạn.', 'Giao tiếp'),
    ]),
  label: entry('dán nhãn; gán là', 'Label a box: dán nhãn hộp. Label someone as something: gán cho ai một loại hoặc đặc điểm, đôi khi mang tính đánh giá.',
    family(['label|nhãn, tên gọi', 'labeling|việc dán hoặc gán nhãn'], ['label|dán nhãn', 'relabel|dán nhãn lại'], ['labeled|được dán nhãn', 'unlabeled|không có nhãn'], []), [
      compare('tag', 'gắn thẻ', 'Hay dùng với thẻ nhận diện, giá hoặc nội dung số; thường là một nhãn ngắn.', 'Tag the photo with her name.', 'Gắn thẻ tên cô ấy vào ảnh.'),
      compare('classify', 'phân loại', 'Nhấn mạnh xếp vào hệ thống nhóm theo tiêu chí, không chỉ đặt một nhãn.', 'Classify the books by subject.', 'Phân loại sách theo chủ đề.'),
    ]),
  lack: entry('thiếu, không có đủ', 'Lack something là động từ, không dùng of sau động từ. A lack of something là cụm danh từ.',
    family(['lack|sự thiếu'], ['lack|thiếu'], ['lacking|thiếu, không có đủ'], []), [
      compare('be short of', 'thiếu, chưa đủ', 'Thường nhấn mạnh số lượng ít hơn mức cần, đặc biệt tiền, thời gian, nhân lực.', 'We are short of time.', 'Chúng tôi không có đủ thời gian.'),
      compare('be missing', 'bị thiếu, không có mặt', 'Gợi thứ đáng lẽ phải có nhưng không thấy, như phần bị thất lạc hoặc thiếu khỏi bộ.', 'One page is missing.', 'Có một trang bị thiếu.'),
    ]),
  lead: entry('dẫn dắt; dẫn đầu', 'Ở đây học lead /liːd/ = dẫn dắt; quá khứ là led /led/. Danh từ lead /led/ = kim loại chì là từ đồng hình khác nghĩa.',
    family(['leader|người lãnh đạo', 'leadership|khả năng, vai trò lãnh đạo', 'lead|vị trí dẫn đầu; đầu mối'], ['lead|dẫn dắt'], ['leading|đứng đầu, hàng đầu', 'leaderless|không có người lãnh đạo'], []), [
      compare('guide', 'hướng dẫn', 'Nhấn mạnh chỉ đường hoặc giúp ai biết cách làm, không nhất thiết nắm quyền lãnh đạo.', 'She guided us through the museum.', 'Cô ấy hướng dẫn chúng tôi đi qua bảo tàng.'),
      compare('manage', 'quản lý', 'Nhấn mạnh tổ chức và điều hành công việc; lead nhấn mạnh hướng đi và dẫn dắt con người.', 'He manages a small shop.', 'Anh ấy quản lý một cửa hàng nhỏ.'),
    ]),
  locate: entry('xác định vị trí; đặt ở', 'Locate something thường là tìm ra vị trí của nó. Be located in/near: nằm ở; cách nói mô tả địa điểm.',
    family(['location|vị trí, địa điểm', 'relocation|việc chuyển đến nơi mới'], ['locate|xác định vị trí', 'relocate|chuyển đến nơi mới'], ['located|nằm ở, được đặt tại'], []), [
      compare('find', 'tìm thấy', 'Rộng và tự nhiên hơn; locate thường nhấn mạnh biết chính xác nó ở đâu.', 'I found my keys.', 'Tôi đã tìm thấy chìa khóa.'),
      compare('position', 'đặt vào vị trí', 'Nói về chủ động đặt vật ở một chỗ; không có nghĩa tìm vật đang thất lạc.', 'Position the camera near the door.', 'Đặt máy ảnh gần cửa.'),
    ]),
  measure: entry('đo, đo lường', 'Measure a length, amount hoặc kết quả. Danh từ a measure còn là biện pháp; nghĩa này không phải dụng cụ đo.',
    family(['measure|phép đo; biện pháp', 'measurement|số đo, việc đo'], ['measure|đo'], ['measurable|đo được', 'immeasurable|không thể đo lường, rất lớn', 'measured|thận trọng, có cân nhắc'], ['measurably|đến mức đo được', 'immeasurably|vô cùng']), [
      compare('gauge', 'ước lượng, đánh giá mức độ', 'Thường đánh giá phản ứng, mức độ hoặc tình huống; cũng có thể đo bằng thiết bị.', 'It is hard to gauge his reaction.', 'Khó đánh giá phản ứng của anh ấy.'),
      compare('estimate', 'ước tính', 'Đưa ra con số gần đúng khi chưa đo hoặc biết chính xác.', 'We estimated the cost at $200.', 'Chúng tôi ước tính chi phí là 200 đô la.'),
    ]),
  move: entry('di chuyển; làm cảm động', 'Move có nghĩa đổi vị trí hoặc nơi ở. A moving story là câu chuyện gây cảm động, không phải câu chuyện đang di chuyển.',
    family(['movement|sự chuyển động; phong trào', 'mover|người chuyển đồ'], ['move|di chuyển'], ['moving|gây cảm động; đang chuyển động', 'movable|di chuyển được', 'unmoved|không xúc động'], ['movingly|một cách cảm động']), [
      compare('shift', 'dịch chuyển, thay đổi', 'Thường là đổi vị trí, trọng tâm hoặc hướng, đôi khi chỉ một khoảng nhỏ.', 'Shift the chair to the left.', 'Dịch chiếc ghế sang trái.'),
      compare('relocate', 'chuyển địa điểm', 'Nhấn mạnh chuyển nơi ở hoặc nơi làm việc đến địa điểm mới; thường trang trọng hơn move.', 'The company relocated to Hanoi.', 'Công ty chuyển địa điểm đến Hà Nội.'),
    ]),
  note: entry('ghi lại; lưu ý, nhận thấy', 'Note a detail có thể là ghi lại hoặc nhận thấy chi tiết. Take notes là ghi chép; note that là lưu ý rằng.',
    family(['note|ghi chú; nốt nhạc; tờ tiền', 'notebook|sổ ghi chép'], ['note|ghi lại, nhận thấy'], ['noted|nổi tiếng về điều gì', 'notable|đáng chú ý'], ['notably|đặc biệt là; đáng chú ý']), [
      compare('notice', 'nhận thấy', 'Nhấn mạnh phát hiện bằng giác quan hoặc sự chú ý; không nhất thiết ghi lại.', 'I noticed a small mistake.', 'Tôi nhận thấy một lỗi nhỏ.'),
      compare('record', 'ghi lại, lưu lại', 'Nhấn mạnh tạo hồ sơ hoặc bản ghi để dùng về sau, thường có hệ thống hơn một ghi chú.', 'Record the temperature every hour.', 'Ghi lại nhiệt độ mỗi giờ.'),
    ]),
  occur: entry('xảy ra; xuất hiện', 'Occur thường trang trọng hơn happen. Occur to someone: một ý nghĩ chợt nảy ra với ai; không phải sự kiện xảy ra cho ai.',
    family(['occurrence|sự việc xảy ra; sự xuất hiện', 'recurrence|sự tái diễn'], ['occur|xảy ra', 'recur|tái diễn'], ['recurrent|tái diễn nhiều lần'], ['recurrently|một cách lặp lại']), [
      compare('happen', 'xảy ra', 'Tự nhiên nhất trong giao tiếp, dùng cho sự kiện ngẫu nhiên hoặc bất kỳ điều xảy ra nào.', 'What happened yesterday?', 'Hôm qua đã xảy ra chuyện gì?'),
      compare('take place', 'diễn ra', 'Thường dùng cho sự kiện, hoạt động có địa điểm hoặc thời gian, hay đã được tổ chức.', 'The meeting takes place on Friday.', 'Cuộc họp diễn ra vào thứ Sáu.'),
    ]),
  pack: entry('đóng gói; xếp hành lý', 'Pack a bag hoặc pack clothes: xếp đồ vào túi. Pack còn là bó, gói hoặc nhóm trong vai trò danh từ.',
    family(['pack|gói, bộ; nhóm', 'packing|việc đóng gói; vật liệu chèn', 'packer|người đóng gói'], ['pack|đóng gói', 'unpack|lấy đồ ra khỏi hành lý', 'repack|đóng gói lại'], ['packed|chật kín; đã đóng gói'], []), [
      compare('wrap', 'bọc, gói bên ngoài', 'Nhấn mạnh phủ giấy hoặc vật liệu quanh đồ vật; pack thường là xếp vào túi hay thùng.', 'Wrap the gift in paper.', 'Bọc món quà bằng giấy.'),
      compare('load', 'xếp hàng lên', 'Nhấn mạnh đưa đồ vào xe, máy hoặc phương tiện; không nhất thiết gói từng món.', 'Load the boxes into the van.', 'Xếp các thùng vào xe tải nhỏ.'),
    ]),
  participate: entry('tham gia', 'Participate in an activity: tham gia hoạt động, thường có đóng góp hoặc thực hiện một phần, không chỉ có mặt.',
    family(['participation|sự tham gia', 'participant|người tham gia'], ['participate|tham gia'], ['participating|đang tham gia', 'participatory|có sự tham gia chủ động'], []), [
      compare('join', 'tham gia, gia nhập', 'Nhấn mạnh trở thành thành viên hoặc bắt đầu cùng làm gì; tự nhiên trong lời mời.', 'Join us for dinner.', 'Tham gia bữa tối cùng chúng tôi nhé.'),
      compare('attend', 'tham dự, có mặt', 'Chỉ sự hiện diện tại sự kiện; bạn có thể attend nhưng không phát biểu hay tham gia tích cực.', 'She attended the conference.', 'Cô ấy tham dự hội nghị.'),
    ]),
  pull: entry('kéo', 'Pull thường tạo lực đưa vật về phía mình hoặc theo hướng đang kéo. Trái hướng với push trong nhiều tình huống.',
    family(['pull|cú kéo, lực kéo', 'puller|người hoặc dụng cụ kéo'], ['pull|kéo'], ['pulled|bị kéo; bị giãn cơ'], []), [
      compare('drag', 'kéo lê', 'Nhấn mạnh kéo vật dọc bề mặt, thường vì nặng hoặc khó di chuyển.', 'He dragged the box across the floor.', 'Anh ấy kéo lê thùng trên sàn.'),
      compare('tug', 'giật, kéo mạnh từng nhịp', 'Thường là một cú kéo nhanh hoặc nhiều cú kéo ngắn, thay vì lực kéo đều.', 'The child tugged at my sleeve.', 'Đứa trẻ giật nhẹ tay áo tôi.'),
    ]),
  push: entry('đẩy; thúc giục', 'Push a door: đẩy cửa. Push someone to do something: thúc hoặc gây áp lực để ai làm gì.',
    family(['push|cú đẩy; nỗ lực thúc đẩy', 'pusher|người hoặc bộ phận đẩy'], ['push|đẩy'], ['pushy|hay lấn tới, áp đặt'], ['pushily|một cách lấn tới, áp đặt']), [
      compare('shove', 'xô, đẩy mạnh', 'Mạnh hoặc thô bạo hơn push; thường gợi thiếu nhẹ nhàng.', 'He shoved the door open.', 'Anh ấy xô mạnh cửa ra.'),
      compare('press', 'ấn, ép', 'Nhấn mạnh lực lên một bề mặt hoặc nút; vật không nhất thiết di chuyển xa.', 'Press the green button.', 'Ấn nút màu xanh.'),
    ]),
  reflect: entry('phản chiếu; phản ánh; suy ngẫm', 'Reflect light là phản chiếu ánh sáng; reflect a change là phản ánh thay đổi; reflect on something là suy ngẫm về điều đó.',
    family(['reflection|sự phản chiếu; sự suy ngẫm', 'reflector|vật phản quang'], ['reflect|phản chiếu, suy ngẫm'], ['reflective|phản quang; trầm tư'], ['reflectively|một cách trầm tư']), [
      compare('mirror', 'phản chiếu, giống sát', 'Ở nghĩa bóng, nhấn mạnh tái hiện hoặc giống gần như tương ứng với điều khác.', 'The results mirror last year’s figures.', 'Kết quả gần giống các số liệu năm ngoái.'),
      compare('consider', 'cân nhắc, xem xét', 'Trong nghĩa suy nghĩ, thường hướng đến đánh giá hay quyết định; reflect on thiên về suy ngẫm lại.', 'Consider all the options first.', 'Hãy cân nhắc mọi lựa chọn trước.'),
    ]),
  reject: entry('từ chối chấp nhận; bác bỏ', 'Reject an application, idea hoặc claim: không chấp nhận sau khi xem xét. Không phải lúc nào cũng thay được refuse.',
    family(['rejection|sự từ chối', 'reject|vật bị loại do không đạt yêu cầu'], ['reject|bác bỏ'], ['rejected|bị từ chối'], []), [
      compare('refuse', 'từ chối', 'Hay dùng refuse to do something hoặc refuse an offer. Reject thường đi với vật, đề xuất, hồ sơ.', 'She refused to sign the form.', 'Cô ấy từ chối ký biểu mẫu.'),
      compare('decline', 'từ chối một cách lịch sự', 'Hay dùng cho lời mời hoặc đề nghị, giọng nhẹ và lịch sự hơn reject.', 'He politely declined the invitation.', 'Anh ấy lịch sự từ chối lời mời.', 'Lịch sự'),
    ]),
  remain: entry('vẫn còn; vẫn ở trạng thái nào đó', 'Remain + tính từ: vẫn ở trạng thái đó, như remain calm. The remaining time là thời gian còn lại.',
    family(['remainder|phần còn lại', 'remains|tàn tích; hài cốt'], ['remain|vẫn còn, ở lại'], ['remaining|còn lại'], []), [
      compare('stay', 'ở lại, giữ trạng thái', 'Tự nhiên hơn trong giao tiếp; remain thường trang trọng hơn và nhấn mạnh trạng thái không đổi.', 'Please stay calm.', 'Hãy bình tĩnh.'),
      compare('last', 'kéo dài, bền', 'Nhấn mạnh thời lượng hoặc độ bền; không thay remain trong remain calm.', 'The battery lasts all day.', 'Pin dùng được cả ngày.'),
    ]),
  repair: entry('sửa chữa; khắc phục hư hỏng', 'Repair nói về làm một vật hỏng hoạt động hoặc nguyên vẹn trở lại; cũng dùng với thiệt hại, quan hệ.',
    family(['repair|việc sửa chữa', 'repairer|người sửa chữa'], ['repair|sửa chữa'], ['repairable|sửa được', 'irreparable|không thể khắc phục'], ['irreparably|đến mức không thể khắc phục']), [
      compare('fix', 'sửa, xử lý', 'Tự nhiên trong giao tiếp và rộng hơn: sửa đồ vật, lỗi phần mềm hay một vấn đề.', 'Can you fix this error?', 'Bạn sửa lỗi này được không?', 'Giao tiếp'),
      compare('mend', 'vá, sửa', 'Hay dùng với vải, vật rách hoặc hỏng nhỏ; cũng dùng cho hàn gắn quan hệ.', 'She mended the hole in my shirt.', 'Cô ấy vá lỗ trên áo tôi.'),
    ]),
  rise: entry('tăng lên; đi lên; mọc lên', 'Rise không cần tân ngữ: prices rise. Raise cần thứ được làm tăng: raise prices. Quá khứ rise → rose; phân từ risen.',
    family(['rise|sự tăng; đà đi lên', 'riser|người dậy vào giờ nào đó; mặt đứng bậc thang'], ['rise|tăng lên'], ['rising|đang tăng, đang đi lên'], []), [
      compare('increase', 'tăng, làm tăng', 'Dùng được cả có và không có tân ngữ: prices increase; increase prices.', 'Demand increased this month.', 'Nhu cầu tăng trong tháng này.'),
      compare('raise', 'làm tăng, nâng lên', 'Cần tân ngữ; ai hoặc điều gì đó làm cho một thứ tăng lên. Không thay rise trực tiếp.', 'The shop raised its prices.', 'Cửa hàng đã tăng giá.'),
    ]),
  separate: entry('tách riêng; riêng biệt', 'Separate A from B: tách A khỏi B. Động từ đọc /ˈsepəreɪt/, tính từ đọc /ˈsepərət/.',
    family(['separation|sự tách rời', 'separator|vật hoặc bộ phận phân tách'], ['separate|tách riêng'], ['separate|riêng biệt', 'separable|có thể tách', 'inseparable|không thể tách'], ['separately|một cách riêng biệt', 'inseparably|không thể tách rời']), [
      compare('divide', 'chia', 'Thường chia một tổng thể thành các phần; separate có thể tách những vật vốn riêng biệt.', 'Divide the cake into six pieces.', 'Chia bánh thành sáu miếng.'),
      compare('isolate', 'cô lập, cách ly', 'Nhấn mạnh tách hoàn toàn khỏi tiếp xúc hoặc ảnh hưởng, như người bệnh hay một biến số.', 'The patient was isolated.', 'Bệnh nhân được cách ly.'),
    ]),
  shake: entry('lắc; rung; làm run', 'Shake có thể tự rung hoặc làm vật khác rung. Shake hands: bắt tay. Quá khứ shook; phân từ shaken.',
    family(['shake|cú lắc', 'shaker|người hoặc dụng cụ lắc'], ['shake|lắc, rung'], ['shaky|run, không vững; thiếu chắc chắn', 'shaken|bị sốc, bàng hoàng'], ['shakily|một cách run rẩy']), [
      compare('tremble', 'run rẩy', 'Thường tự run do sợ, lạnh hoặc xúc động; không dùng cho chủ động lắc một chai.', 'Her hands trembled with fear.', 'Tay cô ấy run vì sợ.'),
      compare('vibrate', 'rung, dao động', 'Thường rung nhanh và đều, hay nói về máy móc, điện thoại hoặc sóng.', 'My phone vibrated in my pocket.', 'Điện thoại rung trong túi tôi.'),
    ]),
  store: entry('cất giữ; lưu trữ', 'Store vật hoặc dữ liệu để dùng về sau. Store trong tiếng Anh Mỹ còn là cửa hàng; storage là việc hoặc không gian lưu trữ.',
    family(['store|cửa hàng; lượng dự trữ', 'storage|việc lưu trữ; chỗ chứa', 'storeroom|phòng chứa đồ'], ['store|cất giữ'], ['stored|được lưu trữ'], []), [
      compare('keep', 'giữ', 'Rộng hơn, không nhất thiết sắp xếp để dùng về sau; keep a promise là giữ lời hứa.', 'Keep this receipt.', 'Giữ hóa đơn này.'),
      compare('save', 'lưu; để dành', 'Với dữ liệu, nhấn mạnh thao tác ghi lại; với tiền, là dành lại thay vì tiêu.', 'Save the document before closing it.', 'Lưu tài liệu trước khi đóng.'),
    ]),
  survive: entry('sống sót; vượt qua khó khăn', 'Survive an accident: sống sót qua tai nạn. Survive on something: sống dựa vào một nguồn thức ăn hoặc tiền.',
    family(['survival|sự sống sót', 'survivor|người sống sót'], ['survive|sống sót'], ['surviving|còn sống, còn tồn tại', 'survivable|có thể sống sót qua'], []), [
      compare('live', 'sống', 'Rộng, nói về sự sống hoặc nơi ở; survive nhấn mạnh sống tiếp qua nguy hiểm hay khó khăn.', 'She lives in Da Nang.', 'Cô ấy sống ở Đà Nẵng.'),
      compare('endure', 'chịu đựng; tồn tại lâu', 'Nhấn mạnh chịu đựng điều khó chịu hoặc bền qua thời gian, không nhất thiết nguy hiểm đến tính mạng.', 'They endured years of hardship.', 'Họ chịu đựng nhiều năm khó khăn.'),
    ]),
  translate: entry('dịch sang ngôn ngữ khác', 'Translate from A into B: dịch từ ngôn ngữ A sang B. Translate something into action còn là chuyển điều đó thành hành động.',
    family(['translation|bản dịch, việc dịch', 'translator|người hoặc công cụ dịch'], ['translate|dịch'], ['translated|được dịch', 'translatable|dịch được', 'untranslatable|khó hoặc không thể chuyển dịch đầy đủ'], []), [
      compare('interpret', 'phiên dịch; diễn giải', 'Trong nghề ngôn ngữ thường là dịch lời nói; translate thường là dịch văn bản, nhưng cũng có thể nói về lời nói.', 'She interpreted for the visitors.', 'Cô ấy phiên dịch cho khách.'),
      compare('paraphrase', 'diễn đạt lại', 'Dùng lời khác trong cùng ngôn ngữ để nói lại ý; không nhất thiết chuyển ngôn ngữ.', 'Paraphrase the sentence in simpler words.', 'Diễn đạt lại câu bằng từ đơn giản hơn.'),
    ]),
  treat: entry('đối xử; điều trị; đãi', 'Treat someone well: đối xử tốt; treat an illness: điều trị bệnh; treat someone to lunch: mời ai ăn trưa.',
    family(['treatment|sự đối xử; cách điều trị', 'treat|món ngon; điều thú vị'], ['treat|đối xử, điều trị'], ['treated|được xử lý hoặc điều trị', 'untreated|chưa điều trị', 'treatable|điều trị được'], []), [
      compare('cure', 'chữa khỏi', 'Nhấn mạnh bệnh được loại bỏ; treat là điều trị, chưa khẳng định đã khỏi.', 'The medicine cured the infection.', 'Thuốc đã chữa khỏi tình trạng nhiễm trùng.'),
      compare('handle', 'xử lý, ứng phó', 'Nhấn mạnh cách xử lý tình huống hoặc đối tượng; không tự mang nghĩa điều trị hay mời ăn.', 'She handled the complaint calmly.', 'Cô ấy bình tĩnh xử lý khiếu nại.'),
    ]),
  weigh: entry('cân; có trọng lượng; cân nhắc', 'Weigh a bag: cân túi; the bag weighs 5 kilos: túi nặng 5 kg. Weigh the options: cân nhắc các lựa chọn.',
    family(['weight|trọng lượng', 'weighing|việc cân', 'weightlessness|tình trạng không trọng lượng'], ['weigh|cân, cân nhắc', 'weight|gắn thêm trọng lượng; đặt trọng số'], ['weighted|có gắn trọng lượng, có trọng số', 'weightless|không trọng lượng', 'weighty|nặng; quan trọng'], ['weightlessly|trong trạng thái không trọng lượng']), [
      compare('measure', 'đo', 'Rộng hơn, dùng cho chiều dài, nhiệt độ và lượng; weigh chỉ đo trọng lượng trong nghĩa vật lý.', 'Measure the length of the bag.', 'Đo chiều dài của túi.'),
      compare('consider', 'cân nhắc', 'Gần weigh trong nghĩa suy nghĩ; weigh nhấn mạnh đánh giá ưu, nhược hoặc các yếu tố đối lập.', 'Consider the risks before deciding.', 'Cân nhắc rủi ro trước khi quyết định.'),
    ]),
};

export const CHECKED_REFERENCES = {
  afford: [{ title: 'Cambridge · afford', url: 'https://dictionary.cambridge.org/dictionary/english/afford' }],
  assist: [{ title: 'Cambridge · assist', url: 'https://dictionary.cambridge.org/dictionary/english/assist' }],
  lead: [{ title: 'Cambridge · lead', url: 'https://dictionary.cambridge.org/us/dictionary/english/lead' }],
  rise: [{ title: 'Cambridge · raise or rise?', url: 'https://dictionary.cambridge.org/us/grammar/british-grammar/raise-or-rise' }],
};
