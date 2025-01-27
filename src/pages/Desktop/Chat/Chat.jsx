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
import "stream-chat-react/dist/css/v2/index.css";
import "./layoutchat.css";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const apiKey = "3pts2x46x4wy";

const fetchToken = async (userId) => {
  const response = await fetch("https://us-central1-startup-a54cf.cloudfunctions.net/api/getToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error("Failed to fetch token");
  return data.token;
};

const fetchOrCreateChannel = async (user1, user2, createdById) => {
  console.log(user1, user2, createdById);
  const response = await fetch("https://us-central1-startup-a54cf.cloudfunctions.net/api/getChannel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      members: [{ name: user1.name, id: user1.id }, { name: user2.name, id: user2.id }],
      createdById,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error("Failed to create or fetch channel");
  return data.channelId;
};

const ChatApp = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isChannelListOpen, setIsChannelListOpen] = useState(true);
  const { userData } = useFetchUserData();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const user2FirstName = searchParams.get("firstName");
  const user2Uid = searchParams.get("uid");

  useEffect(() => {
    if (!userData) return;

    const setupChat = async () => {
      try {
        const chatClient = StreamChat.getInstance(apiKey);

        const userToken = await fetchToken(userData.uid);
        await chatClient.connectUser(
          { id: userData.uid, name: userData.firstName },
          userToken
        );

        setClient(chatClient);
      } catch (error) {
        console.error("Chat setup error:", error.message);
      }
    };

    setupChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [userData]);

  useEffect(() => {
    const setupInitialChannel = async () => {
      if (!userData || !user2Uid || !user2FirstName || !client) return;
  
      try {
        const channelId = await fetchOrCreateChannel(
          { id: userData.uid, name: userData.display_name },
          { id: user2Uid, name: user2FirstName },
          userData.uid
        );
  
        const channelName = userData.uid === user2Uid
          ? userData.firstName
          : user2FirstName;
  
        const chatChannel = client.channel("messaging", channelId, {
          name: channelName, // Display user2's name for user1
          members: [userData.uid, user2Uid],
        });
  
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        console.error("Channel setup error:", error.message);
      }
    };
  
    setupInitialChannel();
  }, [userData, user2Uid, user2FirstName, client]);
  

  const toggleChannelList = () => setIsChannelListOpen((prev) => !prev);

  if (!client) return <LoadingIndicator />;

  const filters = { type: "messaging", members: { $in: [userData?.uid] } };
  const sort = { last_message_at: -1 };
  const options = { limit: 10 };

  return (
    <div className="chat-wrapper">
      <Chat client={client}>
        <div className="chat-container">

          <div className="channel-container">
            {channel ? (
              <Channel channel={channel} key={channel.id}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            ) : (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>Select a channel to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default ChatApp;
