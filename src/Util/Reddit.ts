import centra from 'centra'
import { FormatPost } from './functions'
import pkg from './package'

export async function Fetch (sub: string) {
  const search = ['top', 'rising', 'new', 'hot']
  const res = await centra(`https://api.reddit.com/r/${sub}/${search[Math.floor(Math.random() * search.length)]}`).header({
    'User-Agent': `OvOAPI V${pkg.version}`
  }).send()
  const Unfiltered = await res.json()
  const Filtered = FormatPost(Unfiltered.data.children[Math.floor(Math.random() * Unfiltered.data.children.length)].data)
  return Filtered
}
