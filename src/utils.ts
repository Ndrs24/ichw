export async function waitSeconds(num: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, num * 1000))
}
