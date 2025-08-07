import { useEffect, useState } from 'react';

interface WebSocketData {
    type: 'TICKET_SALE' | 'CHECK_IN' | 'VENDOR_UPDATE';
    payload: any;
}

export const useWebSocket = (url: string) => {
    const [data, setData] = useState<WebSocketData | null>(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setData(message);
        };
        ws.onclose = () => console.log('WebSocket closed');
        return () => ws.close();
    }, [url]);

    return data;
};