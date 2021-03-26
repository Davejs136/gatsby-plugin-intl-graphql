// If the url isn't completed then modify it
// http://localhost:1337/ turn to http://localhost:1337/graphql
// http://localhost:1337 turn to http://localhost:1337/graphql

export default function extractGraphqlEndpoint(url = "") {
  const endpoint = url.includes('graphql')
    ? url
    : url.endsWith('/')
    ? url + 'graphql'
    : url + '/graphql'

  return endpoint
}
