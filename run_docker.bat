@ECHO off
SET TYPE="%1"
git pull
if %TYPE%=="ant" (
  npm run webapp:ant
  docker compose -p dnplab-admin-fe up -d --build
)
if %TYPE%=="test" (
  npm run webapp:gem
  tar -zcf static.tar.gz target/classes/static/*
  debian run scp -i ~/ant-test-key-pair.pem static.tar.gz ec2-user@ec2-13-208-145-223.ap-northeast-3.compute.amazonaws.com:~
  debian run ssh -i ~/ant-test-key-pair.pem ec2-user@ec2-13-208-145-223.ap-northeast-3.compute.amazonaws.com "tar -zxvf static.tar.gz"
  debian run ssh -i ~/ant-test-key-pair.pem ec2-user@ec2-13-208-145-223.ap-northeast-3.compute.amazonaws.com "sudo cp -r target/classes/static/* /var/www/html"
  debian run ssh -i ~/ant-test-key-pair.pem ec2-user@ec2-13-208-145-223.ap-northeast-3.compute.amazonaws.com "rm -rf target static.tar.gz"
  del static.tar.gz
  npm run clean-www
  npm run webapp:build:ant
  docker compose -p dnplab-admin-fe up -d --build
)
if %TYPE%=="dnp" (
  SET AWS_PROFILE=dnp
  npm run webapp:dnp
  @REM aws s3 rm --recursive s3://a0439d-stg-s3-mem-admin-frontend01/app
  @REM aws s3 rm --recursive s3://a0439d-stg-s3-mem-admin-frontend01/content
  aws s3 sync ./target/classes/static/app s3://a0439d-stg-s3-mem-admin-frontend01/app --exclude "*.txt" --content-type "text/javascript"
  aws s3 sync ./target/classes/static s3://a0439d-stg-s3-mem-admin-frontend01 --exclude "app/*"
  aws cloudfront create-invalidation --distribution-id E1ZQYMVPIAAFCZ --path "/*"
)

if %TYPE%=="dnp-prod" (
  SET AWS_PROFILE=dnp
  npm run webapp:dnp
)