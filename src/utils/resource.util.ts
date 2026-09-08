export type ResourceType = 'youtube' | 'google_slide' | 'google_doc' | 'pdf' | 'article';

export const detectResourceType = (url: string): ResourceType => {
  if (!url) return 'article';

  // YouTube match (handles watch?v=, youtu.be/, embed/)
  if (url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)) {
    return 'youtube';
  }

  // Google Slides match
  if (url.includes('docs.google.com/presentation')) {
    return 'google_slide';
  }

  // Google Docs match
  if (url.includes('docs.google.com/document')) {
    return 'google_doc';
  }

  // PDF match
  if (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf?')) {
    return 'pdf';
  }

  return 'article';
};

export const getEmbedUrl = (url: string, type: ResourceType): string => {
  switch (type) {
    case 'youtube':
      const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
      }
      return url;

    case 'google_slide':
    case 'google_doc':
      // Convert to embed/preview link if it's a standard edit/view link
      if (url.includes('/edit') || url.includes('/view')) {
        return url.replace(/\/(edit|view).*/, '/preview');
      }
      return url;

    default:
      return url;
  }
};
