export async function waitSeconds(num) {
    return new Promise((resolve) => setTimeout(resolve, num * 1000));
}
