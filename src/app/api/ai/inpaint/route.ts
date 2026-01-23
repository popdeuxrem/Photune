import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { image, mask } = await req.json();
  const accId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  if (!accId || !token) {
    return NextResponse.json({ error: "Cloudflare credentials missing" }, { status: 500 });
  }

  try {
    // Convert base64 inputs to Blobs
    const imageBlob = await (await fetch(image)).blob();
    const maskBlob = await (await fetch(mask)).blob();

    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('mask', maskBlob);
    formData.append('prompt', "seamless background, high detail, remove text, matching texture, fill-in naturally");

    // We use the stable-diffusion-v1-5-inpainting model provided in CF Workers AI free/pro tiers
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accId}/ai/run/@cf/runwayml/stable-diffusion-v1-5-inpainting`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Cloudflare AI error");

    const buffer = await response.arrayBuffer();
    return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Inpainting failed" }, { status: 500 });
  }
}
