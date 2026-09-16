import fs from 'fs/promises';
import path from 'path';
import { config } from '../config.js';

export async function loadDocuments(dataDir = config.dataDir) {
  const entries = await fs.readdir(dataDir);
  const files = entries.filter((f) => /\.(md|txt)$/i.test(f));

  const documents = [];
  for (const filename of files) {
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : filename.replace(/\.[^.]+$/, '');

    documents.push({
      id: filename.replace(/\.[^.]+$/, ''),
      filename,
      title,
      content,
    });
  }

  return documents.sort((a, b) => a.filename.localeCompare(b.filename));
}
