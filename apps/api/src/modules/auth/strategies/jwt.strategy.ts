// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// Extender la interfaz Request para incluir cookies
interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

// Función extractora corregida
const cookieExtractor = (req: Request): string | null => {
  let token: string | null = null;

  // Verificar si req tiene cookies (gracias a cookie-parser)
  if (req && 'cookies' in req) {
    const reqWithCookies = req as RequestWithCookies;
    token = reqWithCookies.cookies['token'] || null;
  }

  // Si no está en cookie, intentar header Authorization (para compatibilidad)
  if (!token && req.headers.authorization) {
    token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  }

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      // Aseguramos que JWT_SECRET está definido (usar ! o valor por defecto)
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name || null,
    };
  }
}
