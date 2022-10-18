import url from 'url'

export const IS_ENTRY_MODULE =
  import.meta.url === url.pathToFileURL(process.argv[1]).href
