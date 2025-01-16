async function load(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error");
    }
    const data = await response.json();
    return data;
}
export async function fetchData(url) {
    const data = await load(url);
    return data;
}
export function randomNum(max) {
    return Math.floor(Math.random() * max);
}
export function randomRandomNum(max) {
    return randomNum(max);
}
