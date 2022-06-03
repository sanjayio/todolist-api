import { randomUUID } from 'crypto';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";


interface CreateEvent {
  arguments: {
    todo: {
      author: string; //keep consistent with the schema
      content: string; //keep consistent with the schema
    }
  }
}

interface ToDoItem {
  id: string; //keep consistent with the schema
  content: string; //keep consistent with the schema
  author: string; //keep consistent with the schema
  createdAt: string; //keep consistent with the schema
}

export const handler = async (event: CreateEvent): Promise<ToDoItem | Error> => {
  console.log(JSON.stringify(event, undefined, 2));

  try {
    const input: ToDoItem = {
      id: randomUUID(),
      content: event.arguments.todo.content,
      author: event.arguments.todo.author,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: input
    };
  
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    await ddbDocClient.send(new PutCommand(params));

    return input;

  } catch (err) {
    if (err instanceof Error) {
      console.error(`Oops! Something went wrong: ${JSON.stringify(err, undefined, 2)}`);
      throw err;
    } else {
      const unknown_error = err as Error;
      throw unknown_error;
    }
  }
}
