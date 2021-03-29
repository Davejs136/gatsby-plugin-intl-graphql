import fs from 'fs-extra'
import chalk from 'chalk'
import { log } from 'console'
import { template } from './template'

export async function _write(path, content = '') {
  // Extract the language from path
  const lang = path
    .match(/[a-z]{2}\./gi)[0]
    .split('')
    .splice(0, 2)
    .join('')

  // If exist then create
  try {
    const data = await fs.readJson(path)

    if (!content) {
      log(
        chalk`{green success} {cyan intl-graphql} The file for ${lang} language already exists`
      )
    } else {
      // Loop the query data and write in the JSON file
      for (const i in content) {
        data[i] = content[i]
      }

      const dataToString = JSON.stringify(data)

      // Save the new data
      fs.outputFileSync(path, dataToString)

      log(
        chalk`{green success} {cyan intl-graphql} Writing queries for ${lang} language`
      )
    }
  } catch (e) {
    // Else create the path with its json files needed
    try {
      await fs.outputJson(path, template(lang))
      log(
        chalk`{green success} {cyan intl-graphql} The file for ${lang} language created `
      )
    } catch (e) {
      log(chalk`{red [ERROR]} {white _write}`)
      console.error(e.error)
    }
  }
}
