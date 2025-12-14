import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // Subscribe to global status channel
    @SubscribeMessage('subscribe:global')
    handleSubscribeGlobal(@ConnectedSocket() client: Socket) {
        client.join('global');
        return { event: 'subscribed', channel: 'global' };
    }

    // Subscribe to rooms channel
    @SubscribeMessage('subscribe:rooms')
    handleSubscribeRooms(@ConnectedSocket() client: Socket) {
        client.join('rooms');
        return { event: 'subscribed', channel: 'rooms' };
    }

    // Subscribe to vehicles channel
    @SubscribeMessage('subscribe:vehicles')
    handleSubscribeVehicles(@ConnectedSocket() client: Socket) {
        client.join('vehicles');
        return { event: 'subscribed', channel: 'vehicles' };
    }

    // Subscribe to equipment channel
    @SubscribeMessage('subscribe:equipment')
    handleSubscribeEquipment(@ConnectedSocket() client: Socket) {
        client.join('equipment');
        return { event: 'subscribed', channel: 'equipment' };
    }

    // Legacy support - join any room
    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(room);
        return { event: 'joinedRoom', room };
    }

    // Emit booking created event
    emitBookingCreated(booking: any) {
        this.server.emit('booking.created', booking);
        this.server.to('global').emit('booking.created', booking);

        // Emit to specific type channel
        const channelMap = {
            'ROOM': 'rooms',
            'VEHICLE': 'vehicles',
            'EQUIPMENT': 'equipment',
        };
        const channel = channelMap[booking.resourceType];
        if (channel) {
            this.server.to(channel).emit('booking.created', booking);
        }
    }

    // Emit booking confirmed event
    emitBookingConfirmed(booking: any) {
        this.server.emit('booking.confirmed', booking);
        this.server.to('global').emit('booking.confirmed', booking);

        const channelMap = {
            'ROOM': 'rooms',
            'VEHICLE': 'vehicles',
            'EQUIPMENT': 'equipment',
        };
        const channel = channelMap[booking.resourceType];
        if (channel) {
            this.server.to(channel).emit('booking.confirmed', booking);
        }
    }

    // Emit booking cancelled event
    emitBookingCancelled(booking: any) {
        this.server.emit('booking.cancelled', booking);
        this.server.to('global').emit('booking.cancelled', booking);

        const channelMap = {
            'ROOM': 'rooms',
            'VEHICLE': 'vehicles',
            'EQUIPMENT': 'equipment',
        };
        const channel = channelMap[booking.resourceType];
        if (channel) {
            this.server.to(channel).emit('booking.cancelled', booking);
        }
    }

    // Emit resource status changed event
    emitResourceStatusChanged(resource: any) {
        this.server.emit('resource.status_changed', resource);
        this.server.to('global').emit('resource.status_changed', resource);

        const channelMap = {
            'ROOM': 'rooms',
            'VEHICLE': 'vehicles',
            'EQUIPMENT': 'equipment',
        };
        const channel = channelMap[resource.type];
        if (channel) {
            this.server.to(channel).emit('resource.status_changed', resource);
        }
    }
}
