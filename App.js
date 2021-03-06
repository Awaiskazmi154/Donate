import React, { Component, useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Modal,
  Image,
  SafeAreaView,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
  Platform,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import { axios } from './axios';

// var users = [
//   {
//     user_name: 'john123',
//     name: 'John Smith',
//     blood_group: 'A+',
//     password: '@john123',
//     mobile_phone_no: '07911-123456',
//     email: 'jhonsmith12@gmail.com',
//     weight: '80kg',
//     dob: '02-09-1990',
//     gender: 'Male',
//     address: 'Street 123',
//     available: true,
//     requestsCount: 0,
//     donationsCount: 0,
//     donations: [],
//   },
//   {
//     user_name: 'smith123',
//     name: 'Micheal Smith',
//     blood_group: 'A+',
//     password: '@john123',
//     mobile_phone_no: '07911-123456',
//     email: 'jhonsmith12@gmail.com',
//     weight: '80kg',
//     dob: '02-09-1990',
//     gender: 'Male',
//     address: 'Street 123',
//     available: 'true',
//     requestsCount: 0,
//     donations: [],
//   },
//   {
//     user_name: 'ali123',
//     name: 'Ali Smith',
//     blood_group: 'A+',
//     password: '@john123',
//     mobile_phone_no: '07911-123456',
//     email: 'jhonsmith12@gmail.com',
//     weight: '80kg',
//     dob: '02-09-1990',
//     gender: 'Male',
//     address: 'Street 123',
//     available: 'true',
//     requestsCount: 0,
//     donations: [],
//   },
// ];
// var requests = [
//   {
//     req_id: 1,
//     name: 'Jhonson',
//     blood_group: 'A+',
//     amount_required: '2 litre',
//     needed_within: '30 minutes',
//     level: 'Critical',
//     location: 'New Street, London',
//     contact: '7911-123456',
//     responses: [],
//   },
//   {
//     req_id: 2,
//     name: 'Marie',
//     blood_group: 'B+',
//     amount_required: '3 litre',
//     needed_within: '2 hours',
//     level: 'Normal',
//     location: 'New Street, London',
//     contact: '7911-654321',
//     responses: [],
//   },
//   {
//     req_id: 3,
//     name: 'Julia',
//     blood_group: 'O+',
//     amount_required: '3 litre',
//     needed_within: '30 minutes',
//     level: 'Critical',
//     location: 'New Street, London',
//     contact: '7911-123321',
//     responses: [],
//   },
//   {
//     req_id: 4,
//     name: 'john123',
//     blood_group: 'O+',
//     amount_required: '3 litre',
//     needed_within: '30 minutes',
//     level: 'Critical',
//     location: 'New Street, London',
//     contact: '7911-123321',
//     responses: ['john123'],
//   },
// ];
// var acceptedRequests = [];

const Splash_Screen = (props) => {
  var users = [];
  const getUser = async () => {
    const response = await axios
      .get('/users')
      .catch((err) => console.log('' + err));
    if (response && response.data) {
      users = response.data;
      console.log(response.data);
    }
  };
  const _loadData = async () => {
    //await AsyncStorage.clear();
    console.log('loading ... ');
    var loggedIn = await AsyncStorage.getItem('isLoggedIn');
    var username = await AsyncStorage.getItem('user_name');
    console.log('loading DONE... ');
    console.log(users);

    if (loggedIn && username) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].user_name === username) {
          setTimeout(() => {
            props.navigation.navigate('MyBottomTabs', users[i]);
          }, 3000);
          break;
        }
      }
    } else {
      setTimeout(() => {
        props.navigation.navigate('StartScreen');
      }, 5000);
    }
  };

  useEffect(() => {
    getUser();
    setTimeout(() => {
      _loadData();
    }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ paddingLeft: 20, paddingTop: 15 }}>
        <ActivityIndicator size="large" color="#FF2156" />
        <Image
          style={{ width: 200, height: 100 }}
          source={require('./images/logo.png')}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}; 
const Start_Screen = (props) => {
  const [users, setUsers] = useState();
  const [getErrorMsg1, setErrorMsg1] = useState('');
  const [getErrorMsg2, setErrorMsg2] = useState('');
  const [getErrorMsg3, setErrorMsg3] = useState('');

  const [getUserName, setUserName] = useState('');
  const [getUserPassword, setUserPassword] = useState('');

  useEffect(() => {
    async function getUsers() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/users')
        .catch((err) => console.log('' + err));
      setUsers(response.data);
    }
    getUsers();
  }, [getUserName, getUserPassword]);

  const _login = async () => {
    console.log('saving........');
    await AsyncStorage.setItem('isLoggedIn', '1');
    await AsyncStorage.setItem('user_name', getUserName);
    console.log('saving done........');
  };
  const _getKeys = async () => {
    var keys = await AsyncStorage.getAllKeys();
    console.log(keys);
  };

  const validateLogin = (props) => {
    console.log('validating........');
    var notFound = true;
    users.map((item, key) => {
      item.user_name != getUserName
        ? setErrorMsg3('User Name not exists!')
        : (notFound = false);
      console.log(item.user_name);
    });
    console.log(users);

    if (notFound == false) {
      for (var i = 0; i < users.length; i++) {
        if (
          users[i].user_name == getUserName &&
          users[i].password == getUserPassword
        ) {
          _login();
          _getKeys();
          setErrorMsg3('');
          props.navigation.navigate('MyBottomTabs', users[i]);
          break;
        }
        setErrorMsg3('Password not correct!');
      }
    }
    console.log(users);
  };

  const validatePassword = (value) => {
    var userPasswordRegex = /^^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,8}$/;
    if (value.match(userPasswordRegex) || value == '') {
      setUserPassword(value), setErrorMsg2('');
    } else {
      setErrorMsg2('Password is invalid');
    }
  };

  const validateUserName = (value) => {
    var userNameRegex = /^[a-zA-Z]+[0-9]+$/;
    if (value.match(userNameRegex) || value == '') {
      setUserName(value), setErrorMsg1('');
    } else {
      setErrorMsg1('UserName is invalid');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>User Name</Text>
      <TextInput
        style={styles.input}
        placeholder={'Enter your username'}
        maxLength={8}
        textAlign={'center'}
        onChangeText={(val) => validateUserName(val)}
      />
      <Text style={{ color: 'red' }}>{getErrorMsg1}</Text>
      <Text style={styles.text1}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder={'Enter your password'}
        minLength={5}
        maxLength={8}
        textAlign={'center'}
        onChangeText={(val) => validatePassword(val)}
      />
      <Text style={{ color: 'red' }}>{getErrorMsg2}</Text>

      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          validateLogin(props);
        }}>
        <Text style={styles.textStyle}>Sign In</Text>
      </TouchableOpacity>
      <Text style={{ color: 'red' }}>{getErrorMsg3}</Text>
      <Image
        style={{ width: 100, height: 100 }}
        source={require('./images/start1.png')}
      />
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          props.navigation.navigate('Post_Request_Screen', { user_name: '' , address: '' });
        }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image
            style={{ width: 40, height: 40 }}
            source={require('./images/startPic.png')}
            resizeMode="contain"
          />
          <Text>Request For Blood</Text>
        </View>
      </TouchableOpacity>
      <Text>
        Want to donate blood?{' '}
        <Text
          style={{ color: 'red' }}
          onPress={() => props.navigation.navigate('Registration1_Screen', {})}>
          Sign Up{' '}
        </Text>
      </Text>
    </View>
  );
};
const Registration_1Screen = (props) => {
  const [getErrorMsg1, setErrorMsg1] = useState('');
  const [getErrorMsg2, setErrorMsg2] = useState('');
  const [getErrorMsg3, setErrorMsg3] = useState('');
  const [getErrorMsg4, setErrorMsg4] = useState('');

  const [getUserName, setUserName] = useState('');
  const [getUserEmail, setUserEmail] = useState('');
  const [getUserPassword, setUserPassword] = useState('');
  const [getUserFullName, setUserFullName] = useState('');

  const newUser = {
    user_name: '',
    name: '',
    blood_group: '',
    password: '',
    mobile_phone_no: '',
    email: '',
    weight: '',
    dob: '',
    gender: '',
    address: '',
    available: 'true',
    requestsCount: 0,
    donationsCount: 0,
    donations: [],
  };

  const validateUserName = (value) => {
    var userNameRegex = /^[a-zA-Z]+[0-9]+$/;
    if (value.match(userNameRegex) || value == '') {
      setUserName(value), setErrorMsg1('');
    } else {
      setErrorMsg1('UserName is invalid');
    }
  };

  const validateEmail = (value) => {
    var userEmailRegex = /\S+@\S+\.\S+/;
    if (value.match(userEmailRegex) || value == '') {
      setUserEmail(value), setErrorMsg2('');
    } else {
      setErrorMsg2('Email is invalid');
    }
  };

  const validatePassword = (value) => {
    var userPasswordRegex = /^^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,8}$/;
    if (value.match(userPasswordRegex) || value == '') {
      setUserPassword(value), setErrorMsg3('');
    } else {
      setErrorMsg3('Password is invalid');
    }
  };
  const validateUserFullName = (value) => {
    var userFNameRegex = /[a-zA-Z]{3,}$/;
    if (value.match(userFNameRegex) || value == '') {
      setUserFullName(value), setErrorMsg4('');
    } else {
      setErrorMsg4('Name is invalid');
    }
  };

  const validateNext = (props) => {
    if (
      getUserName == '' ||
      getUserPassword == '' ||
      getUserEmail == '' ||
      getUserFullName == ''
    ) {
      setErrorMsg4('Fill the information first!');
    } else if (getErrorMsg1 == '' && getErrorMsg2 == '' && getErrorMsg3 == '') {
      newUser.user_name = getUserName;
      newUser.email = getUserEmail;
      newUser.password = getUserPassword;
      newUser.name = getUserFullName;
      setErrorMsg4('');
      props.navigation.navigate('Registration2_Screen', newUser);
    } else {
      setErrorMsg4('Fill the correct information first!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text2}>User Name</Text>
      <TextInput
        style={styles.input}
        placeholder={'*must contain number(s)'}
        maxLength={8}
        textAlign={'center'}
        onChangeText={(val) => validateUserName(val)}
      />
      <Text style={{ color: 'red' }}>{getErrorMsg1}</Text>
      <Text style={styles.text2}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder={'Enter your email'}
        maxLength={20}
        textAlign={'center'}
        onChangeText={(val) => validateEmail(val)}
      />
      <Text style={{ color: 'red' }}>{getErrorMsg2}</Text>
      <Text style={styles.text2}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder={'*must contain special-character(s) & number(s)'}
        minLength={5}
        maxLength={8}
        textAlign={'center'}
        onChangeText={(val) => validatePassword(val)}
      />
      <Text style={{ color: 'red' }}>{getErrorMsg3}</Text>
      <Text style={styles.text2}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder={'Enter Your Full Name'}
        maxLength={20}
        textAlign={'center'}
        onChangeText={(val) => validateUserFullName(val)}
      />
      <Text style={{ color: 'red' }}>{getErrorMsg4}</Text>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          validateNext(props);
        }}>
        <Text style={styles.textStyle}>Next</Text>
      </TouchableOpacity>
      <Text>You will be a Hero for our cummunity! </Text>
    </View>
  );
};
const Registration_2Screen = (props) => {
  const [users, setUsers] = useState();

  useEffect(() => {
    async function getUsers() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/users')
        .catch((err) => console.log('' + err));
      setUsers(response.data);
    }
    getUsers();
  }, []);

  const updateUsers = async (newUser) => {
    const response = await axios
      .post('/users', newUser)
      .catch((err) => console.log('' + err));
    if (response) {
      console.log('New User added to db.');
    }
  };

  const [mapUse, setMapUse] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [date, setDate] = useState(new Date(639278003000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [getErrorMsg1, setErrorMsg1] = useState('');
  const [getErrorMsg2, setErrorMsg2] = useState('');

  const [getUserGender, setUserGender] = useState('Male');
  const [getUserDOB, setUserDOB] = useState(
    date.toString().split(' ').slice(0, 4).join(' ')
  );

  useEffect(() => {
    setUserDOB(date.toString().split(' ').slice(0, 4).join(' '));
  }, [date]);

  useEffect(() => {
    setTimeout(() => {
      setUserAddress(props.route.params.address)
    }, 10000);
    }, [mapUse]);

  const [getUserAddress, setUserAddress] = useState('');
  const [getUserContact, setUserContact] = useState('+44 ');
  const [getUserWeight, setUserWeight] = useState('below 45 kg');
  const [getUserBloodGroup, setUserBloodGroup] = useState('A+');

  const validateUserContact = (value) => {
    console.log(getUserContact);
    var userContactRegex = /[0-9]{10}$/;
    if (value.match(userContactRegex) || value == '') {
      setUserContact(getUserContact + '' + value);
      setErrorMsg1('');
    } else {
      setErrorMsg1('Contact is invalid');
    }
  };

  const validateSignUp = (props) => {
    if (getUserAddress == '' || getUserContact.length < 14) {
      console.log(getUserContact);
      setErrorMsg2('Fill the valid information first!');
    } else if (getErrorMsg1 == '' && isEnabled == true) {
      props.route.params.gender = getUserGender;
      props.route.params.blood_group = getUserBloodGroup;
      props.route.params.dob = getUserDOB;
      props.route.params.mobile_phone_no = getUserContact;
      props.route.params.address = getUserAddress;
      props.route.params.weight = getUserWeight;
      updateUsers(props.route.params);
      //users = [...users, props.route.params];
      console.log(users);
      setErrorMsg2('');
      setTimeout(() => {
        props.navigation.navigate('MyBottomTabs', props.route.params);
      }, 3000);
    } else {
      setErrorMsg2('Accept terms and policy!');
    }
  };

  if (!users)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF2156" />
        <Image
          style={{ width: 170, height: 70 , marginTop: -55}}
          source={require('./images/BloodDrop.png')}
          resizeMode="contain"
        />
      </View>
    );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ecf0f1',
            width: '100%',
          }}>
          <Text style={styles.text3}>Gender</Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 7,
              width: '40%',
              alignItems: 'center',
            }}>
            <Picker
              style={{ width: '100%' }}
              selectedValue={getUserGender}
              onValueChange={(itemValue, itemIndex) =>
                setUserGender(itemValue)
              }>
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
          <Text style={{ ...styles.text3, marginTop: 7 }}>Blood Group</Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 7,
              width: '40%',
              alignItems: 'center',
            }}>
            <Picker
              style={{ width: '100%' }}
              selectedValue={getUserBloodGroup}
              onValueChange={(itemValue, itemIndex) =>
                setUserBloodGroup(itemValue)
              }>
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
          </View>
        </View>
        <View style={{ ...styles.container2, marginTop: 7 }}>
          <Text style={styles.text3}>Date of birth</Text>

          <TouchableOpacity style={styles.input1} onPress={showDatepicker}>
            <Text style={{ color: 'black' }}>{getUserDOB}</Text>
          </TouchableOpacity>

          {show ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 , width:'80%', }}>
        <Text style={{width:'70%'}}>Address</Text>

        { mapUse == true ?
        <TouchableOpacity style= {styles.input1} onPress={() => {
          setMapUse(false);
          }}><Text>Input</Text>
        </TouchableOpacity> : null}

        { mapUse == false ?
        <TouchableOpacity style= {styles.input1} onPress={() => {
          props.navigation.navigate('Maps_Screen', props.route.params);
          setMapUse(true);
          }}> 
        <Image
              style={{ width: 50, height: 20 }}
              source={require('./images/mapicon.png')}
              resizeMode="contain"
            />
        </TouchableOpacity>
        : null}
        </View> 
        { mapUse == false ?

          <TextInput
          style={styles.input}
          placeholder={'Enter Your Address'}
          maxLength={45}
          textAlign={'center'}
          onChangeText={(val) => setUserAddress(val)}
        /> : (((getUserAddress == '' || getUserAddress != props.route.params.address) && mapUse == true ) ? 
        ( <ActivityIndicator size="large" color="#FF2156" />) :
        
        <Text
        style={styles.input}
        textAlign={'center'}
      > {getUserAddress} </Text>  )}

        <Text style={styles.text2}>Contact Details</Text>
        <View style={{ flexDirection: 'row', width: '90%' }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 13,
              width: '35%',
              alignItems: 'center',
            }}>
            <Picker
              style={{ width: '100%' }}
              getContact={getUserContact}
              onValueChange={(itemValue, itemIndex) =>
                setUserContact(itemValue)
              }>
              <Picker.Item label="+44" value="+44" />
            </Picker>
          </View>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 13,
              width: '65%',
            }}
            keyboardType={'number-pad'}
            placeholder={'XXXXXXXXXX'}
            maxLength={10}
            textAlign={'center'}
            onChangeText={(val) => validateUserContact(val)}
          />
        </View>
        <Text style={{ color: 'red' }}>{getErrorMsg1}</Text>

        <View
          style={{ flexDirection: 'row', marginTop: 7, alignItems: 'center' }}>
          <View style={{ marginRight: 7 }}>
            <Text style={styles.text4}>Weight</Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 13,
              width: '50%',
              alignItems: 'center',
            }}>
            <Picker
              style={{ width: '100%' }}
              selectedValue={getUserWeight}
              onValueChange={(itemValue, itemIndex) =>
                setUserWeight(itemValue)
              }>
              <Picker.Item label="below 45 kg" value="below 45 kg" />
              <Picker.Item label="45 - 50 kg" value="45 - 50 kg" />
              <Picker.Item label="50 - 55 kg" value="50 - 55 kg" />
              <Picker.Item label="55 - 60 kg" value="55 - 60 kg" />
              <Picker.Item label="60 - 65 kg" value="60 - 65 kg" />
              <Picker.Item label="65 - 70 kg" value="65 - 70 kg" />
              <Picker.Item label="70 - 75 kg" value="70 - 75 kg" />
              <Picker.Item label="75 - 80 kg" value="75 - 80 kg" />
              <Picker.Item label="80 - 85 kg" value="80 - 85 kg" />
              <Picker.Item label="85 - 90 kg" value="85 - 90 kg" />
              <Picker.Item label="90 - 100 kg" value="90 - 100 kg" />
              <Picker.Item label="above 100 kg" value="above 100 kg" />
            </Picker>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ width: '80%' , padding: 10 }}>
              <View style={styles.modalText1}>
                <Text style={{ fontWeight: 'bold' }}>Terms and Conditions</Text>
                <Text>
                  {'\n'}'By accepting these terms, you also understand and
                  consent to Donate???s Privacy Statement, which is incorporated
                  into, and part of, this agreement. Our Privacy Statement
                  describes how we collect, use and share information.'{'\n\n'}-
                  Availability of products and services.{'\n\n'}- Obey the rules
                  of the road.{'\n\n'}- You are responsible for your devices and
                  accounts.
                </Text>
              </View>
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>OK</Text>
              </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.container2}>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text
            style={{ color: 'red', marginTop: 10 }}
            onPress={() => setModalVisible(true)}>
            I accept terms and conditions!{' '}
          </Text>
        </View>
        <Text style={{ color: 'red' }}>{getErrorMsg2}</Text>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            validateSignUp(props);
          }}>
          <Text style={styles.textStyle}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const Homepage_Screen = (props) => {
  const [users, setUsers] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [carouselItems, setcarouselItems] = useState([
    {
      img: (
        <Image
          style={{ height: 200, width: 373 }}
          source={require('./images/homePic1.png')}
        />
      ),
    },
    {
      img: (
        <Image
          style={{ height: 200, width: 373 }}
          source={require('./images/homePic2.jpg')}
        />
      ),
    },
    {
      img: (
        <Image
          style={{ height: 200, width: 373 }}
          source={require('./images/homePic3.jpg')}
        />
      ),
    },
    {
      img: (
        <Image
          style={{ height: 200, width: 373 }}
          source={require('./images/start1.png')}
        />
      ),
    },
  ]);
  const [activeIndex, setactiveIndex] = useState(0);

  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: 'floralwhite',
          height: 200,
        }}>
        <Text style={{ height: 300, width: 373 }}>{item.img}</Text>
      </View>
    );
  };

  const validateNavigation = (props, screen) => {
    var i;
    for (i = 0; i < users.length; i++) {
      if (users[i].user_name == props.route.params.user_name) {
        props.navigation.navigate(screen, props.route.params);
        return;
      }
    }
    alert(`Sign UP First!`);
  };

  useEffect(() => {
    async function getUsers() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/users')
        .catch((err) => console.log('' + err));
      setUsers(response.data);
    }
    getUsers();
  }, []);

  if (!users)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF2156" />
        <Image
          style={{ width: 170, height: 70 , marginTop: -55}}
          source={require('./images/BloodDrop.png')}
          resizeMode="contain"
        />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"default"}
                  ref={ref => ref}
                  data={carouselItems}
                  sliderWidth={373}
                  itemWidth={373}
                  renderItem={_renderItem}
                  onSnapToItem = { index => setactiveIndex(index) }
                  autoplay = {true} 
                  loop = {true}/>
            </View>
      <View style={styles.keys}></View>
      <View style={styles.keys}>
        <TouchableOpacity
          color={'#dc143c'}
          activeOpacity={0.5}
          onPress={() => validateNavigation(props, 'Requests')}>
          <Image
            style={{ width: 111, height: 111 }}
            source={require('./images/homeBtn1.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate(
              'Post_Request_Screen',
              props.route.params
            );
          }}>
          <Image
            style={{ width: 111, height: 111 }}
            source={require('./images/homeBtn2.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <Image
            style={{ width: 111, height: 111 }}
            source={require('./images/homeBtn3.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.keys}>
        <TouchableOpacity
          onPress={() => validateNavigation(props, 'Profile')}>
          <Image
            style={{ width: 111, height: 111 }}
            source={require('./images/homeBtn4.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Responses', props.route.params);
          }}>
          <Image
            style={{ width: 111, height: 111 }}
            source={require('./images/homeBtn5.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => validateNavigation(props, 'Points_Screen')}>
          <Image
            style={{ width: 111, height: 111 }}
            source={require('./images/homeBtn6.png')}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
          
      <ScrollView>
          <View style={styles.modalView}>
            <View style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>BloodBank</Text>
              <Text> - </Text>
              <Text style={{ fontWeight: 'bold' }}>Location</Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {props.navigation.navigate('BankMaps_Screen', 'London West End Blood Donor Centre, 26 Margaret St, Marylebone, London W1W 8NB, United Kingdom'),setModalVisible(!modalVisible)}}>
                  <Text> London West End Blood Donor Centre, 26 Margaret St, Marylebone, London W1W 8NB, United Kingdom </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {props.navigation.navigate('BankMaps_Screen','National Blood, Norfolk House, 7 Norfolk St, Manchester M2 1DW, United Kingdom'),setModalVisible(!modalVisible)}}>
                  <Text> National Blood, Norfolk House, 7 Norfolk St, Manchester M2 1DW, United Kingdom </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {props.navigation.navigate('BankMaps_Screen','Manchester Blood Donor Centre, Plymouth Grove, Manchester M13 9LL, United Kingdom'),setModalVisible(!modalVisible)}}>
                  <Text> Manchester Blood Donor Centre, Plymouth Grove, Manchester M13 9LL, United Kingdom </Text>
                </TouchableOpacity>
                <Text>{'\n'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>X</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};
const Profile_Screen = (props) => {
  const [isEnabled, setIsEnabled] = useState(props.route.params.available);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);

    props.route.params.available == false
      ? (props.route.params.available = true)
      : (props.route.params.available = false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingLeft: 20, paddingTop: 15 }}>
        <Text style={styles.text1}>Profile</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
        }}>
        <View style={{ paddingLeft: 30, paddingTop: 15 , width:'50%'}}>
          <Text style={styles.text6}>{props.route.params.name}</Text>
          <Text style={styles.text1}>{props.route.params.address}</Text>
        </View>
        <TouchableOpacity
          style={styles.touchable}
          >
          <View>
            <Text style={styles.text6}>{props.route.params.blood_group}</Text>
            <Text style={styles.text4}>Blood Type</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: 30,
          paddingTop: 10,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={styles.touchable3}
          onPress={() =>
            props.navigation.navigate('Responses', props.route.params)
          }>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Image
              style={{ width: 25, height: 20 }}
              source={require('./images/ProfileBtn1.png')}
              resizeMode="contain"
            />
            <Text style={styles.text2}>Responses</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable4}
          onPress={() =>
            props.navigation.navigate('Donations_Screen', props.route.params)
          }>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Image
              style={{ width: 25, height: 20 }}
              source={require('./images/profileBtn2.png')}
              resizeMode="contain"
            />
            <Text style={styles.text2}>Donations</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ paddingLeft: 30, paddingTop: 10 }}>
        <Text style={styles.text1}>History</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
        }}>
        <TouchableOpacity
          style={styles.touchable5}
          >
          <View>
            <Text style={styles.text6}>
              {props.route.params.donationsCount}
            </Text>
            <Text style={styles.text4}>Donated</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable5}
          >
          <View>
            <Text style={styles.text6}>{props.route.params.requestsCount}</Text>
            <Text style={styles.text4}>Requests</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.touchable6} onPress={() => {}}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={styles.text1}>Available for donate</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable6}
          >
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={styles.text1}>Get help</Text>
            <Image
              style={{ width: 30, height: 25 }}
              source={require('./images/ProfileHelp.png')}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable6}
          onPress={async () => {
            await AsyncStorage.clear();
            props.navigation.navigate('StartScreen', {});
          }}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={styles.text1}>Sign out</Text>
            <Image
              style={{ width: 30, height: 25 }}
              source={require('./images/ProfileSignOut.png')}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Requests_Screen = (props) => {
  const [requests, setRequests] = useState();

  useEffect(() => {
    async function getRequests() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/requests')
        .catch((err) => console.log('' + err)); 
      setRequests(response.data);
    }
    getRequests();
  }, []);

  if (!requests)
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color="#FF2156" />
        <Image
          style={{ width: 170, height: 70 , marginTop: -55}}
          source={require('./images/BloodDrop.png')}
          resizeMode="contain"
        />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingLeft: 20, paddingTop: 15 }}>
        <Text style={styles.text1}>Requests</Text>
      </View>

      <ScrollView>
        {requests.map((item, key) => (
          <View>
            {console.log(item)}
            <View style={styles.keys}>
              <View style={{ paddingLeft: 30, paddingTop: 15, width: '50%'}}>
                <Text style={styles.text1}>{item.name}</Text>
                <Text style={styles.text4}>{item.location || item.address}</Text>
              </View>
              <TouchableOpacity
                style={styles.touchable}
                >
                <View>
                  <Text style={styles.text6}>{item.blood_group}</Text>
                  <Text style={styles.text4}>Blood Needed</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.keys}>
              <View style={{ paddingLeft: 30 }}>
                <Text style={styles.text5}>Level</Text>
              </View>
              <TouchableOpacity
                style={styles.touchable1}
                >
                <Text style={styles.text6}>{item.level}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keys}>
              <View style={{ paddingLeft: 30 }}>
                <Text style={styles.text5}>Needed Within</Text>
              </View>

              <TouchableOpacity
                style={styles.touchable1}
                >
                <Text style={styles.text6}>{item.needed_within}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.touchable2}
                onPress={() => {
                  props.navigation.navigate('Active_Request_Screen', {
                    requester: item,
                    donor: props.route.params,
                  });
                }}>
                <View>
                  <Image
                    style={{ width: 100, height: 35 }}
                    source={require('./images/RequestBtn1.png')}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{ width: '80%', height: 35 }}
                source={require('./images/RequestPic1.png')}
                resizeMode="contain"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const Responses_Screen = (props) => {
  const [users, setUsers] = useState();

  const [requests, setRequests] = useState();

  //  const [getResponses, setResponses] = useState(requests);
  //   useEffect(() => {
  //     setResponses(requests);
  //   }, [requests]);

  useEffect(() => {
    async function getUsers() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/users')
        .catch((err) => console.log('' + err));
      setUsers(response.data);
    }
    async function getRequests() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/requests')
        .catch((err) => console.log('' + err));
      setRequests(response.data);
    }
    getUsers();
    getRequests();
  }, []);

  if (!requests || !users)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF2156" />
        <Image
          style={{ width: 170, height: 70 , marginTop: -55}}
          source={require('./images/BloodDrop.png')}
          resizeMode="contain"
        />
      </View>
    );

  const moveRequest = async (req_id) => {
    const response = await axios
      .delete(`/requests/${req_id}`)
      .catch((err) => console.log('' + err));
    if (response) {
      console.log('Request moved from db.');
    }
  };

  const moveToAccepted = async (req) => {
    const response = await axios
      .post('/acceptedRequests', req)
      .catch((err) => console.log('' + err));
    if (response) {
      console.log('Request moved from db.');
    }
  };

  const updateDonations = async (user, req_id) => {
    const response = await axios
      .put(`/users/${user.id}`, {
        ...user,
        donations: [...user.donations, req_id],
        donationsCount: user.donationsCount + 1,
      })
      .catch((err) => console.log('' + err));
    if (response) {
      console.log('Donations added to db.');
    }
  };

  const validateAccept = (props, request) => {
    for (var i = 0; i < requests.length; i++) {
      if (requests[i] === request) {
        moveRequest(request.id);
        // requests.splice(i, 1);
      }
    }
    moveToAccepted(request);
    // acceptedRequests = [...acceptedRequests, request];
    updateDonations(props.route.params, request.req_id);
    // props.route.params.donations = [
    //    ...props.route.params.donations,
    //    request.req_id,
    //  ];
    // props.route.params.donationsCount++;
    console.log(props.route.params);
    props.navigation.navigate('Homepage_Screen', props.route.params);
    alert(`Donor's response accepted successfully!`);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingLeft: 20, paddingTop: 15 }}>
        <Text style={styles.text1}>Responses</Text>
      </View>
      <ScrollView>
        {requests.map((request) =>
          request.name == props.route.params.user_name
            ? request.responses.map((donor) =>
                users.map((user) =>
                  user.user_name == donor ? (
                    <View>
                      <View style={styles.keys}>
                        <View style={{ paddingLeft: 30, paddingTop: 15 ,width: '50%'}}>
                          <Text style={styles.text1} key={user}>
                            {user.name}
                          </Text>
                          <Text style={styles.text4} key={user}>
                            {user.address}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.touchable}
                          >
                          <View>
                            <Text style={styles.text6} key={user}>
                              {user.blood_group}
                            </Text>
                            <Text style={styles.text4}>Blood Group</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.keys}>
                        <View style={{ paddingLeft: 30 }}>
                          <Text style={styles.text5}>Weight</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.touchable1}
                          >
                          <Text style={styles.text6} key={user}>
                            {user.weight}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.keys}>
                        <View style={{ paddingLeft: 30 }}>
                          <Text style={styles.text5}>Date of birth</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.touchable1}
                          >
                          <Text style={styles.text6} key={user}>
                            {user.dob}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ paddingLeft: 30 }}>
                        <Text style={styles.text5}>Contact details</Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                          style={styles.touchable6}
                          >
                          <View
                            style={{
                              paddingLeft: 30,
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Text style={styles.text1} key={user}>
                              +44 {user.mobile_phone_no}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                          style={styles.openButton}
                          onPress={() => {
                            validateAccept(props, request);
                          }}>
                          <Text style={styles.textStyle}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Image
                          style={{ width: '80%', height: 35 }}
                          source={require('./images/RequestPic1.png')}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  ) : null
                )
              )
            : null
        )}
      </ScrollView>
    </View>
  );
};
const Donations_Screen = (props) => {
  const [acceptedRequests, setacceptedRequests] = useState();

  useEffect(() => {
    async function getacceptedRequests() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/acceptedRequests')
        .catch((err) => console.log('' + err));
      setacceptedRequests(response.data);
    }
    getacceptedRequests();
  }, []);

  if (!acceptedRequests)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF2156" />
        <Image
          style={{ width: 170, height: 70 , marginTop: -55}}
          source={require('./images/BloodDrop.png')}
          resizeMode="contain"
        />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingLeft: 20, paddingTop: 15 }}>
        <Text style={styles.text1}>Donations</Text>
      </View>
      <ScrollView>
        {props.route.params.donations.map((id) =>
          acceptedRequests.map((request) =>
            request.req_id == id ? (
              <View>
                <View style={styles.keys}>
                  <View style={{ paddingLeft: 30, paddingTop: 15 }}>
                    <Text style={styles.text1}>{request.name}</Text>
                    <Text style={styles.text4}>{request.location}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.touchable}
                    >
                    <View>
                      <Text style={styles.text6}>{request.blood_group}</Text>
                      <Text style={styles.text4}>Blood Needed</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.keys}>
                  <View style={{ paddingLeft: 30 }}>
                    <Text style={styles.text5}>Level</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.touchable1}
                    >
                    <Text style={styles.text6}>{request.level}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.keys}>
                  <View style={{ paddingLeft: 30 }}>
                    <Text style={styles.text5}>Needed Within</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.touchable1}
                    >
                    <Text style={styles.text6}>{request.needed_within}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    style={{ width: '80%', height: 35 }}
                    source={require('./images/RequestPic1.png')}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ) : null
          )
        )}
      </ScrollView>
    </View>
  );
};
const Points_Screen = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 30 }}>
        <Text style={styles.text1}>Points</Text>
      </View>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          backgroundColor: '#FFffff',
          borderRadius: 10,
          borderWidth: 1,
          padding: 30,
          height: 150,
          margin: 5,
          width: '80%',
        }}
        >
        <View>
          <Text style={styles.text6}>
            {props.route.params.donationsCount * 10} Points
          </Text>
          <Text style={styles.text4}>
            For {props.route.params.donationsCount} Donation(s)
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const Active_Request_Screen = (props) => {
  const updateResponses = async (request, donor) => {
    const response = await axios
      .put(`/requests/${request.id}`, {
        ...request,
        responses: [...request.responses, donor.user_name],
      })
      .catch((err) => console.log('' + err));
    if (response) {
      console.log('Response added to db.');
    }
  };

  const validateResponse = (props) => {
    if (props.route.params.donor.available == false) {
      alert('Your are currently unavailable for donation!');
    } else {
      updateResponses(props.route.params.requester, props.route.params.donor);

      //  props.route.params.requester.responses = [
      //    ...props.route.params.requester.responses,
      //    props.route.params.donor.user_name,
      //  ];
      alert('Your response has been sent for donation!');
      props.navigation.navigate('Homepage_Screen', {responses : props.route.params.requester.responses});
    }
  };

  return (
    <View>
      <View style={{ paddingLeft: 20, paddingTop: 15 }}>
        <Text style={styles.text1}>Active Request</Text>
      </View>
      <View style={styles.keys}>
        <View style={{ paddingLeft: 30, paddingTop: 30 }}>
          <Text style={styles.text6}>{props.route.params.requester.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.touchable}
          >
          <View>
            <Text style={styles.text6}>
              {props.route.params.requester.blood_group}
            </Text>
            <Text style={styles.text4}>Blood Needed</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ paddingLeft: 30 }}>
        <Text style={styles.text5}>
          {props.route.params.requester.location}
        </Text>
      </View>
      <View style={styles.keys}>
        <View style={{ paddingLeft: 30 }}>
          <Text style={styles.text5}>Level</Text>
        </View>
        <TouchableOpacity
          style={styles.touchable1}
          >
          <Text style={styles.text6}>{props.route.params.requester.level}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.keys}>
        <View style={{ paddingLeft: 30 }}>
          <Text style={styles.text5}>Needed Within</Text>
        </View>

        <TouchableOpacity
          style={styles.touchable1}
          >
          <Text style={styles.text6}>
            {props.route.params.requester.needed_within}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingLeft: 30 }}>
        <Text style={styles.text5}>Contact details</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.touchable6}
          >
          <View
            style={{
              paddingLeft: 30,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={styles.text1}>
              +44 {props.route.params.requester.contact}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.touchable2}
          onPress={() => {
            validateResponse(props);
          }}>
          <View>
            <Image
              style={{ width: 100, height: 35 }}
              source={require('./images/RequestBtn1.png')}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{ width: '80%', height: 35 }}
          source={require('./images/RequestPic1.png')}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
const Post_Request_Screen = (props) => {
  
  
  const userRequest = {
    req_id: '',
    name: '',
    blood_group: '',
    amount_required: '',
    needed_within: '',
    level: '',
    address: '',
    contact: '',
    responses: [],
  };

  const [requests, setRequests] = useState();

  const [mapUse, setMapUse] = useState(false);
  const [getErrorMsg1, setErrorMsg1] = useState('');

  const [getName, setName] = useState('');
  const [getLocation, setLocation] = useState(userRequest.address);
  const [getAmountRequired, setAmountRequired] = useState('');
  const [getContact, setContact] = useState('');
  const [getNeededWithin, setNeededWithin] = useState('30 minutes');
  const [getUserBloodGroup, setUserBloodGroup] = useState('A+');
  const [getLevel, setLevel] = useState('Critical');
  useEffect(() => {
    async function getRequests() {
      console.log('Fecting Data...');

      const response = await axios
        .get('/requests')
        .catch((err) => console.log('' + err));
      setRequests(response.data);
    }
    getRequests();
  }, []);

  const updateRequests = async (newRequest) => {
    const response = await axios
      .post('/requests', newRequest)
      .catch((err) => console.log('' + err));
    if (response) {
      console.log('New Request added to db.');
    }
  };

  const validatePostRequest = (props) => {
    if (props.route.params.user_name == '') {
      if (
        getLocation == '' ||
        getLocation.length < 5 ||
        getName.length < 3 ||
        getAmountRequired == '' ||
        getName == '' ||
        getContact.length < 10
      ) {
        setErrorMsg1('Fill the valid information first!');
      } else {
        userRequest.req_id = Object.keys(requests).length + 1;
        userRequest.name = getName;
        userRequest.blood_group = getUserBloodGroup;
        userRequest.amount_required = getAmountRequired;
        userRequest.needed_within = getNeededWithin;
        userRequest.level = getLevel;
        userRequest.address = getLocation;
        userRequest.contact = getContact;
        updateRequests(userRequest);
        //requests = [...requests, userRequest];
        setErrorMsg1('');
        console.log(requests);
        props.navigation.navigate('MyBottomTabs', { user_name: getName });
        alert(
          'The request has been posted on the system, kindly check for responses regularly!'
        );
      }
    } else if (props.route.params.user_name != '') {
      if (
        getLocation == '' ||
        getLocation.length < 5 ||
        getAmountRequired == '' ||
        getContact.length < 10
      ) {
        setErrorMsg1('Fill the valid information first!');
      } else {
        props.route.params.requestsCount++;
        userRequest.req_id = Object.keys(requests).length + 1;
        userRequest.name = props.route.params.user_name;
        userRequest.blood_group = getUserBloodGroup;
        userRequest.amount_required = getAmountRequired;
        userRequest.needed_within = getNeededWithin;
        userRequest.level = getLevel;
        userRequest.address = getLocation;
        userRequest.contact = getContact;
        updateRequests(userRequest);
        //requests = [...requests, userRequest];
        setErrorMsg1('');
        props.navigation.navigate('MyBottomTabs', props.route.params);
        alert(
          'The request has been posted on the system, kindly check for responses regularly!'
        );
      }
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLocation(props.route.params.address)
    }, 10000);
    }, [mapUse]);
  

  if (!requests)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF2156" />
        <Image
          style={{ width: 170, height: 70 , marginTop: -55}}
          source={require('./images/BloodDrop.png')}
          resizeMode="contain"
        />
      </View>
    );

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ paddingLeft: 20, paddingTop: 15 }}>
        <Text style={styles.text1}>Post Request</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        {props.route.params.user_name == '' ? (
          <View>
            <Text style={styles.text4}>Enter Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder={'Enter Your Name Here!'}
              maxLength={15}
              textAlign={'center'}
              onChangeText={(val) => setName(val)}
            />
          </View>
        ) : null}
        <Text style={styles.text4}>Select Blood Group</Text>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 15,
            borderColor: '#777',
            padding: 5,
            marginTop: 7,
            width: '60%',
            alignItems: 'center',
          }}>
          <Picker
            style={{ width: '90%' }}
            selectedValue={getUserBloodGroup}
            onValueChange={(itemValue, itemIndex) =>
              setUserBloodGroup(itemValue)
            }>
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="O-" value="O-" />
          </Picker>
        </View>
        <Text style={styles.text4}>Amount Required</Text>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 15,
            borderColor: '#777',
            padding: 5,
            marginTop: 7,
            width: '60%',
            alignItems: 'center',
          }}>
          <Picker
            style={{ width: '90%' }}
            selectedValue={getAmountRequired}
            onValueChange={(itemValue, itemIndex) =>
              setAmountRequired(itemValue)
            }>
            <Picker.Item label="0.5 liter" value="0.5 liter" />
            <Picker.Item label="1 liter" value="1 liter" />
            <Picker.Item label="1.5 liter" value="1.5 liter" />
            <Picker.Item label="2 liter" value="2 liter" />
            <Picker.Item label="2.5 liter" value="2.5 liter" />
            <Picker.Item label="3 liter" value="3 liter" />
            <Picker.Item label="3.5 liter" value="3.5 liter" />
            <Picker.Item label="4 liter" value="4 liter" />
          </Picker>
        </View>

        <View
          style={{ flexDirection: 'row', marginTop: 7, alignItems: 'center' }}>
          <View style={{ marginRight: 7 }}>
            <Text style={styles.text4}>Needed Within</Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 13,
              width: '50%',
              alignItems: 'center',
            }}>
            <Picker
              style={{ width: '100%' }}
              selectedValue={getNeededWithin}
              onValueChange={(itemValue, itemIndex) =>
                setNeededWithin(itemValue)
              }>
              <Picker.Item label="30 minutes" value="30 minutes" />
              <Picker.Item label="45 minutes" value="45 minutes" />
              <Picker.Item label="1 hour" value="1 hour" />
              <Picker.Item label="1.5 hours" value="1.5 hours" />
              <Picker.Item label="2 hours" value="2 hours" />
              <Picker.Item label="2.5 hours" value="2.5 hours" />
              <Picker.Item label="3 hours" value="3 hours" />
              <Picker.Item label="4 hours" value="4 hours" />
              <Picker.Item label="6 hours" value="6 hours" />
              <Picker.Item label="8 hours" value="8 hours" />
              <Picker.Item label="12 hours" value="12 hours" />
              <Picker.Item label="15 hours" value="15 hours" />
              <Picker.Item label="24 hours" value="24 hours" />
            </Picker>
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', marginTop: 7, alignItems: 'center' }}>
          <View style={{ marginRight: 7 }}>
            <Text style={styles.text4}>Level</Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 13,
              width: '50%',
              alignItems: 'center',
            }}>
            <Picker
              style={{ width: '100%' }}
              selectedValue={getLevel}
              onValueChange={(itemValue, itemIndex) => setLevel(itemValue)}>
              <Picker.Item label="Critical" value="Critical" />
              <Picker.Item label="Normal" value="Normal" />
            </Picker>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 , width:'80%', }}>
        <Text style={{width:'70%'}}>Address</Text>
        { mapUse == true ?
        <TouchableOpacity style= {styles.input1} onPress={() => {
          setMapUse(false);
          }}><Text>Input</Text>
        </TouchableOpacity> : null}

        { mapUse == false ?
        <TouchableOpacity style= {styles.input1} onPress={() => {
          props.navigation.navigate('Maps_Screen', props.route.params);
          setMapUse(true);
          }}> 
        <Image
              style={{ width: 50, height: 20 }}
              source={require('./images/mapicon.png')}
              resizeMode="contain"
            />
        </TouchableOpacity>
        : null}
        </View> 
        { mapUse == false ?

          <TextInput
          style={styles.input}
          placeholder={'Enter Your Address'}
          maxLength={45}
          textAlign={'center'}
          onChangeText={(val) => setLocation(val)}
        /> : (((getLocation == '' || getLocation != props.route.params.address) && mapUse == true ) ? 
        ( <ActivityIndicator size="large" color="#FF2156" />) :
        
        <Text
        style={styles.input}
        textAlign={'center'}
      > {getLocation} </Text>  )}
      

        <Text style={styles.text4}>Contact details</Text>
        <View style={{ flexDirection: 'row', width: '90%' }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 13,
              width: '35%',
              alignItems: 'center',
            }}>
            <Picker
              style={{ width: '100%' }}
              selectedValue={getContact}
              onValueChange={(itemValue, itemIndex) => setContact(itemValue)}>
              <Picker.Item label="+44" value="+44" />
            </Picker>
          </View>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: '#777',
              padding: 5,
              marginTop: 13,
              width: '65%',
            }}
            keyboardType={'number-pad'}
            placeholder={'XXXXXXXXXX'}
            maxLength={10}
            textAlign={'center'}
            onChangeText={(val) => setContact(val)}
          />
        </View>
        <Text style={{ color: 'red' }}>{getErrorMsg1}</Text>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => validatePostRequest(props)}>
          <Text style={styles.textStyle}>Post Request</Text>
        </TouchableOpacity>
        <View>
          <Image
            style={{ width: 230, height: 50 }}
            source={require('./images/RequestPic1.png')}
            resizeMode="contain"
          />
        </View>
      </View>
    </ScrollView>
  );
};
const Maps_Screen = (props) => {

  const [locationResult, setlocationResult] = useState(null);
  const [location, setlocation] = useState({coords: { latitude: 53.463884, longitude: -2.224808 , 
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,}});


const _setLocation = (latitude,longitude) => setlocation({coords: { latitude: latitude, longitude: longitude,}});

const _getLocationAsync = async () => {
  
  console.log("Before "+location)
  console.log("Before " +locationResult)
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
       setlocationResult('Permission to access location was denied')
       setlocation(location)
   }
   let location = await Location.getCurrentPositionAsync({});
   let response = await Location.reverseGeocodeAsync(location.coords)
   let response1 = await Location.geocodeAsync("Baker Street London")
   setlocationResult(JSON.stringify(location));
  setlocation(location)
  console.log("After " + location)
  console.log("After "+ locationResult)
  console.log("After "+ JSON.stringify(response1))

  for (let item of response) {
    let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
    console.log(address);
  }
}
const _setLocationAsync = async () => {
  
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
       setlocationResult('Permission to access location was denied')
       setlocation(location)
   }
  let response = await Location.reverseGeocodeAsync(location.coords)
  for (let item of response) {
    var address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
    console.log(address);
  }
  props.route.params.address = address;
  props.navigation.goBack();
}

 if (!location)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF2156" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height:'80%', flex:2}}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={(r)=>_setLocation(r.latitude,r.longitude)}
      >
      <MapView.Marker
      coordinate={location.coords}
      title={"marker.title"}
    />
      </MapView>
      </View>
      <View  style={{flexDirection :"row", maginBottom: "3%"}}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          _getLocationAsync();
        }}>
        <Text style={styles.textStyle}>My Location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => _setLocationAsync()}>
        <Text style={styles.textStyle}>Set Location</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const BankMaps_Screen = (props) => {

  const [locationResult, setlocationResult] = useState(null);
  const [location, setlocation] = useState(null);

const _getLocationAsync = async () => {
  
  console.log("Before " +locationResult)
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
       setlocationResult('Permission to access location was denied')
   }
   let response = await Location.geocodeAsync(props.route.params)
   setlocationResult(JSON.stringify(location));
   for (let item of response) {
    var latitude = item.latitude;
    var longitude = item.longitude;
  }
  setlocation({coords: { latitude: latitude, longitude: longitude}})
  console.log("After "+ JSON.stringify(response))
  
}

useEffect(() => {
  _getLocationAsync();
  }, []);


 if (!location)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF2156" />
        <Image
          style={{ width: 170, height: 70 , marginTop: -55}}
          source={require('./images/BloodDrop.png')}
          resizeMode="contain"
        />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height:'80%', flex:2}}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
      <MapView.Marker
      coordinate={location.coords}
      title={"marker.title"}
    />
      </MapView>
      </View>
      <View  style={{flexDirection :"row", maginBottom: "3%"}}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          props.navigation.goBack();
        }}>
        <Text style={styles.textStyle}>Back</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const AppStack = createStackNavigator();
const AppStackNavigator1 = (props) => {

  return (
    <AppStack.Navigator initialRouteName={'Splash_Screen'}>
      <AppStack.Screen name="Splash_Screen" options={{ headerShown: false }}>
        {(props) => <Splash_Screen {...props} />}
      </AppStack.Screen>

      <AppStack.Screen
        name="StartScreen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerLeft: null,
        }}>
        {(props) => <Start_Screen {...props} />}
      </AppStack.Screen>

      <AppStack.Screen
        name="Registration1_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
        }}>
        {(props) => <Registration_1Screen {...props} />}
      </AppStack.Screen>

      <AppStack.Screen
        name="Registration2_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
        }}>
        {(props) => <Registration_2Screen {...props} />}
      </AppStack.Screen>

     
      <AppStack.Screen
        name="Donations_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerRight: null
        }}>
        {(props) => <Donations_Screen {...props} />}
      </AppStack.Screen>
      <AppStack.Screen
        name="Points_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerRight: null
        }}>
        {(props) => <Points_Screen {...props} />}
      </AppStack.Screen>

      <AppStack.Screen
        name="Active_Request_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerRight: null
        }}>
        {(props) => <Active_Request_Screen {...props} />}
      </AppStack.Screen>

      <AppStack.Screen
        name="Post_Request_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerRight: null,
        }}>
        {(props) => <Post_Request_Screen {...props} />}
      </AppStack.Screen>

      <AppStack.Screen
        name="Maps_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerRight: null,
        }}>
        {(props) => <Maps_Screen{...props} />}
      </AppStack.Screen>


      <AppStack.Screen
        name="BankMaps_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerRight: null,
        }}>
        {(props) => <BankMaps_Screen{...props} />}
      </AppStack.Screen>

      <AppStack.Screen
        name="MyBottomTabs"
        options={{ headerShown: false
        }}>
        {(props) => <MyBottomTabs {...props} />}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
};
const AppStackNavigatorHome = (getprops) => {

  const [modalVisible, setModalVisible] = useState(false);
if(modalVisible != false)  {
return(
  <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    Alert.alert('Modal has been closed.');
  }}>
    
<ScrollView>
    <View style={styles.modalView}>
      
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            
          }}>
          <TouchableOpacity style={{marginTop: 10 , alignItems: 'center', width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Requests', ''),setModalVisible(!modalVisible)}}>
            <Text> Requests </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%', borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Responses',''),setModalVisible(!modalVisible)}}>
            <Text> Responses </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Profile',''),setModalVisible(!modalVisible)}}>
            <Text> Profile </Text>
          </TouchableOpacity>
          
          <Text>{'\n'}</Text>
        </View>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <Text style={styles.textStyle}>X</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
</Modal>
)
}
  return (
    <AppStack.Navigator initialRouteName={'Homepage_Screen'}>

      <AppStack.Screen
        name="Homepage_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <TouchableOpacity>
              <Image
                style={{ width: 200, height: 50 }}
                source={require('./images/logo.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerLeft: (
            props // App Logo
          ) => (
            <TouchableOpacity
              onPress={() => { setModalVisible(true);
              }}>
              <Image
                style={{ width: 30, height: 30, marginLeft: 10 }}
                source={require('./images/tabicon.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerRight: (
            props // App Logo
          ) => (
            <TouchableOpacity
            onPress={() => { getprops.navigation.navigate('Responses', '');
            }}>
              <Image
                style={{ width: 30, height: 30, marginRight: 10 }}
                source={require('./images/notify.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}>
        {(props) => <Homepage_Screen {...getprops} />}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
};
const AppStackNavigatorRequests = (getprops) => {
  
  const [modalVisible, setModalVisible] = useState(false);
  if(modalVisible != false)  {
  return(
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
    }}>
      
  <ScrollView>
      <View style={styles.modalView}>
        
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '80%',
              
            }}>
            <TouchableOpacity style={{marginTop: 10 , alignItems: 'center', width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Home', ''),setModalVisible(!modalVisible)}}>
              <Text> Home </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%', borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Responses',''),setModalVisible(!modalVisible)}}>
              <Text> Responses </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Profile',''),setModalVisible(!modalVisible)}}>
              <Text> Profile </Text>
            </TouchableOpacity>
            
            <Text>{'\n'}</Text>
          </View>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Text style={styles.textStyle}>X</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
  </Modal>
  )
}
  
  return (
    <AppStack.Navigator >

<AppStack.Screen
        name="Requests_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerLeft: null,
          headerRight: (
            props
          ) => (
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Image
                style={{ width: 30, height: 30, marginRight: 10 }}
                source={require('./images/tabicon.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}>
        {(props) => <Requests_Screen {...getprops} />}
      </AppStack.Screen>
      
    </AppStack.Navigator>
  );
};
const AppStackNavigatorResponses = (getprops) => {

  const [modalVisible, setModalVisible] = useState(false);
  if(modalVisible != false)  {
  return(
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
    }}>
      
  <ScrollView>
      <View style={styles.modalView}>
        
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '80%',
              
            }}>
            <TouchableOpacity style={{marginTop: 10 , alignItems: 'center', width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Requests', ''),setModalVisible(!modalVisible)}}>
              <Text> Requests </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%', borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Home',''),setModalVisible(!modalVisible)}}>
              <Text> Home </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Profile',''),setModalVisible(!modalVisible)}}>
              <Text> Profile </Text>
            </TouchableOpacity>
            
            <Text>{'\n'}</Text>
          </View>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Text style={styles.textStyle}>X</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
  </Modal>
  )
  }

  return (
    <AppStack.Navigator >

<AppStack.Screen
        name="Responses_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerLeft: null,
          headerRight: (
            props // App Logo
          ) => (
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Image
                style={{ width: 30, height: 30, marginRight: 10 }}
                source={require('./images/tabicon.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}>
        {(props) => <Responses_Screen {...getprops} />}
      </AppStack.Screen>
      
    </AppStack.Navigator>
  );
};
const AppStackNavigatorProfile= (getprops) => {
  
  const [modalVisible, setModalVisible] = useState(false);
  if(modalVisible != false)  {
  return(
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
    }}>
      
  <ScrollView>
      <View style={styles.modalView}>
        
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '80%',
              
            }}>
            <TouchableOpacity style={{marginTop: 10 , alignItems: 'center', width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Requests', ''),setModalVisible(!modalVisible)}}>
              <Text> Requests </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%', borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Responses',''),setModalVisible(!modalVisible)}}>
              <Text> Responses </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 10 ,alignItems: 'center',width: '80%',borderWidth: 1, borderRadius: 10, padding: 10}} onPress={() => {getprops.navigation.navigate('Home',''),setModalVisible(!modalVisible)}}>
              <Text> Home </Text>
            </TouchableOpacity>
            
            <Text>{'\n'}</Text>
          </View>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Text style={styles.textStyle}>X</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
  </Modal>
  )
  }
  
  
  return (
    <AppStack.Navigator >

<AppStack.Screen
        name="Profile_Screen"
        options={{
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require('./images/logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: { flex: 1, textAlign: 'center' },
          headerStyle: { backgroundColor: 'lightgrey' },
          headerTitleAlign: 'center',
          headerLeft: (
            props // App Logo
          ) => (
            <TouchableOpacity
              onPress={() => { setModalVisible(true);
              }}>
              <Image
                style={{ width: 30, height: 30, marginLeft: 10 }}
                source={require('./images/tabicon.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          
          headerRight: (
            props // App Logo
          ) => (
            <TouchableOpacity
            onPress={() => { getprops.navigation.navigate('Registration1_Screen', {});
            }}>
              <Image
                style={{ width: 30, height: 30, marginRight: 10 }}
                source={require('./images/editBtn.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}>
        {(props) => <Profile_Screen {...getprops} />}
      </AppStack.Screen>
      
    </AppStack.Navigator>
  );
};
const Tab = createBottomTabNavigator();
const MyBottomTabs = (getprops) => {


  return (
    <Tab.Navigator
    initialRouteName = "Home"
    tabBarOptions={{
      activeTintColor: '#e91e63',
      inactiveBackgroundColor : "#FAF9F6",
      tabStyle : ({
        paddingBottom:5,
        paddingTop:5
        })
    }}
    shifting ={true}
    >
      <Tab.Screen name="Home" 
      options ={{
        tabBarColor:"FF2156", 
        tabBarIcon: (props
          ) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require('./images/bottomicon1.png')}
              resizeMode="contain"
            />
          )
          }}>
          {(props) => <AppStackNavigatorHome {...getprops} />}
          </Tab.Screen>

          <Tab.Screen name="Requests" 
      options ={{
        tabBarColor:"FF2156", 
        tabBarIcon: (props
          ) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require('./images/bottomicon2.png')}
              resizeMode="contain"
            />
          )
          }}>
          {(props) => <AppStackNavigatorRequests {...getprops} />}
          </Tab.Screen>


          <Tab.Screen name="i" component={Start_Screen} options ={{
            tabBarLabel: '',
        tabBarIcon: (props
          ) => (
            <Image
              style={{ width: 90, height: 90 , marginTop : -25}}
              source={require('./images/BloodDrop.png')}
              resizeMode="contain"
            />
          ),
          }}/>

<Tab.Screen name="Responses" 
      options ={{
        tabBarColor:"FF2156", 
        tabBarIcon: (props
          ) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require('./images/bottomicon3.png')}
              resizeMode="contain"
            />
          )
          }}>
          {(props) => <AppStackNavigatorResponses {...getprops} />}
          </Tab.Screen>

          <Tab.Screen name="Profile" 
      options ={{
        tabBarColor:"FF2156", 
        tabBarIcon: (props
          ) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require('./images/bottomicon4.png')}
              resizeMode="contain"
            />
          )
          }}>
          {(props) => <AppStackNavigatorProfile {...getprops} />}
          </Tab.Screen>

    </Tab.Navigator>
  );
        }
export default function App() {
  return (
    <NavigationContainer>
      <AppStackNavigator1 />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecf0f1',
    width: '80%',
  },
  text1: {
    width: '90%',
    fontSize: 18,
  },
  text2: {
    width: '90%',
    fontSize: 15,
  },
  text3: {
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: '90%',
  },
  input1: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#777',
    padding: 8,
    width: '28%',
  },
  openButton: {
    backgroundColor: '#FF2156',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 60,
    elevation: 2,
    margin: 5,
  },
  text4: {
    fontSize: 14,
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
  text6: {
    fontSize: 20,
    textAlign: 'center',
  },
  text5: {
    width: '100%',
    fontSize: 15,
    marginTop: 20,
  },
  touchable: {
    backgroundColor: '#FFffff',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    height: 90,
    margin: 5,
    width: '45%',
  },
  touchable1: {
    backgroundColor: '#FFffff',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    height: 50,
    margin: 5,
    marginTop: 12,
    width: '42%',
  },
  touchable2: {
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    padding: 8,
    height: 50,
    width: '50%',
  },
  touchable3: {
    backgroundColor: '#689593',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    height: 40,
    margin: 5,
    marginTop: 12,
    width: '40%',
  },
  touchable4: {
    backgroundColor: '#FF2156',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    height: 40,
    margin: 5,
    marginTop: 12,
    width: '40%',
  },
  touchable5: {
    backgroundColor: '#FFffff',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    height: 90,
    margin: 5,
    width: '30%',
  },
  touchable6: {
    backgroundColor: '#FFffff',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    height: 50,
    margin: 5,
    marginTop: 12,
    width: '80%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  keys: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalView: {
    textAlign: 'center',
    margin: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalText1: {
    marginBottom: 15,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});