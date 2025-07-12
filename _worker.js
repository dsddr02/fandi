addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 定义要代理的目标网站
  const targetUrl = 'https://www.6yydstxt426.com/';

  // 获取请求的路径和查询参数
  const url = new URL(request.url);
  const path = url.pathname;
  const query = url.search;

  // --- 关键修改部分开始 ---
  // 创建一个新的 Headers 对象，复制原始请求的 Headers
  const newHeaders = new Headers(request.headers);

  // 设置或修改 X-Forwarded-For 头，伪造一个中国 IP 地址
  // 注意：这个 IP 地址是一个示例，你需要确保它是一个有效的中国 IP 段
  // 不同的网站可能有不同的IP归属地数据库，一个IP不一定在所有数据库中都被识别为中国
  const chinaIp = '223.5.5.5'; // 这是一个阿里云的公共DNS IP，通常被识别为中国大陆IP
  newHeaders.set('X-Forwarded-For', chinaIp);

  // 如果目标网站也可能检查 CF-Connecting-IP，也可以设置
  // 但通常 X-Forwarded-For 更常用作客户端IP标识
  // newHeaders.set('CF-Connecting-IP', chinaIp);

  // --- 关键修改部分结束 ---

  // 构建新的请求，使用修改后的 Headers
  const proxyRequest = new Request(targetUrl + path + query, {
    method: request.method,
    headers: newHeaders, // 使用新的 Headers
    body: request.body,
    redirect: 'manual'
  });

  try {
    // 发送请求到目标网站
    const response = await fetch(proxyRequest);

    // 复制响应头
    const responseHeaders = new Headers(response.headers);

    // 添加 CORS 头（可选）
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');

    // 返回响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    // 错误处理
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
