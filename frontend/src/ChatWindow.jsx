import React, { useContext, useState, useEffect } from "react";
import Chat from "./Chat.jsx";
import "./ChatWindow.css";

import { MyContext } from "./MyContext";
import { PulseLoader } from "react-spinners";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    username,
    setAuthToken,
    setIsAuthenticated,
    setUsername,
    authToken,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch("http://localhost:8000/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //append the chats to prevChats

  useEffect(() => {
    if (prompt && reply) {
      // If reply is an object like {reply: 'text'}, extract the string
      const replyText =
        typeof reply === "object" && reply !== null && "reply" in reply
          ? reply.reply
          : reply;
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: replyText,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Reset context values
    setIsAuthenticated(false);
    setAuthToken(null);
    setUsername(null);
  }

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          Chat_GPT <i className="fa-solid fa-angle-down userIcon"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span>
            <i className="fa-solid fa-circle-user"></i>
            <p style={{ fontSize: "16px" }}>{username}</p>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div onClick={handleLogout} className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <Chat></Chat>

      <PulseLoader color="#fff" loading={loading}></PulseLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          ChatGPT can make mistake.Check important info.See cookies Preferences.
        </p>
      </div>
    </div>
  );
}
