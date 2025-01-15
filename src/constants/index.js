import path from 'node:path';

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
