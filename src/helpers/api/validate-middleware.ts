async function validateMiddleware(req: { json: () => any }, schema: {
    validate: (arg0: any, arg1: {
      abortEarly: boolean // include all errors
      allowUnknown: boolean // ignore unknown props
      stripUnknown: boolean
    }) => { error: any; value: any }
  }) {
  if (!schema) return

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  }

  const body = await req.json()
  const { error, value } = schema.validate(body, options)

  if (error) {
    throw `Validation error: ${error.details.map((x: { message: any }) => x.message).join(', ')}`
  }

  // update req.json() to return sanitized req body
  req.json = () => value
}

export { validateMiddleware }
