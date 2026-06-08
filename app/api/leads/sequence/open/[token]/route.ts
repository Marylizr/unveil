import { connectToDatabase } from "@/lib/server/db";
import { trackingPixel, trackSequenceOpen } from "@/server/services/emailSequenceService";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  await connectToDatabase()
    .then(() => trackSequenceOpen(params.token))
    .catch(() => false);

  return new Response(trackingPixel(), {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
