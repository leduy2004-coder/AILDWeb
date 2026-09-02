export interface MediaFileDto {
  id: number;
  fileType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  url: string;
  relatedId: number;
  relatedType: string;
  archiveName: string;
  uuid: string;
}
