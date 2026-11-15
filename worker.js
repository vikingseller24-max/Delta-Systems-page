export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Serve your wrapper page (index.html) when visiting the root "/" without ?canva=1
    if (url.pathname === "/" && !url.searchParams.has("canva")) {
      return env.ASSETS.fetch(request);
    }

    // 2. Proxy the Canva website and all its /_assets/* files directly
    const targetUrl = new URL("https://canva.site" + url.pathname + url.search);
    targetUrl.searchParams.delete("canva");

    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.set("Host", "wombat-6srdm1.my.canva.site");
    proxyHeaders.set("Origin", "https://canva.site");
    proxyHeaders.set("Referer", "https://canva.site/");

    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      redirect: "follow"
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.delete("X-Frame-Options");
    newHeaders.delete("Content-Security-Policy");
    newHeaders.delete("Content-Security-Policy-Report-Only");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
