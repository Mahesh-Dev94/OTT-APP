import axios from 'axios';
import awsmobile from '../aws-exports';
const registerURl =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/registerUser';
const initialAuth = 'https://cognito-idp.us-west-2.amazonaws.com';
const getUserURl =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/getUserAttributes';
const updateProfileURL =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/updateUserAttributes';

export const registerUser = async email => {
  console.log('fetch token api called', email);
  if (!email) {
    return;
  }

  const postData = {
    email: email,
  };

  try {
    const response = await axios.post(registerURl, postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
    console.log('An error occurred:', error);
  }
};

export const initialAuthUser = async email => {
  if (!email) {
    return;
  }
  const postData = {
    AuthFlow: 'CUSTOM_AUTH',
    AuthParameters: {
      USERNAME: email,
    },
    ClientId: awsmobile.aws_user_pools_web_client_id,   //ClientID,
    UserPoolId:awsmobile.aws_user_pools_id    //UserPoolID,
  };

  try {
    console.log('postData-----',postData)
    const response = await axios.post(initialAuth, postData, {
      headers: {
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        'Content-Type': 'application/x-amz-json-1.1',
      },
    });

    if (response.status === 200) {
      console.log(postData,'--------######respondToAuthChallenge#####----', response.data);
      return response.data;
    }else{
      return response
    }
  } catch (error) {
    return error;
  }
};

export const respondToAuthChallenge = async (email, otp, session) => {
  if (!email) {
    return;
  }
  const postData = {
    ChallengeName: 'CUSTOM_CHALLENGE',
    ChallengeResponses: {
      USERNAME: email,
      ANSWER: otp,
    },
    ClientId: awsmobile.aws_user_pools_web_client_id,
    Session: session,
  };

  try {
    const response = await axios.post(initialAuth, postData, {
      headers: {
        'X-Amz-Target':
          'AWSCognitoIdentityProviderService.RespondToAuthChallenge',
        'Content-Type': 'application/x-amz-json-1.1',
      },
    });

    if (response.status === 200) {
      console.log(postData,'--------######respondToAuthChallenge#####----', response.data);
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

export const updateUserProfile = async data => {
  // console.log('Update user info', data);

  const postData = {
    userAttributes: data.userAttributes,
    username: data.username,
    userPoolId:awsmobile.aws_user_pools_id,
  };


  try {
    const response = await axios.post(updateProfileURL, postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

export const getloggedUserInfo = async email => {
  if (!email) {
    return;
  }

  const postData = {
    attributesToGet: [
      'gender',
      'name',
      'picture',
      'phone_number',
      'birthdate',
      'email',
    ],
    // filter:`\"email\"=\"${email}\"`,
    // limit: 1,
    "userName" :email,
    userPoolId: awsmobile.aws_user_pools_id,
  };
  console.log('getloggedUserInfo postData---', postData);

  try {
    const response = await axios.post(getUserURl, postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      console.log('get user info response---', response.data);
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
