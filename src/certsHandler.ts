import { JSONResponse } from './certsH'

// 校验权限
const permAuth =  async (reqest:RRequest, type: PermissonType)=> {
  const token = reqest.headers.get('Authorization')
  if (!token) {
    return false
  }
  const tokenDetail = await CERT_SYNC_KV.get<Token>(`token-${token}`, 'json')
  if (!tokenDetail) {
    return false
  }
  const permission = tokenDetail[reqest.params?.name ?? 'none']
  if (permission.indexOf(type) === -1) {
    return false
  }
  return true
}

// 获取证书
const getCertHandler =async (request:RRequest) => {
  // 验证用户是否有读取权限
  if(!await permAuth(request, 'read')) {
    return new JSONResponse().response(401)
  }
  // 获取请求域名
  let domainKVName = request.params?.name
  console.log(JSON.stringify(request.params))
  // 检测是否有域名
  if (domainKVName === undefined) {
    return new Response('Code 400 \ndomainname not exist', {status:400, statusText: 'bad request'})
  } 
  domainKVName += '@' + (request.params?.label ?? 'lastest')

  // 读取kv数据库

  try {
    const cert = await CERT_SYNC_KV.get<Cert>(domainKVName, 'json')
    if (cert) {
      // 读取成功
      return new JSONResponse(undefined, cert).response(200)
    } else {
      // 读取失败
      return new JSONResponse('cert not exists').response(404)
    }
  } catch (e) {
    return new JSONResponse('read cert failed: '+ e).response(500)
  }
}

// 添加证书 
const addCertHandler =async (request:RRequest) => {
  // 验证用户是否有读取权限
  if(!await permAuth(request, 'write')) {
    return new JSONResponse().response(401)
  }

  let domainKVName = request.params?.name
  console.log(JSON.stringify(request.params))
  // 检测是否有域名
  if (domainKVName === undefined) {
    return new JSONResponse('domainname required').response(400)
  } 
  domainKVName += '@' + (request.params?.label ?? 'lastest')
  // 检查证书是否已经存在
  if (await CERT_SYNC_KV.get<Cert>(domainKVName, 'json')) {
    return new JSONResponse('domainname already exists').response(405)
  }

  // 获取cert内容
  const certValue = await request.json<CertValue>()
  const now = Date.now()
  const cert:Cert = {
    updated_at: now,
    created_at: now,
    value: certValue
  }
  // 写入
  try {
    // 设定三个月过期
    await CERT_SYNC_KV.put(domainKVName, JSON.stringify(cert), {expirationTtl: 60 * 60 * 24 * 90})
    return new JSONResponse('add new cert successful').response()
  } catch (e) {
    return new JSONResponse('add new cert failed: '+ e).response(500)
  }
}

// 删除证书 
const delCertHandler = async (request:RRequest) => {
  if(!await permAuth(request, 'write')) {
    return new JSONResponse().response(401)
  }

  let domainKVName = request.params?.name
  console.log(JSON.stringify(request.params))
  // 检测是否有域名
  if (domainKVName === undefined) {
    return new JSONResponse('domainname required').response(400)
  } 
  domainKVName += '@' + (request.params?.label ?? 'lastest')
  // 检查证书是否已经存在
  if (!(await CERT_SYNC_KV.get<Cert>(domainKVName, 'json'))) {
    return new JSONResponse('domainname not exists').response(404)
  }
  // 删除KV
  try {
    await CERT_SYNC_KV.delete(domainKVName)
    return new JSONResponse('del cert successful').response()
  } catch (e) {
    return new JSONResponse('del cert failed: '+ e).response(500)
  }
}


// 修改证书内容
const modCertHandler =async (request:RRequest) => {
  if(!await permAuth(request, 'write')) {
    return new JSONResponse().response(401)
  }

  let domainKVName = request.params?.name
  console.log(JSON.stringify(request.params))
  // 检测是否有域名
  if (domainKVName === undefined) {
    return new JSONResponse('domainname required').response(400)
  } 
  domainKVName += '@' + (request.params?.label ?? 'lastest')
  const cert = (await CERT_SYNC_KV.get<Cert>(domainKVName, 'json'))
  // 检查证书是否已经存在
  if (!cert) {
    return new JSONResponse('domainname not exists').response(404)
  }
  // 更新证书
  cert.updated_at = Date.now()
  cert.value = await request.json<CertValue>()
  try {
    // 设定三个月过期
    await CERT_SYNC_KV.put(domainKVName, JSON.stringify(cert), {expirationTtl:60 * 60 * 24 * 90})
    return new JSONResponse('mod cert successful').response()
  } catch (e) {
    return new JSONResponse('mod cert failed: '+ e).response(500)
  }
}

export default {
  getCertHandler, 
  addCertHandler, 
  delCertHandler, 
  modCertHandler,
}