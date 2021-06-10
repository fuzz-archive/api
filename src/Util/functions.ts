export function CheckObject (obj: object): boolean {
	if (!Object.keys(obj).length) {
		return false
	}
	return true
}

export function FormatPost (post): object {
	return {
		title: post.title,
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		author: '/u/' + post.author_fullname,
		subreddit: post.subreddit_name_prefixed,
		image_url: post.url,
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		source: 'https://www.reddit.com' + post.permalink,
		awards: post.total_awards_received,
		nsfw: post.over_18,
		upvotes: post.ups,
		downvotes: post.downs
	}
}
