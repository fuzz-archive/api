export function CheckObject (obj: Record<string, unknown>): boolean {
  if (!Object.keys(obj).length) {
    return false
  }
  return true
}

export function FormatPost (post: any): Record<string, string> {
  return {
    title: post.title,
    author: '/u/' + post.author_fullname,
    subreddit: post.subreddit_name_prefixed,
    image_url: post.url,
    source: 'https://www.reddit.com' + post.permalink,
    awards: post.total_awards_received,
    nsfw: post.over_18,
    upvotes: post.ups,
    downvotes: post.downs
  }
}
