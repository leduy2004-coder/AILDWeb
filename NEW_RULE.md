# AI Code Guidelines & Rules (Quy chuẩn Dự án AILD)

AI Prompts khi tham gia vào dự án này bắt buộc phải đọc và tuân thủ các quy chuẩn sau đây (được đúc kết từ dự án Tutor Hub):

## 1. Nguyên Tắc Cốt Lõi (General Rules)
- **Tối ưu hóa Database**: TUYỆT ĐỐI KHÔNG thực hiện các lệnh Query Database bên trong vòng lặp (`for`, `forEach`, `map`...). Nếu cần map data, hãy query hàng loạt (VD: dùng `IN (...)`) rồi đưa vào Map/Dictionary trong RAM trước khi lặp.
- **Phân trang (Pagination) & Search**: Các API trả về danh sách đều phải có cơ chế phân trang (server-side pagination) và tìm kiếm/filter, không trả về toàn bộ dữ liệu (trừ dữ liệu master/danh mục rất nhỏ).

## 2. Quy chuẩn Frontend (`aild-web`)
- **Cấu trúc thư mục chuẩn**: 
  - Đảm bảo tuân thủ nghiêm ngặt cấu trúc hiện tại. Phân chia rõ ràng các file thành: `component`, `schema` (validate), `constant`, `type`.
  - **Module**: Giao diện các trang và tính năng đặt tại `src/modules/...` và được chia nhỏ hợp lý. Không viết component quá dài (hơn 300 dòng thì cân nhắc tách nhỏ).
  - **API**: Mọi lời gọi API phải đặt tại `src/apis/...`. Luôn dùng Custom Hook (kết hợp `@tanstack/react-query`) và tách rời với Component.
    - **Thư mục API riêng biệt**: Khi tạo API cho một đối tượng/domain mới, bắt buộc phải tạo thư mục riêng (VD: `src/apis/overview/overview.api.ts`), KHÔNG ĐƯỢC gộp chung (nhét bừa) vào thư mục của domain khác.
    - **Format File API Chuẩn**: Luôn sử dụng `http` client từ `@/lib/http` (`import http from '@/lib/http'`). Gọi API bằng cách bóc tách `const { payload } = await http.get(...)` và return `payload`. Bắt buộc phải define kiểu trả về `Promise<IApiResponse<T>>`. Base path phải bám sát backend gateway (VD: `/api/v1/...`).
    - **Refresh Data sau khi Create/Update (Mutation)**: Sau khi gọi một mutation (VD: submit form thêm/sửa thành công), BẮT BUỘC phải dùng `queryClient.invalidateQueries({ queryKey: ['...'] })` để refresh lại danh sách/data liên quan trên giao diện, tránh tình trạng user phải F5.
    - **Popup Xác Nhận (Confirm Popup)**: Khi thực hiện hành động xóa hoặc các hành động nguy hiểm cần xác nhận, KHÔNG sử dụng `window.confirm`.
    - **Cấu trúc thư mục Modal**: Các Modal dạng hiển thị thông tin, chi tiết phải được gom vào thư mục `modal` bên trong `component` của module. Các Modal dạng form nhập liệu thì giữ nguyên trong thư mục `form`. KHÔNG vứt rải rác các modal ở ngoài.
- **Đa ngôn ngữ (i18n) & Validate**: 
  - BẮT BUỘC sử dụng i18n cho toàn bộ Text trên giao diện. Các file cấu hình và JSON nằm ở `src/utils/languages` (`vi.json`, `en.json`). Không hardcode string tiếng Việt trực tiếp vào code HTML/JSX.
  - **Dịch lỗi Validate (Zod/Yup)**: Schema validation thường chỉ trả về translation key. Tại Component UI, BẮT BUỘC phải bọc bằng hàm `t()` để hiển thị thông báo lỗi đúng ngôn ngữ. Không được để nguyên key tràn ra màn hình.

## 3. Quy chuẩn Backend (Spring Boot Microservices)
- **Service Mặc Định (`aild-service`)**: Bất kỳ chức năng mới, nghiệp vụ chính nào liên quan đến đánh giá AI thì **mặc định viết vào `aild-service`**.
- **Format API Trả Về**:
  Mọi API phải bọc trong chuẩn `ApiResponse<T>` chung của dự án:
  ```json
  {
    "code": 1000,
    "result": { ... } // Dữ liệu hoặc PageResponse nằm ở đây
  }
  ```
- **Tách Layer**: Đảm bảo phân chia đúng các layer: `Controller` (chỉ hứng request) -> `Service` (xử lý nghiệp vụ logic) -> `Repository` (truy vấn DB). Dùng `ModelMapper` hoặc MapStruct để map Entity qua DTO (Response/Request). Tái sử dụng FeignClient để gọi chéo giữa các service (`auth-service`, `aild-service`).
