export {}
declare global {
  const CERT_SYNC_KV: KVNamespace

  type Obj = {
    [propName: string]: string
  }

  interface RRequest extends Request {
    params?: Obj
    query?: Obj
  }

  
  type CertValue = {
    cert:string
    chain:string
    fullchain:string
    privkey:string
  }
  
  type Cert = {
    created_at: number,
    updated_at: number,
    value: CertValue,
  }
  // 权限类型
  export type PermissonType = 'write' | 'read'
  // token 储存格式 
  export type Token = {
    [domainName: string]: Array<PermissonType>
  }

  // http 响应码
  export type HttpStatus = 200 | 400 | 401 | 404 | 405 | 500
}

