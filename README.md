# management
# Deploy instructions
# For dev general deploy use 
sls deploy 
# For dev lambda deploy use 
sls deploy --env dev
# For prod general deploy use 
sls deploy --stage prod --region us-east-2
# For prod lambda deploy use 
sls deploy --stage prod --region us-east-2 --env prod
# For qa deploy use sls deploy --stage qa