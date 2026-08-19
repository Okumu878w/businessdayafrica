import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Called by the backend's utils/revalidate.js right after a post is
// published, edited, or unpublished — makes the change go live within
// seconds instead of waiting for the next scheduled ISR window.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || body.secret !== process.env.NEXTJS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  const paths: string[] = Array.isArray(body.paths) ? body.paths : [];
  if (!paths.length) {
    return NextResponse.json({ error: "No paths provided." }, { status: 400 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
