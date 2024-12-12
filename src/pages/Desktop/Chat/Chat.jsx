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
import { Menu } from 'lucide-react';
import "stream-chat-react/dist/css/v2/index.css";
import "./layoutchat.css";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const App = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isChannelListOpen, setIsChannelListOpen] = useState(true);
  const { userData } = useFetchUserData();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const user2FirstName = searchParams.get("firstName");
  const user2Uid = searchParams.get("uid");

  useEffect(() => {
    if (!userData || !user2Uid || !user2FirstName) return;

    const initializeChat = async () => {
      try {
        const chatClient = StreamChat.getInstance("3pts2x46x4wy");

        const tokenResponse = await fetch("https://us-central1-startup-a54cf.cloudfunctions.net/getToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.uid }),
        });
        const { token } = await tokenResponse.json();
        setUserToken(token);

        await chatClient.connectUser(
          {
            id: userData.uid,
            name: userData.firstName,
          },
          token
        );

        const filters = {
          type: "messaging",
          members: { $in: [userData.uid] },
        };

        const sort = { last_message_at: -1 };
        const options = { limit: 10 };

        setClient(chatClient);

        const members = [
          { id: userData.uid, name: userData.firstName },
          { id: user2Uid, name: user2FirstName },
        ];

        const channelResponse = await fetch(
          "https://us-central1-startup-a54cf.cloudfunctions.net/getChannel",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              members: members.map((member) => member.id),
              createdById: userData.uid,
            }),
          }
        );
        const { channelId } = await channelResponse.json();

        const chatChannel = chatClient.channel("messaging", channelId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (err) {
        console.error("Error initializing chat:", err.message);
      }
    };

    initializeChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [userData, user2Uid, user2FirstName]);

  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
  };

  useEffect(() => {
    // Set the CSS variable for navbar height
    document.documentElement.style.setProperty('--navbar-height', '64px'); // Adjust this value to match your navbar height
  }, []);

  if (!client || !channel || !userToken) return <LoadingIndicator />;

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
              onChannelSelect={(selectedChannel) => setChannel(selectedChannel)}
            />
          </div>
          <div className="channel-container">
            <Channel channel={channel}>
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

