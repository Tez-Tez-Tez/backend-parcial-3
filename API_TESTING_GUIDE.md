# Guía de Pruebas de API - Backend Parcial 3

## 🚀 Inicio Rápido

### Opción 1: VS Code REST Client (Recomendado)
1. Instala la extensión "REST Client" en VS Code
2. Abre el archivo `api-tests.http`
3. Haz clic en "Send Request" sobre cada petición

### Opción 2: Postman
1. Importa el archivo `api-tests.http` en Postman
2. O copia manualmente las requests

### Opción 3: cURL
Convierte las requests a cURL según necesites

---

## 📝 Instrucciones de Uso

### 1. Configurar Variables
En `api-tests.http`, actualiza:
```http
@baseUrl = https://backend-parcial-3-production.up.railway.app
@token = YOUR_TOKEN_HERE
```

### 2. Flujo de Prueba Recomendado

#### Paso 1: Autenticación
1. **Registrar usuario** (Request #1)
2. **Registrar admin** (Request #2)
3. **Login** (Request #3) - Copia el token del response
4. **Actualizar variable** `@token` con el token obtenido

#### Paso 2: Configurar Reglas
5. **Crear regla global** (Request #4)
6. **Crear regla para ROOM** (Request #5)
7. **Crear regla específica** (Request #6)
8. **Listar reglas** (Request #7)

#### Paso 3: Probar Reservas
9. **Crear reserva válida** (Request #11)
10. **Buscar disponibilidad** (Request #14)
11. **Ver historial** (Request #15, #16)
12. **Actualizar reserva** (Request #12)
13. **Cancelar reserva** (Request #13)

#### Paso 4: Tests de Validación
14. **Probar solapamiento** (Request #24) - Debe fallar
15. **Probar horario inválido** (Request #25) - Debe fallar
16. **Probar día bloqueado** (Request #26) - Debe fallar
17. **Probar duración excedida** (Request #27) - Debe fallar

#### Paso 5: Admin Dashboard (requiere token de admin)
18. **Ver estadísticas** (Request #20)
19. **Ver estado de recursos** (Request #21)
20. **Ver snapshot** (Request #22)
21. **Forzar cancelación** (Request #23)

---

## 🔑 Obtener Token

Después de hacer login (Request #3), recibirás una respuesta como:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Copia el `access_token` y reemplaza `YOUR_TOKEN_HERE` en la variable `@token`.

---

## ✅ Respuestas Esperadas

### Registro Exitoso
```json
{
  "id": 1,
  "mail": "test@example.com",
  "role": "user"
}
```

### Login Exitoso
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Crear Reserva Exitosa
```json
{
  "id": 1,
  "resourceId": 1,
  "resourceType": "ROOM",
  "startDate": "2025-12-20T10:00:00.000Z",
  "endDate": "2025-12-20T12:00:00.000Z",
  "status": "pending",
  "createdAt": "2025-12-13T20:00:00.000Z"
}
```

### Recursos Disponibles
```json
[
  {
    "id": 1,
    "type": "ROOM",
    "name": "Sala A",
    "capacity": 10,
    "status": "available"
  }
]
```

### Admin Stats
```json
{
  "totalBookings": 150,
  "todayBookings": 5,
  "activeBookings": 12,
  "cancelledBookings": 8
}
```

---

## ❌ Errores Comunes

### 401 Unauthorized
- **Causa**: Token inválido o expirado
- **Solución**: Hacer login nuevamente y actualizar el token

### 400 Bad Request - Solapamiento
```json
{
  "statusCode": 400,
  "message": "El recurso ya está reservado en ese horario"
}
```

### 400 Bad Request - Horario
```json
{
  "statusCode": 400,
  "message": "Horario permitido: 08:00 - 18:00"
}
```

### 403 Forbidden
- **Causa**: Intentando acceder a endpoint de admin sin permisos
- **Solución**: Usar token de usuario con role "admin"

---

## 🧪 Tests de Validación

### Test 1: Solapamiento
Intenta crear dos reservas que se solapen en tiempo para el mismo recurso.
**Resultado esperado**: Error 400

### Test 2: Horario Inválido
Intenta reservar fuera del horario permitido (ej: 22:00-23:00).
**Resultado esperado**: Error 400

### Test 3: Día Bloqueado
Intenta reservar en domingo (si está bloqueado).
**Resultado esperado**: Error 400

### Test 4: Duración Excedida
Intenta reservar por más tiempo del permitido.
**Resultado esperado**: Error 400

---

## 📊 WebSocket Testing

Para probar WebSockets, usa un cliente como Socket.IO Client:

```javascript
const socket = io('https://backend-parcial-3-production.up.railway.app');

// Suscribirse a canal de salas
socket.emit('subscribe:rooms');

// Escuchar eventos
socket.on('booking.created', (data) => {
  console.log('Nueva reserva:', data);
});

socket.on('booking.cancelled', (data) => {
  console.log('Reserva cancelada:', data);
});

socket.on('resource.status_changed', (data) => {
  console.log('Estado de recurso cambió:', data);
});
```

---

## 📚 Documentación Swagger

Accede a la documentación interactiva en:
```
https://backend-parcial-3-production.up.railway.app/api/docs
```

Desde Swagger puedes:
- Ver todos los endpoints
- Probar requests directamente
- Ver ejemplos de request/response
- Ver esquemas de datos

---

## 🎯 Checklist de Pruebas

- [ ] Registro de usuario
- [ ] Login
- [ ] Crear reglas de reserva
- [ ] Crear reserva válida
- [ ] Buscar disponibilidad
- [ ] Ver historial de usuario
- [ ] Ver historial de recurso
- [ ] Actualizar reserva
- [ ] Cancelar reserva
- [ ] Test de solapamiento (debe fallar)
- [ ] Test de horario inválido (debe fallar)
- [ ] Test de día bloqueado (debe fallar)
- [ ] Test de duración excedida (debe fallar)
- [ ] Admin: Ver estadísticas
- [ ] Admin: Ver estado de recursos
- [ ] Admin: Ver snapshot
- [ ] Admin: Forzar cancelación
- [ ] Filtrar recursos por tipo
- [ ] Filtrar recursos por estado
- [ ] WebSocket: Eventos de reserva
- [ ] Swagger: Documentación completa
