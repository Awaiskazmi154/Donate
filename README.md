# Donate
Donate is a mobile application used for the donation of blood between donors and requester. It has very friendly and easy to use interface to enhance interactivity between users. It has very fast mechanism to request the blood need and get immediate responses from the donors. The system integrates the use of maps and vital information regarding blood requirements for better performance and usability. Moreover, for better understanding the system usability quick navigation options are available within the system. 

*******************************************************************************************************************
Important Instructions:
*******************************************************************************************************************
-This react native app is developed as a expo project, so there are dependencies needed to be installed first

Requirements
------------------
- Node.js LTS release or greater
- Git
- Watchman for macOS users

create a expo project using the running the commands on a cmd (run as administrator):

- npm install --global expo-cli
- set-ExecutionPolicy RemoteSigned
- expo init donate

select "blank" template
- cd donate

once expo project has been created, move the "images" folder , and replace the required "app.js" file in the project directory.
if want to use the REST functions also move the required "axios.js" and "db.json" files to the project directory too.


Dependencies:
--------------------------
{
  "dependencies": {
    "react-native-paper": "3.6.0",
    "expo-constants": "~9.3.3",
    "@react-native-async-storage/async-storage": "*",
    "@react-navigation/native": "*",
    "@react-navigation/stack": "*",
    "@react-navigation/drawer": "*",
    "@react-native-community/masked-view": "0.1.10",
    "react-native-gesture-handler": "~1.8.0",
    "react-native-safe-area-context": "3.1.9",
    "react-native-screens": "~2.15.2",
    "react-native-reanimated": "~1.13.0",
    "@react-native-community/datetimepicker": "3.0.4",
    "@react-navigation/bottom-tabs": "*",
    "expo-permissions": "~10.0.0",
    "expo-location": "~10.0.0",
    "react-native-maps": "0.27.1",
    "prop-types": "16.0.0",
    "react-native-snap-carousel": "*",
    "axios": "*"
  }
}

Install the required dependencies running the following commands on a cmd (run as administrator), 
try to use the vscode terminal

- expo install @react-native-async-storage/async-storage
- npm install @react-navigation/native
- expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
- npm install @react-navigation/stack
- npm install @react-navigation/bottom-tabs
- npm install --save react-native-snap-carousel 
- expo install @react-native-community/datetimepicker
- npm install axios --save
- expo install react-native-maps
- expo install expo-permissions
- expo install expo-location



Run the expo project using the following command:
- expo start

REST API may not work for the local server using the expo project on local machine. 
Therefore to use the REST functionality use the expo snack (online tool) and create a expo snack 
and use the uncommented REST app.js code there.
Crousel may not work, so remove it from the code.
Some other functionality may not work on expo snack environment.

EXPO SNACK LINK
- https://snack.expo.io/@awaiskazmi/donate


For the REST api functionality:-
move the "db.json" file and "axios.js" to some approprite directory
Use the following commands to get a running local json server on your machine

- npm install -g json-server
- json-server --watch db.json --port 3000 
