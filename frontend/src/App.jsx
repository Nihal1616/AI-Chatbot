import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Authentication.jsx";
import { MyContext } from "./MyContext.jsx";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import server from '../environment.js'

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // Authentication state
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // <-- new

  // Verify token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${server}/api/verifyToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setAuthToken(token);
            setUsername(data.username);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            setIsAuthenticated(false);
          }
        })
        .catch(() => setIsAuthenticated(false))
        .finally(() => setLoadingAuth(false));
    } else {
      setLoadingAuth(false);
    }
  }, []);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    authToken,
    setAuthToken,
    username,
    setUsername,
    isAuthenticated,
    setIsAuthenticated,
  };

  // Show loading while verifying token
  if (loadingAuth) return <div>Loading...</div>;

  

  return (
    <div>
      <MyContext.Provider value={providerValues}>
        {!isAuthenticated ? (
          <div className="auth-page">
            <Auth />
          </div>
        ) : (
          <div className="app">
            <Sidebar />
            <ChatWindow />
          </div>
        )}
      </MyContext.Provider>
    </div>
  );
}

export default App;
