// Cloudflare Pages static assets ignore Range headers (always 200 + full file).
// iPhone/Safari needs 206 Partial Content to play <video>, so slice the MP4 here.
// Only /assets/video/* runs through this function; everything else stays plain static.
export async function onRequest({ request, env }) {
  const method = request.method;
  if (method !== "GET" && method !== "HEAD") return env.ASSETS.fetch(request);
  const asset = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
  if (!asset.ok) return asset;
  const headers = new Headers(asset.headers);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=86400");
  headers.delete("content-encoding");
  const range = request.headers.get("range");
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m || (m[1] === "" && m[2] === "")) {
    if (method === "HEAD") {
      const len = asset.headers.get("content-length");
      if (len) headers.set("content-length", len);
      return new Response(null, { status: 200, headers });
    }
    return new Response(asset.body, { status: 200, headers });
  }
  const body = await asset.arrayBuffer();
  const size = body.byteLength;
  let start, end;
  if (m[1] === "") { start = Math.max(0, size - Number(m[2])); end = size - 1; }
  else { start = Number(m[1]); end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1); }
  if (start >= size || start > end) {
    headers.set("content-range", `bytes */${size}`);
    headers.set("content-length", "0");
    return new Response(null, { status: 416, headers });
  }
  headers.set("content-range", `bytes ${start}-${end}/${size}`);
  headers.set("content-length", String(end - start + 1));
  return new Response(method === "HEAD" ? null : body.slice(start, end + 1), { status: 206, headers });
}
