const Chat = ({params}) => {
    return (
        <div className = "bg-white w-screen h-screen text-black flex flex-col justify-between items-center p-[24px] gap-[16px]">
           <div className = "w-full bg-slate-100 overflow-y-scroll h-full rounded-[16px]">
                
            </div> 
           <div className = "bg-white flex flex-col justify-center items-start w-full gap-[16px]">
            <input className = "border-[1px] border-1 border-slate-300 rounded-[4px] p-[8px] w-[200px]" type = "text" placeholder = "sender" />
            <div className = "w-full flex flex-row gap-[10px]">
                <input className = "border-[1px] border-1 border-slate-300 rounded-[4px] p-[8px] w-full" type = "text" placeholder = "message" />
                <button className = "bg-black text-white rounded-[8px] p-[8px] hover:bg-slate-500 transition-colors duration-300">send</button>
            </div>
           </div>
        </div>
    )
}

export default Chat;