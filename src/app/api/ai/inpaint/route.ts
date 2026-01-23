import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { image, mask } = await request.json();
  const accId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  const imageBlob = await (await fetch(image)).blob();
  const maskBlob = await (await fetch(mask)).blob();

  const formData = new FormData();
  formData.append('image', imageBlob);
  formData.append('mask', maskBlob);
  formData.append('prompt', "clean background, high quality, matching texture, no text");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accId}/ai/run/@cf/runwayml/stable-diffusion-v1-5-inpainting`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  const buffer = await response.arrayBuffer();
  return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
}
