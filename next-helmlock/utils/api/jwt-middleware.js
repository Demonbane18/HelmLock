import { expressjwt } from 'express-jwt';
import util from 'util';

export { jwtMiddleware };

function jwtMiddleware(req, res) {
  const middleware = expressjwt({
    secret: serverRuntimeConfig.secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      // public routes that don't require authentication
      '/',
      '/signin',
    ],
  });

  return util.promisify(middleware)(req, res);
}
