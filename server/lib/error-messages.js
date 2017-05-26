export default function getErrorMessage(err) {
  const defaultResponse = {
    message: 'Something went wrong',
    status: 500
  }

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        return {
          message: 'Unique field already exists',
          status: 400
        }
      default:
        return defaultResponse
    }
  } else {
    return defaultResponse
  }
}
