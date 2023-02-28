const config = {
  VERSION: process.env.VERSION,
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const AWS_PROJECT_REGION = process.env.AWS_PROJECT_REGION;

export const aws_cognito = {
  REGION: process.env.AWS_COGNITO_REGION,
  USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
  USER_POOL_WEB_CLIENT_ID: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
  CONFIRM_URL: process.env.AWS_COGNITO_CONFIRM_URL,
};

export const linkPortal = "https://portal.mie-vison.org"
