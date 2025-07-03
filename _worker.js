addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 定义要代理的目标网站
  const targetUrl = 'https://www.banzhu111111.com/'
  
  // 获取请求的路径和查询参数
  const url = new URL(request.url)
  const path = url.pathname
  const query = url.search
  
  // 构建新的请求
  const proxyRequest = new Request(targetUrl + path + query, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'manual'
  })
  
  try {
    // 发送请求到目标网站
    const response = await fetch(proxyRequest)
    
    // 复制响应头
    const headers = new Headers(response.headers)
    
    // 添加 CORS 头（可选）
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', '*')
    
    // 返回响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    })
  } catch (error) {
    // 错误处理
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
