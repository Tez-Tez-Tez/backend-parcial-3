import {registerAs} from '@nestjs/config'

export default registerAs ('config',()=>({
    port: parseInt(process.env.SERVER_PORT||'8080',10),
    jwt: process.env.SECRET_KEY_JWT,
    db:{
        port: parseInt(process.env.DB_PORT),
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD
    }
}))