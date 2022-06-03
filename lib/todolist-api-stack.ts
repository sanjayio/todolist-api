import { CfnOutput, Duration, Expiration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, FieldLogLevel, GraphqlApi, Schema } from '@aws-cdk/aws-appsync-alpha';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class TodolistApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create the graphql api
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

    // output the graphql api url
    new CfnOutput(this, 'todolistapiurl', {
      value: api.graphqlUrl
    });

    // create the table to store todos
    const todosTable = new Table(this, 'todostable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'todostable'
    });

    // create todo

    // create todo lambda
    const createToDoLambda = new NodejsFunction(this, 'createtodolambda', {
      functionName: 'createtodolambda',
      runtime: Runtime.NODEJS_14_X,
      entry: 'dist/src/lambdas/create.js',
      logRetention: RetentionDays.ONE_WEEK,
      architecture: Architecture.ARM_64,
      memorySize: 256
    });

    // create todo lambda datasource
    const createToDoLambdaDs = api.addLambdaDataSource('createtodolambdads', createToDoLambda);

    // create todo lambda datasource resolver
    createToDoLambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createTodo'
    });

    // pass table name to todo lambda and grant permissions
    createToDoLambda.addEnvironment('TABLE_NAME', todosTable.tableName);
    todosTable.grantWriteData(createToDoLambda);

  }
}
