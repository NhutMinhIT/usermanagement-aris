import { registerAs } from '@nestjs/config';

export const DATABASE_HOST = 'database';

export default registerAs(DATABASE_HOST, () => ({
    users: {
        uri: process.env.DATABASE_HOST,
    },
}));