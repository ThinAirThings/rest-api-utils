export const isProd = () => {
    return process.env.NODE_ENV==="prod"
}
export * from './restRequestHandler'
export * from './Errors'

