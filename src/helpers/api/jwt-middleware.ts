import { auth } from '../'

async function jwtMiddleware(req: { headers: any }, isJwt = false) {
  const id = await auth.verifyToken(req, isJwt)
  req.headers.set('userId', id)
}

export { jwtMiddleware }
