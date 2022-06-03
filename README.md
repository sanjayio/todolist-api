# Todos App using AWS CDK, AppSync GraphQL, Lambda, Dynamo DB

## Authentication

API usage authenticated using `API_KEY`. To view the key:

```sh
aws appsync list-api-keys --api-id <api-id>
```

The api key expires in 7 days. 

To query the api via postman or insomnia, add the header `x-api-key` to the value of the api key. 

