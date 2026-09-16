import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let ingestRunning = false;

router.post(
  '/',
  asyncHandler(async (_req, res) => {
    if (ingestRunning) {
      throw new AppError('Ingestion already in progress', 'INGEST_BUSY', 409);
    }

    ingestRunning = true;
    const scriptPath = path.resolve(__dirname, '../../scripts/ingest.js');

    const child = spawn('node', [scriptPath], {
      cwd: path.resolve(__dirname, '../..'),
      env: process.env,
    });

    let output = '';
    child.stdout.on('data', (d) => { output += d.toString(); });
    child.stderr.on('data', (d) => { output += d.toString(); });

    child.on('close', (code) => {
      ingestRunning = false;
    });

    res.json({
      message: 'Ingestion started. This may take a minute. Restart backend after completion to reload keyword index.',
      status: 'running',
    });

    child.on('close', () => {
      console.log('Ingest finished:\n', output);
    });
  })
);

export default router;
