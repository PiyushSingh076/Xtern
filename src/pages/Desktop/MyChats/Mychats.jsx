import { useEffect, useState } from 'react';
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { Menu } from 'lucide-react';
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

import 'stream-chat-react/dist/css/v2/index.css';
import './layout.css';

const apiKey = '3pts2x46x4wy';

const fetchToken = async (userId) => {
  const response = await fetch('https://us-central1-startup-a54cf.cloudfunctions.net/getToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  const data = await response.json();
  if (response.ok) {
    return data.token;
  } else {
    throw new Error(data.message || 'Failed to fetch token');
  }
};

const sort = { last_message_at: -1 };

const ChatComponent = ({ userToken, userId, userName }) => {
  const user = {
    id: userId,
    name: userName,
    image: `https://getstream.io/random_png/?name=${userName}`,
  };

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  const [isChannelListOpen, setIsChannelListOpen] = useState(true);

  if (!client) return <div>Setting up client & connection...</div>;

  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
  };

  const filters = {
    type: 'messaging',
    members: { $in: [userId] },
  };
  const options = {
    limit: 10,
  };

  return (
    <div className="chat-wrapper">
      <Chat client={client}>
        <div className="chat-container">
          <button className="menu-toggle" onClick={toggleChannelList}>
            <Menu size={24} />
          </button>
          <div className={`channel-list ${isChannelListOpen ? 'open' : ''}`}>
            <ChannelList filters={filters} sort={sort} options={options} />
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

const App = () => {
  const { userData } = useFetchUserData();
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    if (userData?.uid) {
      const setupToken = async () => {
        try {
          const token = await fetchToken(userData.uid);
          setUserToken(token);
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      };

      setupToken();
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  if (!userToken) {
    return <div>Fetching token and setting up client...</div>;
  }

  return <ChatComponent userToken={userToken} userId={userData.uid} userName={userData.firstName} />;
};

export default App;
