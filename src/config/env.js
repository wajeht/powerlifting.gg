import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(path.join(process.cwd(), '.env')) });
