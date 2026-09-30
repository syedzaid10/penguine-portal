import pdfParse from 'pdf-parse';
import Papa from 'papaparse';

/**
 * Extract plain text from a PDF buffer.
 */
export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text ? data.text.trim() : '';
  } catch (err) {
    console.error('Error parsing PDF:', err);
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  }
}

/**
 * Parse CSV buffer, extract headers, and generate preview rows.
 */
export function parseCSV(csvStringOrBuffer, maxPreviewRows = 20) {
  const content = Buffer.isBuffer(csvStringOrBuffer)
    ? csvStringOrBuffer.toString('utf-8')
    : csvStringOrBuffer;

  const parsed = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (parsed.errors && parsed.errors.length > 0) {
    console.warn('CSV parsing warnings:', parsed.errors);
  }

  const columnHeaders = parsed.meta.fields || [];
  const previewRows = parsed.data.slice(0, maxPreviewRows);
  const totalRows = parsed.data.length;

  return {
    columnHeaders,
    previewRows,
    totalRows,
    allRows: parsed.data,
  };
}

/**
 * Split text into semantic chunks of ~300 words with sliding window overlap.
 */
export function splitTextIntoChunks(text, targetWordCount = 300, overlap = 50) {
  if (!text || typeof text !== 'string') return [];

  // Normalize whitespace
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  if (words.length === 0 || words[0] === '') return [];

  const chunks = [];
  let startIndex = 0;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + targetWordCount, words.length);
    const chunkWords = words.slice(startIndex, endIndex);
    const chunkText = chunkWords.join(' ');

    if (chunkText.trim().length > 0) {
      chunks.push({
        chunkIndex: chunks.length,
        text: chunkText,
        wordCount: chunkWords.length,
      });
    }

    if (endIndex >= words.length) {
      break;
    }

    startIndex += targetWordCount - overlap;
  }

  return chunks;
}
