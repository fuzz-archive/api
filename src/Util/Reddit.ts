import centra from 'centra'
import { version } from '../../package.json'
import { FormatPost } from './functions'

export async function Fetch (sub: string) {
	const search = ['top', 'rising', 'new', 'hot']
	/* eslint-disable @typescript-eslint/no-unsafe-return */
	const res = await centra(`https://api.reddit.com/r/${sub}/${search[Math.floor(Math.random() * search.length)]}`).header({
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		'user-agent': `UwUAPI2 V${version}`
	}).send()
	const Unfiltered = await res.json()
	const Filtered = FormatPost(Unfiltered.data.children[Math.floor(Math.random() * Unfiltered.data.children.length)].data)
	return Filtered
}
