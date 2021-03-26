import fs from 'fs-extra'
import chalk from 'chalk'
import { log } from 'console'

export default async function cleanJsonFile(path) {
  try {
    const langObject = await fs.readJson(path)
    const langObjectString = JSON.stringify(langObject)
    const lang = langObject.static.lang
    const isStatic = !!langObject.static
    const $static = isStatic ? langObject.static : false

    let tempObject = {}

    if (!langObjectString.includes(`content_${lang}`)) return

    const { static: _, ...restObjectLang } = langObject

    isStatic ? tempObject = {static:{ ...$static }} : tempObject = {static:{ lang }}

    Object.entries(restObjectLang).forEach((item) => {
      item.forEach((el) => {
        if (typeof el === 'object') {
          let index = Object.keys(el).findIndex(
            (content) => content === `content_${lang}`
          )
          let content = { content: Object.values(el)[index] }
          tempObject[item[0]] = content
        }
      })
    })

    const langString = JSON.stringify(tempObject, null, 2)

    fs.outputFileSync(path, langString)

    log(
      chalk`{green success} {cyan intl-graphql} Content field suffix cleanup `
    )

  } catch (error) {
    log(chalk`{red [ERROR]} cleanJsonFile`)
    throw new Error(error.message)
  }
}
