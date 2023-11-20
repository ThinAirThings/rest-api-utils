import { APIGatewayProxyEvent } from "aws-lambda"
import { UnauthorizedError } from "../Errors"
import { CognitoJwtVerifier } from "aws-jwt-verify"


export const authenticate = async (event: APIGatewayProxyEvent) => {
    try {
        const payload = await CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO__USERPOOL_ID!,
            clientId: process.env.COGNITO__CLIENT_ID!,
            tokenUse: 'access',
        }).verify(event.headers.Authorization!.split(' ')[1])
        return payload.username
    } catch (_e) {
        throw new UnauthorizedError("Failure at Cognito Token Verification in 'authenticate' function.")
    }
}