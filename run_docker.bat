@ECHO off
SET TYPE="%1"
git pull
if %TYPE%=="ant" (
  npm run webapp:ant
  docker compose -p dnplab-fe up -d --build
)
if %TYPE%=="test" (
  npm run webapp:gem
  tar -zcf static.tar.gz target/classes/static/*
  debian run scp -i ~/ant-test-key-pair.pem static.tar.gz ec2-user@ec2-15-152-7-2.ap-northeast-3.compute.amazonaws.com:~
  debian run ssh -i ~/ant-test-key-pair.pem ec2-user@ec2-15-152-7-2.ap-northeast-3.compute.amazonaws.com "tar -zxvf static.tar.gz"
  debian run ssh -i ~/ant-test-key-pair.pem ec2-user@ec2-15-152-7-2.ap-northeast-3.compute.amazonaws.com "sudo cp -r target/classes/static/* /var/www/html"
  debian run ssh -i ~/ant-test-key-pair.pem ec2-user@ec2-15-152-7-2.ap-northeast-3.compute.amazonaws.com "rm -rf target static.tar.gz"
  del static.tar.gz
  npm run clean-www
  npm run webapp:build:ant
  docker compose -p dnplab-fe up -d --build
)
if %TYPE%=="gem-dev" (
  SET AWS_PROFILE=gem
  npm run webapp:gem
  aws ecr --profile gem get-login-password --region ap-northeast-3 | docker login --username AWS --password-stdin 358317718510.dkr.ecr.ap-northeast-3.amazonaws.com
  docker build -f dockerfile.dev -t dnplabo-fe:dev .
  docker tag dnplabo-fe:dev 358317718510.dkr.ecr.ap-northeast-3.amazonaws.com/dnplabo-fe:dev
  docker push 358317718510.dkr.ecr.ap-northeast-3.amazonaws.com/dnplabo-fe:dev
  @REM aws ecs --profile gem update-service --cluster dnp --service dnplabo-fe --force-new-deployment --region ap-northeast-3
)
if %TYPE%=="gem" (
  SET AWS_PROFILE=gem
  aws ecr --profile gem get-login-password --region ap-northeast-3 | docker login --username AWS --password-stdin 358317718510.dkr.ecr.ap-northeast-3.amazonaws.com
  docker build -f dockerfile.prod --build-arg BUILD_ENV=gem -t dnplabo-fe:%2 .
  docker tag dnplabo-fe:%2 358317718510.dkr.ecr.ap-northeast-3.amazonaws.com/dnplabo-fe:%2
  docker push 358317718510.dkr.ecr.ap-northeast-3.amazonaws.com/dnplabo-fe:%2
  @REM aws ecs --profile gem update-service --cluster dnp --service dnplabo-fe --force-new-deployment --region ap-northeast-3
)
if %TYPE%=="dnp-dev" (
  SET AWS_PROFILE=dnp
  npm run webapp:dnp
  aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 795542610924.dkr.ecr.ap-northeast-1.amazonaws.com
  docker build -f dockerfile.dev -t a0439d-stg-web-frontend:dev .
  docker tag a0439d-stg-web-frontend:dev 795542610924.dkr.ecr.ap-northeast-1.amazonaws.com/web:a0439d-stg-web-frontend-dev
  docker push 795542610924.dkr.ecr.ap-northeast-1.amazonaws.com/web:a0439d-stg-web-frontend-dev
  aws ecs update-service --cluster web --service web-frontend --force-new-deployment --region ap-northeast-1
)
if %TYPE%=="dnp" (
  SET AWS_PROFILE=dnp
  aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 795542610924.dkr.ecr.ap-northeast-1.amazonaws.com
  docker build -f dockerfile.prod --build-arg BUILD_ENV=dnp -t a0439d-stg-web-frontend:%2 .
  docker tag a0439d-stg-web-frontend:%2 795542610924.dkr.ecr.ap-northeast-1.amazonaws.com/web:a0439d-stg-web-frontend-%2
  docker push 795542610924.dkr.ecr.ap-northeast-1.amazonaws.com/web:a0439d-stg-web-frontend-%2
  @REM aws ecs update-service --cluster web --service web-frontend --force-new-deployment --region ap-northeast-1
)
if %TYPE%=="dnp-s3" (
  SET AWS_PROFILE=dnp
  npm run webapp:dnp
  @REM aws s3 rm --recursive s3://a0439d-stg-s3-mem-frontend01/app
  @REM aws s3 rm --recursive s3://a0439d-stg-s3-mem-frontend01/content
  aws s3 sync ./target/classes/static/app s3://a0439d-stg-s3-mem-frontend01/app --exclude "*.txt" --content-type "text/javascript"
  aws s3 sync ./target/classes/static s3://a0439d-stg-s3-mem-frontend01 --exclude "app/*"
  aws cloudfront create-invalidation --distribution-id E1CYJ49MXYQQEP --path "/*"
)

if %TYPE%=="dnp-prod" (
  SET AWS_PROFILE=dnp
  npm run webapp:dnp
  @REM aws s3 sync ./target/classes/static/ s3://a0444d-prd-s3-mem-frontend01
  @REM aws cloudfront create-invalidation --distribution-id E1ZQYMVPIAAFCZ --path "/*"
)