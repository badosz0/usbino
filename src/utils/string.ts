export function generate_string(length: number, capital: boolean, lower: boolean, numbers: boolean): string {
    const characters = "" +
        (capital ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "") +
        (lower ? "abcdefghijklmnopqrstuvwxyz" : "") +
        (numbers ? "0123456789" : "")

    let result = ""
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}