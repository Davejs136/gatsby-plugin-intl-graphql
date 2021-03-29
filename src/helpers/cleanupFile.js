import fs from 'fs-extra'
import chalk from 'chalk'
import { log } from 'console'

export async function cleanup(path) {
  try {
    // Read JSON
    const res = await fs.readJson(path)
    const str = JSON.stringify(res)
    const isStatic = !!res.static
    const _static = isStatic ? res.static : false
    let temp = {}

    // Get the "lang" object
    const lang = res.static.lang

    if (!str.includes(`content_${lang}`)) return

    delete res.static

    if (isStatic) {
      temp = {
        static: { ..._static },
      }
    } else {
      temp = {
        static: {
          lang,
        },
      }
    }

    Object.entries(res).forEach((item) => {
      item.forEach((el) => {
        if (typeof el === 'object') {
          let index = Object.keys(el).findIndex(
            (content) => content === `content_${lang}`
          )
          let content = { content: Object.values(el)[index] }
          temp[item[0]] = content
        }
      })
    })

    // Save the new data as String
    const stringify = JSON.stringify(temp, null, 2)

    // Then save it
    fs.outputFileSync(path, stringify)

    // print("green", "cyan", "success","intl-graphql", `content field suffix cleanup`)
    chalk`{green success} {cyan intl-graphql} Content field suffix cleanup `
  } catch (e) {
    log(chalk`{red [ERROR]} cleanup`)
    throw new Error(e)
  }
}
