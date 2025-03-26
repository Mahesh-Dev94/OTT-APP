import React,{useState,useEffect} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
const UserInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const session = useSelector(state => state.hasSession.hasSession);
  const [logo, setLogo] = useState('');
const _openDrawer=()=>{
  try {
    navigation.openDrawer()
  } catch (error) {
    console.warn('error',error)
  }

}
// update state when dispatch new data 
useEffect(()=>{
  if (session) {
    setLogo(session.user.picture)
  }else{
    setLogo('');
  }
}
,[session])

  return (
    <TouchableOpacity onPress={() => _openDrawer()} style={styles.userIconContainer}>
      <Image
        source={logo?{uri:logo}: require("../../assets/images/user.png")} // Replace with the path to your user's icon
        style={styles.userIcon}
      />
        <View style={{position:'absolute',bottom:0,right:0, justifyContent: 'center', alignItems: 'center',borderRadius:10, backgroundColor:'black',}}>
        <Icon
          name={'bars'}
          size={10}
          color={'white'}
          style={{padding:5}}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userIconContainer: {
    position: 'absolute',
    top: 10, // Adjust the top position as needed
    right: Platform.isTV ? 10 : 5, // Adjust the right position as needed
    borderRadius: 15,
    overflow: 'hidden',

  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});

export default UserInfo;