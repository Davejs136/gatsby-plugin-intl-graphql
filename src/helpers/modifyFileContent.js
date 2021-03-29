import chalk from 'chalk'
import { log } from 'console'
import { request, GraphQLClient } from 'graphql-request'
import { checkLoginUser } from './checkLoginUser'
import { _write } from './writeFile'
import { cleanup } from './cleanupFile'

export default async function modifyContent({
  path,
  url,
  query,
  languages,
  loginData = { identifier: '', password: '' },
}) {
  let response
  // If the url isn't completed then modify it
  // http://localhost:1337/ turn to http://localhost:1337/graphql
  // http://localhost:1337 turn to http://localhost:1337/graphql
  const endpoint = url.includes('graphql')
    ? url
    : url.endsWith('/')
    ? url + 'graphql'
    : url + '/graphql'

  try {
    // check if loginData no exist
    if (!loginData.identifier && !loginData.password) {
      response = await request(endpoint, query)
    } else {
      const jwt = await checkLoginUser({
        url,
        identifier: loginData.identifier,
        password: loginData.password,
      })

      response = await new GraphQLClient(endpoint, {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      }).request(query)
    }

    // console.log(response)

    // Loop languages
    languages.forEach((lang) => {
      const pathname = `${path}/${lang}.json`

      // Rewrite the existing JSON
      _write(pathname, response)

      // Clean the JSON languages file
      cleanup(pathname)

      setTimeout(() => cleanup(pathname), 1000)
    })
  } catch (e) {
    log(chalk`{red [ERROR]} modifyContent`)
    throw new Error('Was an error: ', e.error)
  }
}
