-- =====================================================================
-- AILD – AI Learning & Development
-- Database Schema (PostgreSQL)
-- Căn cứ: QĐ 3439/QĐ-BGDĐT (15/12/2025) + UNESCO AI Competency
-- Framework for Students (2024) — 4 miền năng lực × 3 mức tiến trình
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. NGƯỜI DÙNG
-- ---------------------------------------------------------------------

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL CHECK (role IN ('STUDENT', 'ADMIN')),
    avatar_url      VARCHAR(255),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. KHUNG NĂNG LỰC CỐ ĐỊNH (4 miền × 3 mức) — nguồn: QĐ 3439 + UNESCO
--    Lưu dạng bảng (không hard-code trong code) để dễ cập nhật khi
--    văn bản có phiên bản mới, nhưng KHÔNG cho Admin sửa qua UI ở MVP.
-- ---------------------------------------------------------------------

CREATE TABLE competency_domains (
    id              SMALLSERIAL PRIMARY KEY,
    code            VARCHAR(30) NOT NULL UNIQUE,   -- HCM, ETHICS, TECH, DESIGN
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    display_order   SMALLINT NOT NULL
);

CREATE TABLE progression_levels (
    id              SMALLSERIAL PRIMARY KEY,
    code            VARCHAR(20) NOT NULL UNIQUE,   -- UNDERSTAND, APPLY, CREATE
    name            VARCHAR(50) NOT NULL,
    display_order   SMALLINT NOT NULL              -- 1,2,3 dùng để so sánh mức
);

-- Seed dữ liệu mặc định (chạy 1 lần khi khởi tạo hệ thống)
INSERT INTO competency_domains (code, name, display_order) VALUES
 ('HCM',    'Human-centred Mindset',          1),
 ('ETHICS', 'AI Ethics',                       2),
 ('TECH',   'AI Techniques & Applications',    3),
 ('DESIGN', 'AI System Design',                4);

INSERT INTO progression_levels (code, name, display_order) VALUES
 ('UNDERSTAND', 'Understand', 1),
 ('APPLY',      'Apply',      2),
 ('CREATE',     'Create',     3);

-- ---------------------------------------------------------------------
-- 3. NGÂN HÀNG CÂU HỎI
-- ---------------------------------------------------------------------

CREATE TABLE questions (
    id              BIGSERIAL PRIMARY KEY,
    domain_id       SMALLINT NOT NULL REFERENCES competency_domains(id),
    level_id        SMALLINT NOT NULL REFERENCES progression_levels(id),
    type            VARCHAR(20) NOT NULL CHECK (type IN ('MULTIPLE_CHOICE', 'PRACTICAL')),
    content         TEXT NOT NULL,
    rubric          TEXT,                          -- bắt buộc có nếu type = PRACTICAL
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                    CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'FLAGGED')),
    created_by      BIGINT NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE question_options (
    id              BIGSERIAL PRIMARY KEY,
    question_id     BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    content         VARCHAR(500) NOT NULL,
    is_correct      BOOLEAN NOT NULL DEFAULT false,
    display_order   SMALLINT NOT NULL
);

-- Sinh viên báo lỗi câu hỏi (đã bàn ở phần "admin tự soạn câu hỏi có sai thì sao")
CREATE TABLE question_flags (
    id              BIGSERIAL PRIMARY KEY,
    question_id     BIGINT NOT NULL REFERENCES questions(id),
    reported_by     BIGINT NOT NULL REFERENCES users(id),
    reason          TEXT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'OPEN'
                    CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED')),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    resolved_at     TIMESTAMP
);

-- Thống kê item analysis (difficulty / discrimination index) — tự động tính
CREATE TABLE question_stats (
    question_id         BIGINT PRIMARY KEY REFERENCES questions(id),
    total_attempts       INT NOT NULL DEFAULT 0,
    correct_count         INT NOT NULL DEFAULT 0,
    difficulty_index      NUMERIC(4,3),             -- % trả lời đúng
    discrimination_index  NUMERIC(4,3),             -- phân biệt giỏi/yếu
    needs_review           BOOLEAN NOT NULL DEFAULT false,
    last_computed_at      TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 4. BỘ ĐỀ (Question Set) — dùng để tạo đề đánh giá theo tỷ lệ 4×3
-- ---------------------------------------------------------------------

CREATE TABLE question_sets (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT true,  -- bộ đề đang dùng cho SV làm bài
    created_by      BIGINT NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE question_set_items (
    question_set_id BIGINT NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
    question_id     BIGINT NOT NULL REFERENCES questions(id),
    display_order   SMALLINT NOT NULL,
    PRIMARY KEY (question_set_id, question_id)
);

-- ---------------------------------------------------------------------
-- 5. BÀI LÀM CỦA SINH VIÊN (Assessment / Submission)
-- ---------------------------------------------------------------------

CREATE TABLE assessments (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES users(id),
    question_set_id BIGINT NOT NULL REFERENCES question_sets(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS'
                    CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'NEEDS_REVIEW', 'REVIEWED')),
    started_at      TIMESTAMP NOT NULL DEFAULT now(),
    submitted_at    TIMESTAMP,
    reviewed_by     BIGINT REFERENCES users(id),
    reviewed_at     TIMESTAMP
);

CREATE TABLE assessment_answers (
    id                      BIGSERIAL PRIMARY KEY,
    assessment_id           BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id             BIGINT NOT NULL REFERENCES questions(id),
    selected_option_id      BIGINT REFERENCES question_options(id),   -- nếu MULTIPLE_CHOICE
    answer_text             TEXT,                                     -- nếu PRACTICAL
    is_correct               BOOLEAN,                                  -- rule-based, cho MULTIPLE_CHOICE
    ai_score                 NUMERIC(4,2),                             -- 0-10, do AI-Grading Service chấm
    ai_justification          TEXT,                                     -- giải thích + trích bằng chứng
    ai_confidence             VARCHAR(10) CHECK (ai_confidence IN ('HIGH', 'LOW')),
    admin_override_score      NUMERIC(4,2),                             -- nếu admin chấm tay lại
    final_score               NUMERIC(4,2),                             -- = override nếu có, ngược lại = ai_score
    answered_at               TIMESTAMP NOT NULL DEFAULT now()
);

-- Điểm tổng hợp theo từng miền cho mỗi bài làm (dùng để vẽ radar chart)
CREATE TABLE assessment_domain_scores (
    assessment_id   BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    domain_id       SMALLINT NOT NULL REFERENCES competency_domains(id),
    score           NUMERIC(5,2) NOT NULL,          -- điểm trung bình miền này
    achieved_level_id SMALLINT REFERENCES progression_levels(id), -- mức đạt được
    PRIMARY KEY (assessment_id, domain_id)
);

-- ---------------------------------------------------------------------
-- 6. TÀI NGUYÊN GỢI Ý (Recommendation Resources)
-- ---------------------------------------------------------------------

CREATE TABLE resources (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    url             VARCHAR(500) NOT NULL,
    domain_id       SMALLINT NOT NULL REFERENCES competency_domains(id),
    target_level_id SMALLINT NOT NULL REFERENCES progression_levels(id), -- mức mà tài nguyên này giúp đạt tới
    created_by      BIGINT NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- Log các lần hệ thống gợi ý resource nào cho sinh viên nào (phục vụ đối chiếu
-- "gợi ý trước đó có giúp cải thiện không" nếu làm thêm giai đoạn 2)
CREATE TABLE recommendation_logs (
    id              BIGSERIAL PRIMARY KEY,
    assessment_id   BIGINT NOT NULL REFERENCES assessments(id),
    resource_id     BIGINT NOT NULL REFERENCES resources(id),
    domain_id       SMALLINT NOT NULL REFERENCES competency_domains(id),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 7. AUDIT LOG CHO AI (chấm điểm + gợi ý) — phục vụ kiểm soát hallucination
-- ---------------------------------------------------------------------

CREATE TABLE ai_call_logs (
    id                  BIGSERIAL PRIMARY KEY,
    assessment_answer_id BIGINT REFERENCES assessment_answers(id),  -- null nếu là call cho recommendation
    call_type           VARCHAR(20) NOT NULL CHECK (call_type IN ('GRADING', 'RECOMMENDATION')),
    model_name          VARCHAR(50) NOT NULL,
    prompt_payload      TEXT NOT NULL,
    response_payload    TEXT NOT NULL,
    latency_ms          INT,
    created_at          TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 8. SKILL TREE / ADAPTIVE TESTING — trạng thái monotonic + tín hiệu ôn tập
-- ---------------------------------------------------------------------

-- Trạng thái từng node (domain × level) của từng sinh viên.
-- status CHỈ ĐƯỢC TĂNG, không bao giờ hạ (giống chứng chỉ thật không bị thu hồi).
-- recent_accuracy là tín hiệu riêng, rolling theo N lần thử gần nhất, dùng cho
-- Recommendation Engine gợi ý ôn lại mà KHÔNG làm hạ status.
CREATE TABLE skill_nodes (
    id                  BIGSERIAL PRIMARY KEY,
    student_id          BIGINT NOT NULL REFERENCES users(id),
    domain_id           SMALLINT NOT NULL REFERENCES competency_domains(id),
    level_id            SMALLINT NOT NULL REFERENCES progression_levels(id),
    status               VARCHAR(20) NOT NULL DEFAULT 'LOCKED'
                        CHECK (status IN ('LOCKED', 'UNLOCKED', 'COMPLETED')),
    recent_accuracy       NUMERIC(4,3),           -- % đúng trong N lần thử gần nhất, không ảnh hưởng status
    completed_at           TIMESTAMP,               -- mốc thời gian hoàn thành lần đầu, dùng in chứng chỉ
    updated_at              TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (student_id, domain_id, level_id)
);

-- Log từng lần sinh viên thử câu hỏi thuộc 1 node — nguồn dữ liệu để:
-- (1) Adaptive Testing Engine chọn câu tiếp theo dựa trên difficulty_index
-- (2) tính lại recent_accuracy cho skill_nodes
CREATE TABLE node_attempts (
    id              BIGSERIAL PRIMARY KEY,
    skill_node_id   BIGINT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    question_id     BIGINT NOT NULL REFERENCES questions(id),
    is_correct      BOOLEAN NOT NULL,
    attempted_at    TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 9. CHỨNG CHỈ NĂNG LỰC CÓ THỂ XÁC THỰC
-- ---------------------------------------------------------------------

CREATE TABLE certificates (
    id                  BIGSERIAL PRIMARY KEY,
    student_id          BIGINT NOT NULL REFERENCES users(id),
    domain_id           SMALLINT NOT NULL REFERENCES competency_domains(id),
    level_id            SMALLINT NOT NULL REFERENCES progression_levels(id),
    skill_node_id       BIGINT NOT NULL REFERENCES skill_nodes(id),
    verification_code   VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256(student_id + domain_id + level_id + issued_at)
    pdf_url             VARCHAR(255),
    issued_at           TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 10. CHỐNG TRÙNG LẶP KHI AI SOẠN CÂU HỎI (dedup + retry loop)
-- ---------------------------------------------------------------------

CREATE TABLE question_generation_attempts (
    id              BIGSERIAL PRIMARY KEY,
    domain_id       SMALLINT NOT NULL REFERENCES competency_domains(id),
    level_id        SMALLINT NOT NULL REFERENCES progression_levels(id),
    requested_by    BIGINT NOT NULL REFERENCES users(id),
    attempt_number  SMALLINT NOT NULL,             -- tối đa 3, hard limit ở tầng code
    application_field VARCHAR(50),                 -- lĩnh vực áp dụng dùng cho lần thử này
    similarity_score NUMERIC(4,3),
    result          VARCHAR(20) NOT NULL
                    CHECK (result IN ('ACCEPTED', 'REJECTED_DUPLICATE', 'FAILED_MAX_RETRY')),
    resulting_question_id BIGINT REFERENCES questions(id), -- null nếu không ACCEPTED
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- INDEX GỢI Ý (tối ưu truy vấn thường dùng)
-- ---------------------------------------------------------------------

CREATE INDEX idx_questions_domain_level_status ON questions(domain_id, level_id, status);
CREATE INDEX idx_assessments_student ON assessments(student_id);
CREATE INDEX idx_assessment_answers_assessment ON assessment_answers(assessment_id);
CREATE INDEX idx_resources_domain_level ON resources(domain_id, target_level_id);
CREATE INDEX idx_ai_logs_answer ON ai_call_logs(assessment_answer_id);
CREATE INDEX idx_skill_nodes_student ON skill_nodes(student_id);
CREATE INDEX idx_node_attempts_node ON node_attempts(skill_node_id);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_qgen_attempts_domain_level ON question_generation_attempts(domain_id, level_id);