import React, { useEffect, useState, useRef, useContext } from "react";
import { MyContext } from "./MyContext";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const chatRef = useRef(null);

  // Typing effect
  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    if (!reply) return;
    // If reply is an object like {reply: 'text'}, extract the string
    const replyText =
      typeof reply === "object" && reply !== null && "reply" in reply
        ? reply.reply
        : reply;
    const content = String(replyText).split(" ");
    let idx = 0;
    setLatestReply(""); // reset on new reply

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <>
      {newChat && <h2>Start a New Chat!</h2>}
      <div className="chats" ref={chatRef}>
        {prevChats?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {prevChats.lenght > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key="non-typing">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gptDiv" key="typing">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
