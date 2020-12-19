#!/bin/bash


echo "Waiting for Flask Server..."

while ! nc -z api 5000; do
  sleep 0.1
done

echo "Flask Server started"

npx apollo client:download-schema --endpoint="${REACT_APP_API_SERVICE_URL}:5001/graphql"
npx apollo client:codegen --localSchemaFile=schema.json --includes=/usr/src/app/src/**/*.tsx --target=typescript
npm start