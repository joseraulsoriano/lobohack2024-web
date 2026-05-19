import { Elysia } from 'elysia'

export class HttpError extends Error {
  public constructor(
    public message: string,
    public statusCode: number,
    public errorData: unknown = undefined
  ) {
    super(message)
  }

  public static BadRequest(message?: string, errorData?: unknown) {
    return new HttpError(message || 'Bad Request', 400, errorData)
  }

  public static Unauthorized(message?: string, errorData?: unknown) {
    return new HttpError(message || 'Unauthorized', 401, errorData)
  }

  public static Forbidden(message?: string, errorData?: unknown) {
    return new HttpError(message || 'Forbidden', 403, errorData)
  }

  public static NotFound(message?: string, errorData?: unknown) {
    return new HttpError(message || 'Not Found', 404, errorData)
  }

  public static Conflict(message?: string, errorData?: unknown) {
    return new HttpError(message || 'Conflict', 409, errorData)
  }

  public static Internal(message?: string, errorData?: unknown) {
    return new HttpError(message || 'Internal Server Error', 500, errorData)
  }
}

export const httpErrorDecorator = new Elysia({
  name: 'elysia-http-error-decorator',
}).decorate('HttpError', HttpError)

export const httpError = () =>
  new Elysia({ name: 'elysia-http-error' })
    .error({ ELYSIA_HTTP_ERROR: HttpError })
    .onError(({ code, error, set }) => {
      if (code === 'ELYSIA_HTTP_ERROR') {
        set.status = error.statusCode
        return {
          error: true,
          code: error.statusCode,
          message: error.message,
          data: error.errorData,
        }
      }
    })
