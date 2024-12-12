'use client';
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

import 'stream-chat-react/dist/css/v2/index.css';
import './layout.css';

const apiKey = '3pts2x46x4wy';
const userId = 'acc2';
const userName = 'Rahul';

const fetchToken = async (userId) => {
  const response = await fetch('http://localhost:5000/getToken', {
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
const filters = {
  type: 'messaging',
  members: { $in: [userId] },
};
const options = {
  limit: 10,
};

const ChatComponent = ({ userToken }) => {
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
  const [userToken, setUserToken] = useState  (null);

  useEffect(() => {
    const setupToken = async () => {
      try {
        const token = await fetchToken(userId);
        setUserToken(token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    setupToken();
  }, []);

  if (!userToken) {
    return <div>Fetching token and setting up client...</div>;
  }

  return <ChatComponent userToken={userToken} />;
};

export default App;

