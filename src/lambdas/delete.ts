import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

interface DeleteEvent {
  arguments: {
    id: string;
  }
}

export const handler = async (event: DeleteEvent): Promise<string | Error> => {
  
  // print event for debugging
  console.log(JSON.stringify(event, undefined, 2));

  // get id of item to be deleted 
  // and create the param for deleting
  try {
    const id = event.arguments.id;

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id }
    };

    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    await ddbDocClient.send(new DeleteCommand(params));

    return id;

  } catch(err) {
    if (err instanceof Error) {
      console.error(`Oops! Something went wrong: ${JSON.stringify(err, undefined, 2)}`);
      throw err;
    } else {
      const unknown_error = err as Error;
      throw unknown_error;
    }
  }
}
