import { APIGatewayProxyEventHeaders, APIGatewayProxyEvent } from 'aws-lambda';
export declare const restRequestHandler: <T>(handler: ({ payload, headers }: {
    payload: T;
    headers: APIGatewayProxyEventHeaders;
}) => Promise<any>, verify?: boolean) => (event: APIGatewayProxyEvent) => Promise<{
    statusCode: number;
    body: string;
}>;
