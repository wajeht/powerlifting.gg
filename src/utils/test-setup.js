// app
process.env.DEBUG = true;
process.env.PORT = 8081;
process.env.NODE_ENV = 'testing';
process.env.MY_IP_ADDRESS = '50.26.8.122';
process.env.DEVELOPMENT_APP_URL = 'localtest.me';
process.env.PRODUCTION_APP_URL = 'powerlifting.gg';

process.env.SUPER_ADMIN_EMAIL = 'zombyard@gmail.com';

process.env.PRODUCTION_SSH_URL="dog@127.0.0.1"

// google
process.env.GOOGLE_ID = 'something';
process.env.GOOGLE_SECRET = 'gains';
process.env.GOOGLE_REDIRECT_URL = 'http://localhost:80/oauth/google/redirect';

// session
process.env.SESSION_STORE_PREFIX = 'powerlifting.gg';
process.env.SESSION_SECRET = 'powerlifting.gg';

// backblaze
process.env.PRIVATE_BACKBLAZE_BUCKET = 'powerlifting-dot-gg';
process.env.PRIVATE_BACKBLAZE_REGION = 'us-west-004';
process.env.PRIVATE_BACKBLAZE_END_POINT = 'https://google.com';
process.env.PRIVATE_BACKBLAZE_KEY_ID = '69420247';
process.env.PRIVATE_BACKBLAZE_APPLICATION_KEY = 'abcdefghijklmnopqrstuvwxyz';

process.env.PUBLIC_BACKBLAZE_BUCKET = 'powerlifting-dot-gg';
process.env.PUBLIC_BACKBLAZE_REGION = 'us-west-004';
process.env.PUBLIC_BACKBLAZE_END_POINT = 'https://google.com';
process.env.PUBLIC_BACKBLAZE_KEY_ID = '69420247';
process.env.PUBLIC_BACKBLAZE_APPLICATION_KEY = 'abcdefghijklmnopqrstuvwxyz';

// redis
process.env.REDIS_HOST = 'redis';
process.env.REDIS_PORT = 6379;
process.env.REDIS_PASSWORD = 'password';

// email
process.env.EMAIL_HOST = 'mailhot';
process.env.EMAIL_PORT = 1025;
process.env.EMAIL_AUTH_EMAIL = 'name@email.com';
process.env.EMAIL_AUTH_ALIAS = 'mail@jaw.dev';
process.env.EMAIL_AUTH_PASS = 'password';
