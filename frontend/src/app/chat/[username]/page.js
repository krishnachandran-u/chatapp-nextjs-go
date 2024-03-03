"use client"
import { useEffect, useState, useRef } from "react";

const Chat = ({params}) => {
    const inputRef = useRef("");
    const receiverRef = useRef("");

    const [socket, setSocket] = useState(null);
    const [messages, setMessage] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:8080/ws?userID=" + params.username);
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log("Connected to WebSocket server");
            setSocket(newSocket);
        };

        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessage(prevMessages => [...prevMessages, message]);
        };

        return () => {
            if(socket) {
                socket.close();
            }
        };
    }, []);


    const sendMessage = (receiverID) => {
        if (socket && inputRef.current.value.trim() !== '') {
            const message = {
                sender_id: params.username,
                receiver_id: receiverID,
                content: inputRef.current.value
            };

            socket.send(JSON.stringify(message));
            inputRef.current.value = "";
            console.log("message sent");
        }
    }

    return (
        <div className = "bg-white w-screen h-screen text-black flex flex-col justify-between items-center p-[24px] gap-[16px]">
           <div className = "w-full bg-slate-100 overflow-y-scroll h-full rounded-[16px] p-[16px]">
                {messages.map((message, index) => (
                    <div className = "border-[1px] border-black rounded-[8px] flex flex-col gap-[8px] p-[8px]">
                        <div>Sender: {message.sender_id}</div>
                        <div>Receiver: {message.receiver_id}</div>
                        <div>Message: {message.content} </div>
                    </div>
                ))}
            </div> 
           <div className = "bg-white flex flex-col justify-center items-start w-full gap-[16px]">
            <input className = "border-[1px] border-1 border-slate-300 rounded-[4px] p-[8px] w-[200px]" type = "text" placeholder = "receiver" ref = {receiverRef} />
            <div className = "w-full flex flex-row gap-[10px]">
                <input className = "border-[1px] border-1 border-slate-300 rounded-[4px] p-[8px] w-full" type = "text" placeholder = "message" ref = {inputRef}/>
                <button className = "bg-black text-white rounded-[8px] p-[8px] hover:bg-slate-500 transition-colors duration-300" onClick = {() => sendMessage(receiverRef.current.value)}>send</button>
            </div>
           </div>
        </div>
    )
}

export default Chat;