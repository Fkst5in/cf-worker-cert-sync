// 引入 certs 相关 handlerk
import { BaseResponse, JSONResponse } from './certsH'
import certs from './certsHandler'
// import { Request } from 'itty-router'

const pass =async () => {
  return new JSONResponse().response()
}

const missingHandler = async (request:RRequest) => {
  return new JSONResponse(`resource ${(new URL(request.url)).pathname} not exists`).response(404)
  // return new Response(`Code 404 \nresource ${(new URL(request.url)).pathname} not exist`, {status: 404, statusText: 'resource not exist'})
}
const pathErrHandler = async () => {
  return new BaseResponse().response(400)
}

export {
  missingHandler,
  pathErrHandler,
  certs,
  pass
}
