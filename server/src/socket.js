import WebSocket,{WebSocketServer} from "ws"

export default function createWebSocket(server) {

    const wss = new WebSocketServer({ server:server });

    wss.on("connection",(socket)=>{

        console.log("client connected");

        socket.on("message",(msg)=>{

            let data = JSON.parse(msg);

            if(data.type == "join") {
                socket.user = data.user;

                wss.clients.forEach((client)=>{

                    if(client.readyState == WebSocket.OPEN) {
                        client.send(JSON.stringify({ alert:`${socket.user} joined the chat`,type:"alert" }));
                    }
                });
            }

            if(data.type == "message") {

                let res = { user:socket.user,message:data.text };

                wss.clients.forEach(client => {
                    
                    if(client.readyState == WebSocket.OPEN) {
                        client.send(JSON.stringify(res));
                    }

                });
            }
        });

        socket.on("close",()=>{

            wss.clients.forEach((client)=>{

                    if(client.readyState == WebSocket.OPEN) {
                        client.send(JSON.stringify({ alert:`${socket.user} left the chat`,type:"alert" }))
                    }
            });

            console.log(socket.user+" disconnected");
        })
    })
}