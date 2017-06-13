/**
 * Get unique error field name
 */
const getUniqueErrorMessage = function(err) {
  let output

  try {
    const fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'))
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'

  } catch (ex) {
    output = 'Unique field already exists'
  }

  return output
}

/**
 * Get the error message from error object
 */
export const getErrorMessage = function(err) {
  let message = ''

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err)
        break
      default:
        message = 'Something went wrong'
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message
    }
  }

  return message
}
