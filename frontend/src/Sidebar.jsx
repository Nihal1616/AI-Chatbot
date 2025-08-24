import React, { useEffect } from "react";
import "./Sidebar.css";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThread = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/thread");
      const res = await response.json();
      const filteredDate = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredDate);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThread();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread=async(newThreadId)=>{
    setCurrThreadId(newThreadId);

    try{
      const response=await fetch(`http://localhost:8000/api/thread/${newThreadId}`);
      const res=await response.json();
      
      setPrevChats(res);
      setNewChat(false);
      setReply(null);

    }catch(err){
      console.log(err)
    }

  }

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/thread/${threadId}`,
        { method: "DELETE" }
      );
      const res = await response.json();
      

      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sidebar">
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" className="logo" alt="logo"></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* history */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadId)}>
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); //stop event bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>
      {/* sign */}
      <div className="sign">
        <p>By Nihal &hearts;</p>
      </div>
    </div>
  );
}
