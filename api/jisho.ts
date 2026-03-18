export const config = {
  runtime: 'edge'
}

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword') || ''

  const response = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }
  )

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
