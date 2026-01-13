import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class SocketService {
    private client: Client;
    private connected: boolean = false;

    constructor() {
        this.client = new Client({
            // Point to your Spring Boot WebSocket endpoint
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                this.connected = true;
                console.log('Connected to WebSocket');
            },
            onDisconnect: () => {
                this.connected = false;
                console.log('Disconnected from WebSocket');
            },
            debug: (str) => console.log(str),
        });
    }

    connect(onConnectCallback?: () => void) {
        this.client.onConnect = (frame) => {
            this.connected = true;
            if (onConnectCallback) onConnectCallback();
        };
        this.client.activate();
    }

    disconnect() {
        this.client.deactivate();
    }

    // Subscribe to a specific chat session (e.g., /topic/chat/session-123)
    subscribeToChat(sessionId: string, callback: (message: any) => void) {
        if (!this.client.connected) return;

        return this.client.subscribe(`/topic/chat/${sessionId}`, (message) => {
            callback(JSON.parse(message.body));
        });
    }

    // Subscribe to the agent queue (for Support Manager)
    subscribeToQueue(callback: (session: any) => void) {
        if (!this.client.connected) return;

        return this.client.subscribe('/topic/support/queue', (message) => {
            callback(JSON.parse(message.body));
        });
    }

    sendMessage(sessionId: string, message: any) {
        if (!this.client.connected) return;

        this.client.publish({
            destination: `/app/chat/${sessionId}/sendMessage`,
            body: JSON.stringify(message),
        });
    }
}

export const socketService = new SocketService();