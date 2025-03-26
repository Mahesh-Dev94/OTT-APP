import React from 'react';
import {View, Text, TextInput, StyleSheet, Platform,TouchableWithoutFeedback, Pressable} from 'react-native';
import {Controller} from 'react-hook-form';
import { darkGray, white } from '../../../helper/Color';

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
}) => {
  // const inputRef = React.createRef()
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View
            style={[
              styles.container,
              {borderColor: error ? 'red' : '#e8e8e8'},
            ]}>
           
            <TextInput
            underlayColor={'transparent'}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              style={styles.input}
              placeholderTextColor={'gray'}
              secureTextEntry={secureTextEntry}
              editable={name==='dob'? false:true}
             selectTextOnFocus={name==='dob'? false:true}
            />
          </View>
          {error && (
            <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:darkGray,
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: [Platform.OS==='android'?{color:white}:{color:white,height:50}],
});

export default CustomInput;
