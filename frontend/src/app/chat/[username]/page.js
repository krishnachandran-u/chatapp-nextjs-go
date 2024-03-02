const Chat = ({params}) => {
    return (
        <div className = "bg-white w-screen h-screen text-black flex flex-col justify-between items-center">
           <div className = "w-full bg-slate-100"></div> 
           <div className = "bg-white flex flex-col justify-center items-start w-full">
            <input className = "border-[1px] border-1 border-slate-300 rounded-[4px] p-[8px] w-[200px]" type = "text" placeholder = "sender" />
           </div>
        </div>
    )
}

export default Chat;