import chalk from 'chalk'
import { log } from 'console'
import { request } from 'graphql-request'
import cleanJsonFile from './cleanJsonFile'
import extractGraphqlEndpoint from './extractGraphql'
import requestWithAuth from './requestWithAuth'
import writeJsonFile from './writeJsonFile'

export default async function modifyFileContent({
  path,
  url,
  query,
  languages,
  loginData = { identifier: '', password: '' },
}) {
  let response = null
  
  const endpoint = extractGraphqlEndpoint(url)

  try {
    if (!loginData.identifier && !loginData.password) {
      response = await request(endpoint, query)
    } else {
      response = await requestWithAuth(endpoint, query, {
        url,
        identifier: loginData.identifier,
        password: loginData.password,
      })
    }

    languages.forEach((lang) => {
      const pathname = `${path}/${lang}.json`

      writeJsonFile(pathname, response)
      cleanJsonFile(pathname)
    })

  } catch (error) {
    log(chalk`{red [ERROR]} modifyContent`)
    throw new Error(`There was an error: ${error.message}`)
  }
}
