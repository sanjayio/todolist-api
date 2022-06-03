# Todos App using AWS CDK, AppSync GraphQL, Lambda, Dynamo DB

## Authentication

API usage authenticated using `API_KEY`. To view the key:

```sh
aws appsync list-api-keys --api-id <api-id>
```

The api key expires in 7 days. 

To query the api via postman or insomnia, add the header `x-api-key` to the value of the api key. 

## Adding todos

```graphql
mutation MyMutation {
  createTodo(todo: {author: "sanjay", content: "test content"}) {
    author
    content
    createdAt
    id
    updatedAt
  }
}
```

## Deleting a todo item by id

```graphql
mutation MyMutation($id: ID = "55579252-bd0c-46d9-a310-cba3b2649a67") {
  deleteTodo(id: $id)
}
```
