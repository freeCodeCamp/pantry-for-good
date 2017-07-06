export class HttpError extends Error {
  constructor() {
    super()
  }
}

export class BadRequestError extends HttpError {
  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || 'Invalid request'
    this.status = 400
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || 'Unauthorized'
    this.status = 401
  }
}

export class ForbiddenError extends HttpError {
  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || 'User is not authorized'
    this.status = 403
  }
}

export class NotFoundError extends HttpError {
  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || 'Not found'
    this.status = 404
  }
}

export class ValidationError extends BadRequestError {
  constructor(paths, message) {
    super(message || 'Validation error')
    this.name = this.constructor.name
    this.paths = paths
  }
}

export class SimulatedError extends Error {
  constructor(message) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message || 'Simulated error'
    this.status = 500
  }
}

const defaultResponse = {
  message: 'Something went wrong on the server',
  status: 500
}

export default function getErrorMessage(err) {
  if (err.code && err.code === 11000 || err.code === 11001) {
    return {
      message: 'Unique field already exists',
      status: 400
    }
  }

  if (err instanceof HttpError) {
    return {
      message: err.message,
      status: err.status,
      paths: err.paths
    }
  }

  return defaultResponse
}
