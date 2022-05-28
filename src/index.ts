export {}
import {missingHandler, pathErrHandler, certs as certsHandler} from './handler'


import { Router, IHTTPMethods } from 'itty-router'
  
const router = Router<Request, IHTTPMethods>()
const v1Router = Router<Request, IHTTPMethods>({base:'/v1'})
const certsRouter = Router<Request, IHTTPMethods>({base:'/v1/certs'})
// 证书相关 添加路由
certsRouter
  // 获取证书
  .get('/:name/:version?', certsHandler.getCertHandler)
  // 添加新证书
  .post('/:name/:version?', certsHandler.addCertHandler)
  // 更新证书
  .put('/:name/:version?', certsHandler.modCertHandler)
  // 删除证书
  .delete('/:name/:version?', certsHandler.delCertHandler)
  
// 连接到v1路由上
v1Router.all('/certs/*', certsRouter.handle).all('*', missingHandler)
router.all('/v1/*', v1Router.handle).all('*', pathErrHandler)
// 添加监听器
self.addEventListener('fetch', FetchEvent=>{
  FetchEvent.respondWith(router.handle(FetchEvent.request))
})