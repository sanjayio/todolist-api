import { CfnOutput, Duration, Expiration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, FieldLogLevel, GraphqlApi, Schema } from '@aws-cdk/aws-appsync-alpha';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class TodolistApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // graphql api
    const api = new GraphqlApi(this, 'todolistapi', {
      'name': 'todolistapi',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(7))
          }
        }
      },
      schema: Schema.fromAsset('src/graphql/schema.graphql')
    });

    new CfnOutput(this, 'todolistapiurl', {
      value: api.graphqlUrl
    });

    // dynamo table
    const todosTable = new Table(this, 'todostable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'todostable'
    });

  }
}
