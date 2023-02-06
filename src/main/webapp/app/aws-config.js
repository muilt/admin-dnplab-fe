/* eslint-disable */
import { AWS_PROJECT_REGION, aws_cognito } from "app/config/constants";

const awsmobile = {
  aws_project_region: AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: "ap-northeast-1:34563ddf-cb89-4415-ba30-0dfcde821309",
  aws_cognito_region: aws_cognito.REGION,
  aws_user_pools_id: aws_cognito.USER_POOL_ID,
  aws_user_pools_web_client_id: aws_cognito.USER_POOL_WEB_CLIENT_ID,
  oauth: {},
  aws_cognito_username_attributes: [],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ["EMAIL"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: ["SMS"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],
  aws_cognito_confirm_url: aws_cognito.CONFIRM_URL,
};

export default awsmobile;
