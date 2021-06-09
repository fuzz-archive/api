export function CheckObject (obj: object): boolean {
	if (!Object.keys(obj).length) {
		return false
	}
	return true
}
