import React, { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [messageHistory, setMessageHistory] = useState([
    { message: "test message", type: "bot" }
  ]);

  const sendMessage = React.useCallback(
    async (e) => {
      // task 3
      e.preventDefault();
    },
    [userName, message]
  );

  useEffect(() => {
    let getDebouncedMessages = setTimeout(async () => {
      try {
        // task 1
        const res = await fetch(`http://localhost:3000/message`, {
          mode: "no-cors"
        });
        setMessageHistory(res);
      } catch (error) {
        console.log(error);
      }
    }, 10);
    return () => {
      clearTimeout(getDebouncedMessages);
    };
  }, []);

  return (
    <div className="App">
      <h1>Hello FrauenLoop</h1>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username" />
      <form>
        <label htmlFor="message">Message:</label>
        <input type="text" id="message" name="message" />
        <input type="submit" value="Submit" />
      </form>
      <h2>Messages</h2>
      <ol>
        {messageHistory.map((message) => (
          <li key={message.message}>{message.message}</li>
        ))}
      </ol>
    </div>
  );
}
