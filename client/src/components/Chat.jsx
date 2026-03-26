import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/SocketContext';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';


const Chat = ({roomId, userId}) => {

  const {participants, chatsContainerOpen, socket} = useContext(SocketContext);
  const [texts, setTexts] = useState([])
  const [textInput, setTextInput] = useState('');
  const senderName = localStorage.getItem('userName') || 'Unknown user';
  

 

  const sendMsg = async () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;

    const newMessage = {
      senderId: userId,
      senderName,
      text: trimmed,
      createdAt: Date.now(),
    };

    socket.emit("new-chat", { msg: newMessage, roomId });
    setTexts((current) => [...current, newMessage]);
    setTextInput('');
  }

  useEffect(() =>{
    const onNewChatArrived = ({msg, room}) => {
      if (room === roomId){
        setTexts((current) => [...current, msg]);
      }
    };

    socket.on("new-chat-arrived", onNewChatArrived);

    return () => {
      socket.off("new-chat-arrived", onNewChatArrived);
    };
  }, [socket, roomId])

  const onInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMsg();
    }
  };



  return (
    <div className='chats-page' 
    style={chatsContainerOpen ? {right: "1vw"} : {right: "-25vw"}}
    >
        <h3>Chat Room..</h3>
        <hr id='h3-hr' />
        
        <div className="chat-container">

          <div className="chat-messages-box">

          {texts.length > 0 ? 
            texts.map((i, id) => {
              const label = i.senderName || participants[i.senderId] || 'Unknown user';
              return (
                <div className="message-body" key={id}>
                <span className="sender-name">{label}</span>
                <p className="message">{i.text}</p>
              </div>
              )
            })
         : 
         <p>no chats</p>}

          </div>
          <div className="send-messages-box">
            <input type="file" id='fileInput'  />
            <label htmlFor='fileInput'><AttachFileIcon /></label>
            <input type="text" placeholder='Type a message and press Enter' value={textInput} onKeyDown={onInputKeyDown} onChange={(e)=> setTextInput(e.target.value)} />
            <button onClick={sendMsg} disabled={!textInput.trim()}><SendIcon /></button>
          </div>
        </div>
    </div>
  )
}

export default Chat;