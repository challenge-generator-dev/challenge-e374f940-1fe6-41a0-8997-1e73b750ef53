import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

export interface DynamoDbConfigOptions {
  region: string;
  endpoint?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  tableName: string;
}

export const dynamoDbConfig = (): { dynamodb: DynamoDbConfigOptions } => {
  return {
    dynamodb: {
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
      tableName: process.env.DYNAMODB_TABLE_NAME || 'orders',
    },
  };
};

export const getDynamoDBClientConfig = (): DynamoDBClientConfig => {
  const config: DynamoDBClientConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
  };

  if (process.env.DYNAMODB_ENDPOINT) {
    config.endpoint = process.env.DYNAMODB_ENDPOINT;
  }

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  return config;
};

export const getTableName = (): string => {
  return process.env.DYNAMODB_TABLE_NAME || 'orders';
};

export const validateDynamoDbConfig = (): void => {
  const requiredEnvVars = ['AWS_REGION'];
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    console.warn(
      `Warning: Missing environment variables for DynamoDB configuration: ${missingEnvVars.join(', ')}. Using default values.`,
    );
  }

  if (process.env.DYNAMODB_ENDPOINT) {
    console.log(`Using DynamoDB endpoint: ${process.env.DYNAMODB_ENDPOINT}`);
  } else {
    console.log(`Using DynamoDB region: ${process.env.AWS_REGION || 'us-east-1'}`);
  }

  console.log(`DynamoDB table: ${process.env.DYNAMODB_TABLE_NAME || 'orders'}`);
};