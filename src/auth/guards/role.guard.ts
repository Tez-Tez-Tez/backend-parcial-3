import { CanActivate, ExecutionContext, Injectable, ForbiddenException} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean{
        const list = this.reflector.get<string[]>('roles',context.getHandler())

        if(!list){
            return true
        }

        const undecod= context.switchToHttp().getRequest();
        const user = undecod.user;

        if(!user){
            throw new ForbiddenException("Usuario no autenticado")
        }

        if(!list.includes(user.role)){
            throw new ForbiddenException('No tienes permisos para acceder')
        }
        return true;
    }
}