export class CertX  {
  created_at: number
  updated_at: number
  value: CertValue

  constructor(cert:CertValue) {
    this.created_at = Date.now()
    this.updated_at = Date.now()
    this.value = cert
  }
}

// 基本响应
export class BaseResponse {
  protected message?: string
    
  constructor( message?:string) {
    this.message = message
  }

  /**
   * setDefaultMessage
   * message 未定义时，根据 status 状态生成 meassge
   */
  protected setDefaultMessage(status: HttpStatus) {
    status === 200 && (this.message = this.message ?? 'OK')
    status === 400 && (this.message = this.message ?? 'Bad Request')
    status === 401 && (this.message = this.message ?? 'Unauthorized')
    status === 404 && (this.message = this.message ?? 'Not Found')
    status === 405 && (this.message = this.message ?? 'Method Not Allowed')
    status === 500 && (this.message = this.message ?? 'Internal Server Error')
  }

  /**
   * genResBody
   * 生成响应体
   */
  protected genResBody() {
    return this.message
  }
  /**
     * response
     * 响应
     */
  public response(status:HttpStatus = 200) {
    this.setDefaultMessage(status)
    return new Response(this.genResBody(), {status: status})
  }
}
// JSON 响应
export class JSONResponse<T> extends BaseResponse {
  protected data?:T

  constructor( message?:string, data?:T) {
    super(message)
    this.data = data
  }

  /**
   * genResBody
   * 重写成响应Json
   */
  protected genResBody() {
    return JSON.stringify(this)
  }
}
