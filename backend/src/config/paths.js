import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to uploads directory (backend/uploads)
export const uploadsDir = path.resolve(__dirname, '../../uploads');

// Absolute path to frontend production build (frontend/dist)
export const frontendDistDir = path.resolve(__dirname, '../../../frontend/dist');

// Ensure uploads folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
