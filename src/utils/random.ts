export function generateRandomNumber(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10); // สุ่มตัวเลข 0-9
    }
    return result;
}