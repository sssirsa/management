#!/bin/bash

# Assuming you deployed with a 'sls deploy' | tee deploy.out this script
# will auto fill in the ENDPOINT enviroment variable

node helpers/getEndpoint.js > .build/endpoint.out
export ENDPOINT = `cat .build/endpoint.out`

echo $ENDPOINT