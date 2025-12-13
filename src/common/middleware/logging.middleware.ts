import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip } = req;

        res.on('finish', () => {
            const { statusCode } = res;
            if (statusCode >= 400) {
                const user = (req as any).user;
                this.logger.warn(
                    `Failed Request: ${method} ${originalUrl} ${statusCode} - IP: ${ip} - User: ${user ? user.email : 'Guest'}`,
                );
            }
        });

        next();
    }
}
