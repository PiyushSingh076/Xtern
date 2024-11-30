import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.URL || 'http://localhost:4000';

if (API_BASE_URL === 'http://localhost:4000') {
  console.warn('Using default API base URL. Set the URL environment variable for production.');
}

const useRegisterUser = (userData, loading, error) => {
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    message: null,
    data: null,
  });

  useEffect(() => {
    const registerUser = async () => {
      if (!userData) {
        console.error('User data not available.');
        setRegistrationStatus({
          success: false,
          message: 'User data is missing.',
          data: null,
        });
        return;
      }

      const { uid: id, firstName: name, email, photo_url: dp } = userData;
      const password = id; 

      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          id,
          email,
          password,
          dp,
        });

        console.log('Registration Successful:', response.data);
        setRegistrationStatus({
          success: true,
          message: 'Registration successful',
          data: response.data,
        });
      } catch (error) {
        if (error.response) {
          console.error('Error Response:', error.response.data);
          setRegistrationStatus({
            success: false,
            message: error.response.data.message || 'Error occurred',
            data: null,
          });
        } else if (error.request) {
          console.error('No Response:', error.request);
          setRegistrationStatus({
            success: false,
            message: 'No response received from the server.',
            data: null,
          });
        } else {
          console.error('Error:', error);
          setRegistrationStatus({
            success: false,
            message: error.message,
            data: null,
          });
        }
      }
    };

    if (userData && !loading && !error) {
      registerUser();
    }
  }, [userData, loading, error]);

  return registrationStatus;
};

export default useRegisterUser;