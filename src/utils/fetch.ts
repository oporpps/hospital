export default async function xfetch(url: string, options: RequestInit = {}) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    return await fetch(`${baseURL}${url}`, options);
}

export const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then((res) => res.json());