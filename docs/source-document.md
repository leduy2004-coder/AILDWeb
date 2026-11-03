# Source Document API (Frontend)

Tài liệu mô tả các API call và query keys cho quản lý tài liệu nguồn và chunk.

## File

`src/apis/source-document/source-document.api.ts`

## Query Keys

```ts
SOURCE_DOCUMENT_QUERY_KEYS = {
  all:      ['source-documents']
  list:     ['source-documents', 'list', filter]
  detail:   ['source-documents', 'detail', id]
  coverage: ['source-documents', 'coverage']
  chunks:   ['source-documents', 'chunks', filter]
}
```

---

## Source Document APIs

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getSourceDocuments(filter)` | GET | `/admin/source-documents` | Danh sách tài liệu, filter + phân trang |
| `getSourceDocumentById(id)` | GET | `/admin/source-documents/:id` | Chi tiết 1 tài liệu |
| `uploadSourceDocument(data)` | POST | `/admin/source-documents` | Upload PDF (multipart/form-data) |
| `reprocessSourceDocument(id)` | POST | `/admin/source-documents/:id/reprocess` | Retry xử lý tài liệu lỗi |
| `deleteSourceDocument(id)` | DELETE | `/admin/source-documents/:id` | Xoá mềm |
| `getSourceCoverage()` | GET | `/admin/source-documents/coverage` | Số chunk theo domain |

### Upload request fields

```ts
ISourceDocumentUploadRequest {
  file: File           // PDF (required)
  title?: string
  sourceName?: string  // tên tổ chức/tác giả
  publishedYear?: number
}
```

### Document statuses

| Status | Ý nghĩa |
|--------|---------|
| `PENDING` | Chờ xử lý |
| `PROCESSING` | Đang extract + embed |
| `READY` | Xong, chunk đã sẵn sàng |
| `FAILED` | Lỗi — có thể reprocess |

---

## Source Chunk APIs

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getSourceChunks(filter)` | GET | `/admin/source-chunks` | Danh sách chunk |
| `labelSourceChunks(data)` | PUT | `/admin/source-chunks/bulk-label` | Gán domain cho nhiều chunk |
| `ignoreSourceChunks(chunkIds)` | PUT | `/admin/source-chunks/bulk-ignore` | Đánh dấu bỏ qua |
| `restoreSourceChunks(chunkIds)` | PUT | `/admin/source-chunks/bulk-restore` | Khôi phục chunk |

### Chunk filter fields

```ts
ISourceChunkFilter {
  documentId?: number
  status?: string        // UNLABELED | ACTIVE | IGNORED
  domainId?: number      // 1-4
  lowConfidence?: boolean
  page, size, sort
}
```

### Chunk statuses

| Status | Ý nghĩa |
|--------|---------|
| `UNLABELED` | Chưa gán domain (confidence thấp) |
| `ACTIVE` | Đã gán domain, dùng cho RAG |
| `IGNORED` | Bị loại (TOC, references, quá ngắn) |

---

## Coverage

`getSourceCoverage()` trả về số chunk ACTIVE theo từng domain:

```ts
ISourceCoverage[] = [
  { domainId: 1, chunkCount: 42 },  // Human-centred Mindset
  { domainId: 2, chunkCount: 38 },  // Ethics of AI
  { domainId: 3, chunkCount: 55 },  // AI Techniques and Applications
  { domainId: 4, chunkCount: 29 },  // AI System Design
]
```

Domain không có chunk → AI sinh câu hỏi không grounded (không có nguồn tài liệu).
