import { APIGatewayProxyEventHeaders, APIGatewayProxyEvent } from 'aws-lambda';
export declare const restRequestHandler: (handler: ({ payload, headers }: {
    payload?: any;
    headers?: APIGatewayProxyEventHeaders | undefined;
}) => Promise<any>, verify?: boolean) => (event: APIGatewayProxyEvent) => Promise<{
    statusCode: number;
    body: string;
}>;
