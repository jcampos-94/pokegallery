// Fetch Data
export async function fetchData(api) {
    let response = await fetch(api);
    if (response.ok) {
        let data = await response.json();
        return data;
    }
}