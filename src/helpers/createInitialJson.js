import writeJsonFile from './writeJsonFile';

export default function createInitialJson(pathname, languages) {
  languages.forEach(lang => {
    const path = `${pathname}/${lang}.json`
    writeJsonFile(path)
  })
}