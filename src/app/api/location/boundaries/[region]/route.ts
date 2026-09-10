import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";

// Server-only boundary GeoJSON, kept out of `public/` and the client bundle.
// Files live in the repo's top-level `boundaries/` dir and are streamed on demand.
const BOUNDARY_FILES: Record<string, string> = {
  lsoa: "LSOA.geojson",
  datazones: "DataZones.geojson",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ region: string }> },
) {
  const { region } = await params;
  const fileName = BOUNDARY_FILES[region];

  if (!fileName) {
    return new Response("Unknown boundary region", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "boundaries", fileName);

  let size: number;
  try {
    size = (await stat(filePath)).size;
  } catch {
    return new Response("Boundary data not found", { status: 404 });
  }

  const stream = Readable.toWeb(
    createReadStream(filePath),
  ) as ReadableStream<Uint8Array>;

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
