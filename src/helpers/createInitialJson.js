import { _write } from './writeFile'

export default function createInitialJson(pathname, languages) {
  languages.forEach(lang => {
    const path = `${pathname}/${lang}.json`
    _write(path)
  })
}