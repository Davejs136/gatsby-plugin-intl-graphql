import { GraphQLClient } from 'graphql-request'
import checkLoginUser from './checkLoginUser'

export default async function requestWithAuth(endpoint, query, auth) {
  const jwt = await checkLoginUser(auth)
  const response = await new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  })

  return response.request(query)
}
