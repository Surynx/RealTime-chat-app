import { useEffect, useState } from 'react'

function App() {

  let [socket,setSocket] = useState();

  let [chat,setChat] = useState([]);

  const [name,setName] = useState("");

  const [message,setMessage] = useState("");

  const [alerts,setAlert] = useState([]);

  useEffect(()=>{

    let name = prompt("Enter your name");
    setName(name);

    let ws = new WebSocket("ws://localhost:3000");

    setSocket(ws);

    ws.onopen = ()=>{
      console.log("socket connection extablished");
      ws.send(JSON.stringify({ type:"join",user:name }));
    }

    ws.onmessage = (mess)=> {

      let data = JSON.parse(mess.data)

      if(data.type == "alert") {
        setAlert(prev=>[...prev,data.alert]);
      }else{
        setChat(prev=>[...prev,data])
      }

    }

    return ()=> ws.close();
  },[]);

  function sendMessage() {

    if (!message.trim()) return;

    const data = { type:"message",user:name,text:message }

    socket.send(JSON.stringify(data));

    setMessage("");
    
  }

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl flex flex-col">

        <div className="bg-black text-white p-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold">💬 Chat App</h2>
          <p className="text-sm opacity-80 font-bold">👤 User: {name}</p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user === name ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs ${
                  msg.user === name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="text-xs font-bold">{msg.user}</p>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            className="flex-1 border rounded-md px-2 py-1.5 outline-none"
            onChange={(e)=>setMessage(e.target.value)}
            value={message}
            placeholder="Type a message..."
          />
          <button
            className="bg-black text-white px-4 py-1.5 rounded-md cursor-pointer"
            onClick={sendMessage}
            >
            Send
          </button>
        </div>
      </div>
      <div className='h-auto w-50 ml-20 text-center border rounded-md'>
          <h1 className='text-white py-0.5 px-1 bg-black rounded-t-md'>🔔 Alerts</h1>
          {alerts.map((mess,index)=>{

            return (
              <div id={index} className='p-2'>
              <p className='italic text-gray-600 text-sm'>{mess}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default App
