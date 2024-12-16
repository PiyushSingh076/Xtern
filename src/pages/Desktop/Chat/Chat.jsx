import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  LoadingIndicator,
} from "stream-chat-react";
import { Menu } from "lucide-react";
import "stream-chat-react/dist/css/v2/index.css";
import "./layoutchat.css";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const App = () => {
  const [client, setClient] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isChannelListOpen, setIsChannelListOpen] = useState(true);
  const { userData } = useFetchUserData();
  const location = useLocation();

  useEffect(() => {
    if (!userData) return;

    const initializeChat = async () => {
      try {
        const chatClient = StreamChat.getInstance("3pts2x46x4wy");

        // Fetch token for the current user
        const tokenResponse = await fetch("http://localhost:5000/getToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.uid }),
        });
        const { token } = await tokenResponse.json();
        setUserToken(token);

        await chatClient.connectUser(
          {
            id: userData.uid,
            name: userData.display_name,
          },
          token
        );

        setClient(chatClient);
      } catch (err) {
        console.error("Error initializing chat:", err.message);
      }
    };

    initializeChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [userData]);

  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
  };

  useEffect(() => {
    // Set the CSS variable for navbar height
    document.documentElement.style.setProperty("--navbar-height", "64px");
  }, []);

  if (!client || !userToken) return <LoadingIndicator />;

  const filters = { type: "messaging", members: { $in: [userData.uid] } };
  const sort = { last_message_at: -1 };
  const options = { limit: 10 };

  return (
    <div className="chat-wrapper">
      <Chat client={client}>
        <div className="chat-container">
          <button className="menu-toggle" onClick={toggleChannelList}>
            <Menu size={24} />
          </button>
          <div className={`channel-list ${isChannelListOpen ? "open" : ""}`}>
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
            />
          </div>
          <div className="channel-container">
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default App;
