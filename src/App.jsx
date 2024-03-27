import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {io} from "socket.io-client"; 
import axios from 'axios';



const socket = io();




function App() {


  const [message , setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([]);


 
  


 useEffect(  () => {
  socket.on('user connected', newUser => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  });

  socket.on('connect', () => {
    UserEnter(socket.id)

  });

  socket.on('user disconnected', userId => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  });



  
  

  const receiveMessageHandler = (messageArr) => {
    setMessages(prevMessages => [...prevMessages, messageArr]);

  };

  socket.on('receive-message', receiveMessageHandler);


  return () => {
    socket.off('receive-message', receiveMessageHandler);
    socket.off('user connected');
    socket.off('user disconnected');
    socket.off("connect")

  };


 } , [])



  function SendMessage(){
    const messageArr = {
      id: socket.id, 
      message: message,
    };
    socket.emit("send-message", messageArr)
    setMessage('')

  
  }

  
  const UserEnter = (id) => {
    const list = document.getElementById("list-messages")
    const list_item = document.createElement("li")
    list_item.innerHTML = `User ${id.substring(0, 5)} logged in`
    list_item.classList.add("item_user");
    list.appendChild(list_item);

  }

  
  




  return (
    <>
      <nav className="bg-slate-700 h-16 mb-5">
        <div>
            
        </div>
        <div>
            
        </div>
      </nav>

      <div className="overflow-y-scroll h-200 w-10/12 m-auto flex flex-col justify-end overflow-auto relative h-96 border-solid border-blue-800 border-4 rounded-md">
      <h3 className="text-center text-xl font-bold bg-slate-200">Messages</h3>
      
        <ul className="flex-grow overflow-auto m-2" id='list-messages'>

        {messages.map((message) => (
          <>
            {
              socket.id == message.id ?
                <li className="text-end bg-blue-300 rounded-md p-1 m-0.5">{message.message} : User {message.id.substring(0, 5)} </li>
              :
                <li className="bg-blue-300 rounded-md p-1 m-0.5 w-1/2">User {message.id.substring(0, 5)} : {message.message}</li>

            }




          </>
        ))}

        </ul>
        <div className="py-4 text-center mb-5 bottom-0">
          <input placeholder='Message' className='bord mx-3 text-lg border-blue-200 border-solid border-2 rounded-md' type="text" onChange={(e) => setMessage(e.target.value)} value={message}  />
          <button className=" hover:animate-pulse text-md border-solid border-blue-300 border-2 rounded-lg p-1 w-24" type='button' onClick={SendMessage} >SEND</button>
        </div>
      </div>

      <footer>

      </footer>
    </>
  )
}

export default App
