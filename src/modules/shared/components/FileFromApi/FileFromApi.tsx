'use client';

import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useGetFileByUuid } from '@/apis/file/hook/useGetFile';
import { ImagePreviewModal } from '../ImageFromApi/ImagePreviewModal';

type Props = {
  fileId: number | string; // acts as UUID
  className?: string;
  alt?: string;
  onLoad?: (fileName: string) => void;
  onLoadSource?: (filesource: string) => void;
  onLoadFile?: (file: File) => void;
  width?: number | string;
  height?: number | string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  isHidden?: boolean;
  isPreview?: boolean;
  allowDownload?: boolean;
  renderPdf?: (props: { url: string; filename: string }) => React.ReactNode;
};

export default function FileFromApi({
  fileId,
  alt,
  className,
  onLoad,
  onLoadSource,
  onLoadFile,
  width = 120,
  height = 80,
  videoRef,
  isPreview = true,
  allowDownload = false,
  renderPdf,
}: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: fileData, isLoading } = useGetFileByUuid(String(fileId));

  const dto = fileData?.result;
  const fileUrl = dto?.url;
  const fileType = dto?.mimeType || dto?.fileType || '';
  const fileName = dto?.fileName || 'file';


  useEffect(() => {
    if (fileUrl) {
      onLoad?.(fileName);
      onLoadSource?.(fileUrl);
      // NOTE: We don't have the File/Blob object easily available from the JSON DTO without a secondary fetch.
      // If onLoadFile is required, we would need to fetch the blob manually. 
      // We skip onLoadFile here unless strictly needed by a parent.
    }
  }, [fileUrl, fileName, onLoad, onLoadSource]);

  if (isLoading) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={16} />
      </div>
    );
  }

  if (!fileUrl) {
    return <InsertDriveFileIcon style={{ width, height, fontSize: width }} />;
  }

  if (fileType?.startsWith('image/')) {
    return (
      <>
        <img
          src={fileUrl}
          alt={alt}
          className={className}
          onClick={() => {
            if (isPreview) setPreviewOpen(true);
          }}
          style={{
            width,
            height,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            cursor: 'pointer',
          }}
        />
        <ImagePreviewModal
          open={previewOpen}
          loading={isLoading}
          imageUrl={fileUrl}
          onClose={() => {
            setPreviewOpen(false);
          }}
        />
      </>
    );
  }

  if (fileType?.startsWith('video/')) {
    const supportedVideoTypes = ['video/mp4', 'video/webm'];
    const playbackType = supportedVideoTypes.includes(fileType)
      ? fileType
      : 'video/mp4';
    return (
      <video
        key={fileUrl}
        ref={videoRef}
        width={width}
        height={height}
        controls
        className={className}
        style={{ objectFit: 'contain' }}
      >
        <source src={fileUrl} type={playbackType} />
      </video>
    );
  }

  return <InsertDriveFileIcon style={{ width, height, fontSize: width }} />;
}
