import fs from 'fs-extra'
import chalk from 'chalk'
import { log } from 'console'
import { template } from './template'

const extractLang = (str) =>
  str
    .match(/[a-z]{2}\./gi)[0]
    .split('')
    .splice(0, 2)
    .join('')

const setNewContent = (data, content) => {
  let tempData = data
  let tempContent = content

  for (const items in tempContent) {
    tempData[items] = tempContent[items]
  }

  return tempData
}

export default async function writeJsonFile(path, content = '') {
  // Extract the language from path
  const lang = extractLang(path)

  try {
    const data = await fs.readJson(path)

    if (!content) {
      log(
        chalk`{green success} {cyan intl-graphql} The file for ${lang} language already exists`
      )
      return
    }

    const result = setNewContent(data, content)
    const resultToString = JSON.stringify(result)

    fs.outputFileSync(path, resultToString)

    log(
      chalk`{green success} {cyan intl-graphql} Writing queries for ${lang} language`
    )
  } catch (_) {
    try {
      await fs.outputJson(path, template(lang))
      log(
        chalk`{green success} {cyan intl-graphql} The file for ${lang} language created `
      )
    } catch (error) {
      log(chalk`{red [ERROR]} {white writeJsonFile}`)
      throw new Error(error.message)
    }
  }
}
