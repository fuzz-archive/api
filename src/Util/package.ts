import { readFileSync } from 'fs'
import { join } from 'path'

export interface PackageJson {
  name: string
  version: string
  description: string
  main: string
  scripts: {
    [name: string]: string
  }
  authors: string[]
  contributors: string[]
  license: string
  devDependencies?: {
    [packageName: string]: string
  }
  dependencies?: {
    [packageName: string]: string
  }
  repository?: {
    type: string
    url: string
  }
  keywords?: string[]
  bugs?: {
    url: string
  }
  homepage?: string
}

const pkg: PackageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), { encoding: 'utf-8' }))

export default pkg
