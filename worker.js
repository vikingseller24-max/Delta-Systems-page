export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy the Canva Website on /site and remove iframe restrictions
    if (url.pathname.startsWith("/site")) {
      const targetPath = url.pathname.replace(/^\/site/, "") || "/";
      const targetUrl = "https://wombat-6srdm1.my.canva.site" + targetPath + url.search;

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
          "Accept": request.headers.get("Accept") || "*/*"
        }
      });

      const newHeaders = new Headers(response.headers);
      newHeaders.delete("X-Frame-Options");
      newHeaders.delete("Content-Security-Policy");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }

    // Serve your index.html for everything else
    return env.ASSETS.fetch(request);
  }
};
