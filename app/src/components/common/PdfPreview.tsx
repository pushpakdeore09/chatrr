import { Document, Page } from 'react-pdf';

export const PdfPreview = ({ fileUrl }: { fileUrl: string }): any => {
  return (
    <div style={{ width: 300 }}>
      <Document file={fileUrl} loading="Loading PDF...">
        <Page pageNumber={1} width={300} />
      </Document>
    </div>
  );
}
