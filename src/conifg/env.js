import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(path.join(process.cwd(), '.env')) });

export const env = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8080,
	myIp: process.env.MY_IP_ADDRESS,
};
