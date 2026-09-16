function extractHeading(text, startIndex) {
  const slice = text.slice(Math.max(0, startIndex - 200), startIndex + 50);
  const matches = [...slice.matchAll(/^#{1,3}\s+(.+)$/gm)];
  return matches.length ? matches[matches.length - 1][1].trim() : '';
}

export function basicChunker(text, { chunkSize = 500, overlap = 0 } = {}) {
  const chunks = [];
  let i = 0;
  let index = 0;

  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    const chunkText = text.slice(i, end).trim();
    if (chunkText.length > 0) {
      chunks.push({
        text: chunkText,
        chunkIndex: index,
        heading: extractHeading(text, i),
      });
      index++;
    }
    if (end >= text.length) break;
    i = end - overlap;
    if (i <= 0 || overlap === 0) i = end;
  }

  return chunks;
}

export function improvedChunker(text, { chunkSize = 400, overlap = 80 } = {}) {
  const sections = text.split(/(?=^#{1,3}\s)/m).filter((s) => s.trim());

  const rawPieces = [];
  for (const section of sections) {
    const headingMatch = section.match(/^#{1,3}\s+(.+)/);
    const heading = headingMatch ? headingMatch[1].trim() : '';
    const body = headingMatch ? section.slice(headingMatch[0].length).trim() : section.trim();

    const paragraphs = body.split(/\n\n+/).filter((p) => p.trim());
    if (paragraphs.length === 0 && section.trim()) {
      rawPieces.push({ text: section.trim(), heading });
      continue;
    }
    for (const para of paragraphs) {
      rawPieces.push({ text: para.trim(), heading });
    }
  }

  const chunks = [];
  let buffer = '';
  let currentHeading = '';
  let bufferHeading = '';
  let chunkIndex = 0;

  const flush = (forceText) => {
    const textToFlush = (forceText ?? buffer).trim();
    if (!textToFlush) return;
    chunks.push({ text: textToFlush, chunkIndex, heading: bufferHeading || currentHeading || '' });
    chunkIndex++;
    buffer = '';
    bufferHeading = '';
  };

  for (const piece of rawPieces) {
    if (piece.heading && piece.heading !== currentHeading && buffer) {
      // Avoid mixing adjacent sections under one heading label.
      flush();
    }
    if (piece.heading) currentHeading = piece.heading;

    if (!buffer) {
      bufferHeading = currentHeading || piece.heading || '';
    }
    const candidate = buffer ? `${buffer}\n\n${piece.text}` : piece.text;

    if (candidate.length <= chunkSize) {
      buffer = candidate;
    } else {
      if (buffer) flush();
      if (piece.text.length <= chunkSize) {
        buffer = piece.text;
        bufferHeading = currentHeading || piece.heading || '';
      } else {
        const subChunks = basicChunker(piece.text, { chunkSize, overlap });
        for (const sc of subChunks) {
          chunks.push({ ...sc, chunkIndex, heading: currentHeading });
          chunkIndex++;
        }
      }
    }
  }
  flush();

  if (overlap > 0 && chunks.length > 1) {
    const withOverlap = [];
    for (let i = 0; i < chunks.length; i++) {
      let text = chunks[i].text;
      if (i > 0) {
        const prevTail = chunks[i - 1].text.slice(-overlap);
        text = `${prevTail}\n${text}`;
      }
      withOverlap.push({ ...chunks[i], text, chunkIndex: i });
    }
    return withOverlap;
  }

  return chunks;
}

export function chunkDocuments(documents, chunkerFn) {
  const allChunks = [];
  for (const doc of documents) {
    const chunks = chunkerFn(doc.content);
    for (const chunk of chunks) {
      allChunks.push({
        ...chunk,
        source: doc.filename,
        documentId: doc.id,
        documentTitle: doc.title,
      });
    }
  }
  return allChunks;
}
