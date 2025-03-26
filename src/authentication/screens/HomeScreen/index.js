import React,{useEffect,useState} from 'react';
import {View, Text} from 'react-native';
// import {Auth} from 'aws-amplify';

const Index = () => {
  const signOut = () => {
    Auth.signOut();
  };

  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setUser(authUser);
      setUserName(authUser.username)
      setEmail(authUser.attributes.email)
      console.log(authUser.attributes.email_verified,'--authUser-----',authUser.attributes.email) 
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <View style={{flex: 1,margin:30}}>
      <Text style={{fontSize: 24, alignSelf: 'center',color:'gray'}}>Home, sweet home</Text>
       {userName && <Text style={{fontSize: 24, alignSelf: 'center',color:'gray'}} >{userName}</Text>}
       {email && <Text style={{fontSize: 24, alignSelf: 'center',color:'gray'}} >{email}</Text>}
      <Text
        onPress={signOut}
        style={{
          // width: '80%',
          textAlign: 'center',
          color: 'white',
          marginTop: 'auto',
          margin: 20,
          fontSize: 17,
          backgroundColor:'#6e4efe',
          padding:5,
          borderRadius:10
          
        }}>
        Sign out
      </Text>
    </View>
  );
};

export default Index;
