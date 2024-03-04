"use client"
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const Chat = ({params}) => {
    const inputRef = useRef("");
    const receiverRef = useRef("");
    const chatContainerRef = useRef(null);

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

    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);


    const sendMessage = (receiverID) => {
        if (socket && inputRef.current.value.trim() !== '') {
            const message = {
                sender_id: params.username,
                receiver_id: receiverID.trim(),
                content: inputRef.current.value.trim()
            };
            setMessage(prevMessages => [...prevMessages, message]);

            socket.send(JSON.stringify(message));
            inputRef.current.value = "";
            console.log("message sent");
        }
    }

    return (
        <div className = "bg-white w-screen h-screen text-black flex flex-col justify-between items-center p-[24px] gap-[16px] lg:p-[96px] md:text-2xl md:p-[32px]">
           <div className = "w-full bg-slate-100 overflow-y-scroll h-full rounded-[16px] p-[16px] flex flex-col gap-[16px] transiton-all duration-300 overflow-x-hidden" ref = {chatContainerRef}>
            <AnimatePresence>
                {messages.map((message, index) => (
                    <motion.div 
                        key = {index}
                        initial = {{ opacity: 0, y: 20 }}
                        animate = {{ opacity: 1, y: 0 }}
                        exit = {{ opacity: 0, y: -20 }}
                        className = {`bg-slate-300 rounded-[8px] flex flex-col gap-[8px] md:p-[16px] p-[8px] overflow-hidden ${message.sender_id == params.username? "items-end lg:ml-[200px] md:ml-[100px] ml-[50px]" : "lg:mr-[200px] md:mr-[100px] mr-[50px]"}`}
                    >
                        <div className = "md:text-base font-bold">{/*Sender:*/} {message.sender_id}</div>
                        {/*<div className = "md:text-base">Receiver: {message.receiver_id}</div>*/}
                        <div className = "md:text-2xl text-xl"> {/*Message:*/} {message.content} </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            </div> 
           <div className = "bg-white flex flex-col justify-center items-start w-full gap-[16px]">
            <input className = "border-[1px] border-1 border-slate-300 rounded-[4px] p-[8px] md:w-[500px] w-[200px]" type = "text" placeholder = "receiver" ref = {receiverRef} />
            <div className = "w-full flex flex-row gap-[10px]">
                <input className = "border-[1px] border-1 border-slate-300 rounded-[4px] p-[8px] w-full" type = "text" placeholder = "message" ref = {inputRef}/>
                <button 
                    className = "bg-black text-white rounded-[8px] p-[8px] hover:bg-slate-500 transition-colors duration-300 lg:size-16 flex flex-col justify-center items-center h-full size-12" 
                    onClick = {() => sendMessage(receiverRef.current.value)}
                >
                    <IoMdSend />
                </button>
            </div>
           </div>
        </div>
    )
}

export default Chat;