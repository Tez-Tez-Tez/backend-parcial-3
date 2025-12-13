import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import {Strategy, ExtractJwt} from 'passport-jwt'
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(private config:ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: config.get('config.jwt') || 'fallback_secret_key'
        });
    }

    async validate(payload:any){
      return {id: payload.id,
        role: payload.role}
    }
}