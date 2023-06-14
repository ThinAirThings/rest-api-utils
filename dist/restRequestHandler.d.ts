import { APIGatewayProxyEventHeaders, APIGatewayProxyEvent } from 'aws-lambda';
export declare const restRequestHandler: <T>(handler: ({ payload, headers }: {
    payload: T;
    headers: APIGatewayProxyEventHeaders;
}) => Promise<void | Partial<{
    body?: any;
    headers?: any;
}>>, verify?: boolean) => (event: APIGatewayProxyEvent) => Promise<{
    statusCode: number;
    headers: any;
    body: string;
}>;
