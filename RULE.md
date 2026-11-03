# AILD – AI Learning & Development

Hệ thống đánh giá năng lực sử dụng AI của sinh viên và đưa ra gợi ý bổ sung kiến thức, kỹ năng còn thiếu.

## 1. Mục tiêu đề tài

Xây dựng phần mềm nền Web (Spring Boot + Next.js) để:
- Đánh giá năng lực sử dụng AI của sinh viên theo khung tiêu chí có căn cứ
- Trên cơ sở kết quả đánh giá, đưa ra gợi ý cá nhân hóa để sinh viên bổ sung kiến thức/kỹ năng còn thiếu

## 2. Căn cứ khung tiêu chí chấm điểm

Khung đánh giá dựa trên **2 nguồn**, có cấu trúc trùng khớp nhau:

- **QĐ số 3439/QĐ-BGDĐT** (15/12/2025, Bộ GD-ĐT) — Khung nội dung thí điểm giáo dục AI cho học sinh phổ thông. Dùng làm căn cứ pháp lý trong nước.
- **UNESCO AI Competency Framework for Students (AI CFS, 2024)** — Miao, F. & Shiohira, K., UNESCO. Dùng làm căn cứ học thuật quốc tế, cung cấp thang đo chi tiết.
  Nguồn: https://unesdoc.unesco.org/ark:/48223/pf0000391105

> Lưu ý: QĐ 3439 dành cho học sinh phổ thông, không có văn bản chính thức riêng cho sinh viên đại học tại Việt Nam ở thời điểm thực hiện đồ án. Đồ án áp dụng khung 4 miền của QĐ 3439/UNESCO làm trục, nâng bậc độ khó theo thang Bloom phù hợp trình độ đại học.

### Ma trận năng lực 4 miền × 3 mức (12 ô)

| Miền năng lực | Understand | Apply | Create |
|---|---|---|---|
| Human-centred Mindset | ✓ | ✓ | ✓ |
| AI Ethics | ✓ | ✓ | ✓ |
| AI Techniques & Applications | ✓ | ✓ | ✓ |
| AI System Design | ✓ | ✓ | ✓ |

Mỗi câu hỏi/bài thực hành trong ngân hàng câu hỏi được gán vào đúng 1 trong 12 ô này.

## 3. Vai trò người dùng

Chỉ 2 vai trò: **Sinh viên** (người được đánh giá) và **Admin** (quản trị nội dung + hệ thống). Không có vai trò Giảng viên, không có bảng xếp hạng (leaderboard) — vì mô hình Adaptive Testing khiến mỗi sinh viên gặp bộ câu hỏi độ khó khác nhau, so sánh điểm trực tiếp giữa người với người không công bằng. Hệ thống tập trung đo tiến trình cá nhân, không so sánh xã hội.

## 4. Kiến trúc & Tech stack

- **Frontend**: Next.js
- **Backend**: Spring Boot
- **Database**: MySQL 8.0 (schema sinh từ JPA entity, xem `aild_database_schema.sql`)
- **AI**: gọi API model có sẵn (không train/fine-tune riêng), kết hợp prompt engineering + rule-based logic

### Nguyên tắc kiến trúc: Hybrid — Rule-based Control Layer + LLM Reasoning Layer

Mọi lời gọi AI đều được bọc bởi lớp thuật toán kiểm soát, AI không bao giờ tự quyết định một mình:

| Nơi gọi AI | AI làm gì | Thuật toán/logic bọc ngoài |
|---|---|---|
| AI-Grading Service | Chấm điểm dựa trên rubric + câu trả lời | Self-consistency check, ngưỡng confidence, quyết định lưu điểm hay đẩy review |
| AI-Interviewer (giai đoạn 3, tùy chọn) | Sinh câu follow-up | Đếm số lượt follow-up (hard limit), timeout, state machine chuyển câu neo |
| Recommendation Engine | (nếu dùng) diễn đạt lại gợi ý | Toàn bộ việc chọn tài nguyên là SQL query có điều kiện, AI không tham gia chọn |
| AI soạn câu hỏi (RAG) | Soạn câu hỏi dựa trên đoạn tài liệu nguồn được truy xuất, bắt buộc trích dẫn | Lọc đoạn theo đúng miền (SQL), xếp hạng bằng cosine theo ô, kiểm tra trích dẫn bằng code, dedup + retry tối đa 3 lần (mục 9) |

### Module lõi backend

| Module | Vai trò |
|---|---|
| Assessment Engine | Chấm rule-based cho trắc nghiệm, tổng hợp điểm |
| AI-Grading Service | Chấm phần thực hành/tự luận có kiểm soát |
| Adaptive Testing Engine | Chọn câu tiếp theo dựa trên performance, không dùng AI (mục 6) |
| Recommendation Engine | Ghép nối điểm yếu với tài nguyên trong kho (truy vấn SQL có điều kiện) |
| Knowledge Retriever (RAG) | Cắt tài liệu nguồn thành đoạn, embedding, tự gán miền năng lực, truy xuất đoạn cho AI soạn câu hỏi (mục 9) |
| Certificate Service | Sinh chứng chỉ số + mã xác thực (mục 5) |

## 5. Tính năng đặc biệt #1 — Chứng chỉ năng lực có thể xác thực

Sau khi hoàn thành đánh giá, hệ thống sinh 1 chứng chỉ số (PDF) ghi rõ mức đạt được ở từng miền, kèm mã xác thực công khai để bên thứ 3 kiểm tra tính xác thực.

- **Cơ chế**: sinh hash SHA-256 từ (student_id + node/domain + completed_at) làm mã xác thực duy nhất
- **Endpoint public**: `/verify/{code}` — tra cứu chứng chỉ có thật không, tránh giả mạo
- **Không dùng AI** — thuần túy PDF generation (Apache PDFBox/iText) + logic hash
- **Giá trị**: sinh viên có thể đưa vào CV/LinkedIn, tăng tính ứng dụng thực tế của đề tài

## 6. Tính năng đặc biệt #2 — Đề thi thích ứng (Adaptive Testing)

Hệ thống chọn câu tiếp theo dựa trên kết quả các câu trước, thay vì cho làm hết 1 bộ cố định — dựa trên nguyên lý đo lường giáo dục (Classical Test Theory), không dùng AI/ML.

- **Cơ chế**: dùng `difficulty_index` (item analysis) làm cơ sở chọn câu — đúng liên tiếp → tăng độ khó (tiến lên mức tiếp theo); sai → giữ/hạ độ khó; dừng khi đạt độ tin cậy ước lượng đủ (sai số chuẩn ước lượng SEM)
- **Không dùng AI** — thuật toán chọn câu thuần túy, chạy trong Adaptive Testing Engine (Spring Boot)
- **Giá trị**: giảm số câu cần làm, đo chính xác hơn theo đúng năng lực thực tế của từng sinh viên

## 7. Tính năng đặc biệt #3 — Cây kỹ năng (Skill Tree)

Thay vì chỉ hiện radar chart tĩnh, 12 ô của ma trận 4×3 hiển thị dạng cây kỹ năng có node liên kết prerequisite (đạt Understand mới mở khóa Apply, đạt Apply mới mở Create). Đây là lớp UI hiển thị trực tiếp kết quả của Adaptive Testing Engine — không phải tính năng tách rời.

### Nguyên tắc quan trọng: trạng thái node là monotonic (chỉ tăng, không giảm)

Vấn đề đã xử lý: nếu sinh viên làm tốt lần đầu rồi làm dở lần sau, node **không được phép tụt hạng** — giống cách chứng chỉ thật (bằng lái xe, IELTS) không bị thu hồi dù năng lực sau này giảm. Nhưng hệ thống vẫn cần biết để gợi ý ôn tập kịp thời. Giải pháp: **tách 2 khái niệm ra 2 field riêng**.

| Thành phần | Dựa vào | Có bị tụt khi làm dở sau đó không |
|---|---|---|
| Skill Tree hiển thị | `status` (monotonic — chỉ tăng) | Không |
| Certificate | `status` + `completed_at` | Không |
| Recommendation Engine | `recent_accuracy` (rolling, N lần gần nhất) | Có phản ánh, gợi ý ôn lại, nhưng không hạ status |

- **Không dùng AI** — graph traversal + rule đơn giản, chạy hoàn toàn ở backend

## 8. Chức năng theo vai trò

### Sinh viên — 1 trang duy nhất (all-in-one dashboard)

- **Skill Tree** — hiển thị 12 node theo domain × level, trạng thái Locked/Unlocked/Completed, có icon "gợi ý ôn lại" nếu `recent_accuracy` thấp dù node đã Completed
- Danh sách gợi ý tài nguyên, ưu tiên node yếu nhất
- Nút bắt đầu làm 1 node cụ thể → mở full-screen overlay, câu hỏi được chọn theo Adaptive Testing Engine
- Tải chứng chỉ đã đạt được cho từng node/miền hoàn thành

> Không có trang "Lịch sử" riêng — bản thân Skill Tree đã là lịch sử trực quan (nhìn cây biết ngay đã qua node nào, đang kẹt ở đâu). Dữ liệu chi tiết từng lần thử (`node_attempts`) chỉ dùng ở tầng backend để tính toán, không cần UI riêng.

### Admin — dạng dashboard, gồm các tab

1. **Dashboard tổng quan** — KPI, biểu đồ điểm trung bình theo miền, phân bố mức độ
2. **Bài làm sinh viên (Submissions)** — danh sách bài làm → click xem chi tiết từng câu, điểm AI chấm + bằng chứng + confidence, có thể override điểm, đánh dấu "Reviewed"
3. **Quản lý câu hỏi (Question Bank)** — CRUD câu hỏi, gắn nhãn domain × level, tạo bộ đề theo tỷ lệ phủ ma trận 4×3, gắn `difficulty_index` phục vụ Adaptive Testing
4. **Quản lý tài nguyên (Resources)** — CRUD tài nguyên gợi ý; có chỉ báo coverage 4×3 để tránh thiếu tài nguyên ở ô nào đó
5. **Tài liệu nguồn (Source documents)** — upload PDF khung năng lực (UNESCO AI CFS, QĐ 3439...); độ phủ theo 4 miền (số đoạn); xem danh sách đoạn, sửa miền bị gán sai, bỏ qua/khôi phục đoạn (không bắt buộc duyệt từng đoạn)

## 9. Nguyên tắc kiểm soát AI (chống "bịa")

### AI-Grading Service (rủi ro thấp — AI chỉ so khớp dữ liệu có sẵn)

1. Input = câu trả lời sinh viên (cố định) + rubric admin soạn (cố định)
2. Bắt buộc structured output JSON: điểm từng tiêu chí + trích dẫn bằng chứng
3. Không trích được bằng chứng cụ thể → không cho điểm tiêu chí đó
4. `temperature = 0`
5. Self-consistency check: chấm 2-3 lần, lệch quá ngưỡng → `confidence = LOW` → đẩy Admin duyệt tay
6. Toàn bộ prompt/response được log lại (`ai_call_logs`) phục vụ audit

### Recommendation Engine

1. Tài nguyên 100% do Admin nhập tay, hệ thống không tự tìm trên Internet
2. Logic ghép nối là truy vấn SQL có điều kiện (domain + target_level), không phải AI tự suy luận
3. AI (nếu dùng) chỉ diễn đạt lại câu giới thiệu, không tự thêm tài nguyên ngoài danh sách đã truy vấn

### AI hỗ trợ soạn câu hỏi (tùy chọn, không bắt buộc có)

1. Luôn ở trạng thái `DRAFT`, không bao giờ tự `PUBLISHED`
2. Grounding bằng đoạn tài liệu gốc (QĐ 3439/UNESCO) qua RAG, tránh tự trích sự kiện/số liệu không kiểm chứng được
3. Admin bắt buộc đọc/sửa/xác nhận thủ công mới cho publish — đoạn nguồn được hiển thị ngay cạnh câu Draft để đối chiếu

#### Grounding bằng RAG (Retrieval-Augmented Generation)

**Nạp tài liệu (một lần, chạy nền):**
1. Admin upload PDF → hệ thống trích text (PDFBox), bỏ header/footer lặp lại
2. Cắt thành đoạn ~400 từ theo ranh giới đoạn văn, overlap ~50 từ, giữ số trang
3. Tự loại đoạn rác (`IGNORED`): mục lục, tài liệu tham khảo, đoạn < 50 từ
4. Tính embedding từng đoạn
5. **Tự gán miền**: so cosine giữa embedding đoạn với embedding mô tả 4 miền năng lực → miền giống nhất, độ tin cậy = cosine. Đạt ngưỡng → `ACTIVE` (dùng ngay); dưới ngưỡng → `UNLABELED` (không dùng tới khi Admin gán tay)
   - **Chỉ gán miền, không gán mức Bloom**: embedding đo chủ đề/từ vựng nên phân biệt được miền (đạo đức, kỹ thuật, thiết kế, con người), nhưng không phân biệt được mức tư duy. Cùng một đoạn về thiên kiến có thể ra câu Understand ("thiên kiến là gì"), Apply ("gặp output thiên kiến thì làm gì") hay Create ("thiết kế quy trình kiểm tra thiên kiến"). Đoạn tài liệu cung cấp **kiến thức**; mức Understand/Apply/Create là **cách đặt câu hỏi**, do prompt điều khiển (`levelGuide`)
6. Admin chỉ sửa ngoại lệ (lọc "độ tin cậy thấp"); nhãn Admin gán (`MANUAL`) luôn thắng nhãn máy và được giữ khi xử lý lại

**Khi soạn câu hỏi:**
```
1. RULE  : lấy các đoạn ACTIVE đúng miền Admin chọn — SQL, không AI
2. VECTOR: xếp hạng theo cosine với (lĩnh vực + ghi chú của Admin + mô tả ô domain × level)
           → đoạn hợp với mức được yêu cầu tự nổi lên đầu, không cần gán mức cho đoạn
3. Lần thử i lấy cửa sổ hạng [3(i-1)+1 .. 3i] → retry khi trùng có chất liệu mới
4. Đưa 3 đoạn vào prompt; AI bắt buộc trả "sourceChunkIds"
5. CODE  : sourceChunkIds phải khác rỗng và nằm trong tập vừa đưa vào,
           sai → INVALID_OUTPUT, dùng chung vòng retry tối đa 3 lần
6. Lưu Draft kèm source_chunk_ids; log đoạn đã dùng vào question_generation_attempts
```
- Miền chưa có đoạn nguồn → prompt chạy như trước (không RAG), hệ thống vẫn hoạt động
- Lưu trữ vector: MySQL không có kiểu vector nên embedding lưu dạng JSON, cosine tính trong Java (brute-force sau khi đã lọc theo miền, khoảng vài chục đến vài trăm vector/lần)
- Chỉ so sánh vector cùng embedding model; đổi model → "Xử lý lại" tài liệu
- Chống trùng: (1) upload — so SHA-256 nội dung file với các tài liệu chưa xóa, trùng thì từ chối (đổi tên file vẫn bị phát hiện); (2) truy xuất — đoạn có nội dung giống hệt nhau (cùng tài liệu ở 2 file PDF khác nhau) chỉ giữ đoạn xếp hạng cao nhất
- Xóa tài liệu là xóa mềm (tài liệu + đoạn); đoạn đã xóa không còn được truy xuất, câu hỏi đã soạn giữ nguyên

#### Input bắt buộc từ Admin trước khi gọi AI (không để AI tự chọn)

| Trường | Bắt buộc | Vai trò |
|---|---|---|
| Domain (1 trong 4 miền) | Có | Giữ đúng cấu trúc khung QĐ 3439/UNESCO, không để AI tự chọn miền |
| Level (Understand/Apply/Create) | Có | Quyết định độ khó/bậc Bloom của câu hỏi |
| Loại câu hỏi (Multiple Choice/Practical) | Có | 2 loại có cấu trúc dữ liệu khác nhau, không thể để AI tự quyết định giữa chừng |
| Lĩnh vực áp dụng (y tế, tuyển dụng, giáo dục...) | Tùy chọn | Nếu admin không chọn, hệ thống tự random từ danh sách cố định (không phải AI tự nghĩ ra lĩnh vực) — vừa tăng đa dạng, vừa vẫn có kiểm soát |
| Ghi chú thêm cho AI | Tùy chọn | Định hướng thêm, ví dụ "tập trung vào bias giới tính" |

Nguyên tắc: **domain + level + loại câu hỏi luôn do Admin chỉ định (giữ đúng khung)**, AI chỉ được tự do sáng tạo ở phần nội dung cụ thể bên trong ô đó.

#### Cơ chế chống trùng lặp khi AI sinh nhiều lần (dedup + retry loop)

LLM có xu hướng hội tụ về vài kịch bản điển hình khi được yêu cầu tạo nhiều lần cho cùng 1 ô (domain × level) — cần thuật toán kiểm soát, không dựa vào AI tự "nhớ" để tránh lặp:

```
1. Gọi AI sinh câu hỏi nháp cho ô (domain × level)
2. Tính độ tương đồng (similarity, TF-IDF/Jaccard) với các câu đã có trong cùng ô
3. Nếu similarity < ngưỡng (vd 0.8) → OK, lưu Draft, dừng
4. Nếu similarity >= ngưỡng → gọi lại AI với lĩnh vực áp dụng khác + đưa câu vừa
   trùng vào prompt để AI đổi góc độ
5. Lặp lại bước 2-4, TỐI ĐA 3 lần (hard limit do code kiểm soát, AI không tự
   quyết định khi nào dừng)
6. Hết 3 lần vẫn trùng → dừng, không lưu Draft nào, báo Admin soạn thủ công
```

Giới hạn cứng 3 lần là bắt buộc để tránh vòng lặp gọi API vô hạn nếu AI liên tục hội tụ về cùng kịch bản — đúng nguyên tắc Hybrid Architecture: thuật toán luôn là lớp kiểm soát cuối cùng, không giao quyền quyết định cho AI.

## 10. Cơ chế tự giám sát chất lượng câu hỏi

- Trạng thái câu hỏi: `Draft → Pending Review → Published` (+ `Flagged`)
- Sinh viên có nút "Báo lỗi câu hỏi" khi làm bài
- Item analysis tự động: difficulty index, discrimination index — dữ liệu này cũng chính là input cho Adaptive Testing Engine (mục 6)

## 11. Database

Xem chi tiết: `aild_database_schema.sql`

Các nhóm bảng chính (đã cập nhật thêm 3 nhóm bảng cho tính năng mới):
- `users` — 2 vai trò Student/Admin
- `competency_domains`, `progression_levels` — khung 4×3 cố định
- `questions`, `question_options`, `question_flags`, `question_stats` — ngân hàng câu hỏi + tự giám sát chất lượng (bao gồm `difficulty_index` cho Adaptive Testing)
- `question_sets`, `question_set_items` — bộ đề
- `assessments`, `assessment_answers`, `assessment_domain_scores` — bài làm + kết quả
- `resources`, `recommendation_logs` — kho tài nguyên gợi ý
- `ai_call_logs` — audit toàn bộ lời gọi AI
- **Mới:** `skill_nodes` — trạng thái monotonic (Locked/Unlocked/Completed) + `recent_accuracy` cho từng node của từng sinh viên
- **Mới:** `node_attempts` — log từng lần thử 1 node, phục vụ Adaptive Testing Engine tính điểm và cập nhật `recent_accuracy`
- **Mới:** `certificates` — mã xác thực (hash), ngày cấp, node/domain liên quan
- **Mới:** `question_generation_attempts` — log từng lần AI thử sinh câu hỏi (domain, level, similarity_score, kết quả ACCEPTED/REJECTED_DUPLICATE/INVALID_OUTPUT/FAILED_MAX_RETRY; mỗi lượt sinh kết thúc bằng đúng 1 dòng ACCEPTED hoặc FAILED_MAX_RETRY; `source_chunk_ids` = các đoạn nguồn đưa vào prompt ở lần thử đó), phục vụ audit và số liệu minh chứng hiệu quả chống trùng lặp trong báo cáo
- **Mới (RAG):** `source_documents` — tài liệu nguồn Admin upload (tên, nguồn, năm, số trang, trạng thái PENDING/PROCESSING/READY/FAILED)
- **Mới (RAG):** `source_chunks` — đoạn tài liệu: nội dung, trang, embedding (JSON) + embedding_model, miền đề xuất + độ tin cậy, miền đang dùng + label_source (AUTO/MANUAL), trạng thái ACTIVE/UNLABELED/IGNORED
- `questions.source_chunk_ids` — các đoạn nguồn câu hỏi do AI soạn đã trích dẫn

## 13. Giới hạn đã biết

- Chất lượng gợi ý phụ thuộc hoàn toàn vào việc Admin nhập đủ tài nguyên cho từng ô trong ma trận 4×3
- Chất lượng câu hỏi do AI soạn phụ thuộc độ phủ tài liệu nguồn từng miền (theo dõi ở tab Tài liệu nguồn)
- Truy xuất vector dùng cosine brute-force trong Java, phù hợp quy mô vài trăm đến vài nghìn đoạn; quy mô lớn hơn cần vector DB (pgvector...)
- Tự gán miền bằng so sánh embedding có thể sai với đoạn nói về nhiều miền cùng lúc; ngưỡng tin cậy cần hiệu chỉnh sau khi nạp tài liệu thật
- Đoạn nguồn không được gán mức Bloom; việc câu hỏi đúng mức Understand/Apply/Create phụ thuộc prompt và bước Admin duyệt
- PDF dạng ảnh scan không trích được chữ (không có OCR)
- Không có văn bản pháp lý chính thức riêng cho sinh viên đại học tại Việt Nam ở thời điểm thực hiện đồ án; khung áp dụng là suy rộng có căn cứ từ QĐ 3439 + UNESCO AI CFS 2024
- Không có bảng xếp hạng liên sinh viên (chủ đích, vì Adaptive Testing khiến việc so sánh điểm thô không công bằng)

## 14. Tài liệu tham khảo

1. Quyết định số 3439/QĐ-BGDĐT ngày 15/12/2025 — Bộ Giáo dục và Đào tạo
2. UNESCO, Miao, F. & Shiohira, K. (2024). *AI Competency Framework for Students*. UNESCO. https://unesdoc.unesco.org/ark:/48223/pf0000391105