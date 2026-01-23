import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt, task } = await request.json();
  const accId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  let model = task === 'image-gen' 
    ? '@cf/stabilityai/stable-diffusion-xl-base-1.0' 
    : '@cf/meta/llama-3-8b-instruct';

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accId}/ai/run/${model}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(prompt),
    }
  );

  if (task === 'image-gen') {
    const buffer = await response.arrayBuffer();
    return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
  }

  const result = await response.json();
  return NextResponse.json(result.result);
}
