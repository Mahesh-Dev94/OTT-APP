import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { black } from '../../../helper/Color';
import { normalize } from '../../../helper/FontSize';

const CountdownTimer = ({ initialTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (timeRemaining > 0) {
      const intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = `${minutes}`;
    const formattedSeconds = `${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  if (timeRemaining <= 0) {
    // Return null to hide the view when timeRemaining is 0:00 or less
    return  <Text style={{ fontSize: normalize(1.3), fontFamily: 'Montserrat-Medium', color: 'red' }}>
	Expired!
  </Text>;
  }

  const formattedTime = formatTime(timeRemaining);

  return (
    <View>
      <Text style={{ fontSize: normalize(1.3), fontFamily: 'Montserrat-Medium', color: black }}>
        Expires in: {formattedTime}
      </Text>
    </View>
  );
};

export default CountdownTimer;
