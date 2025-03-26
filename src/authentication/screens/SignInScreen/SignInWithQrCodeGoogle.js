import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	SafeAreaView,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import axios from 'axios';
// import QRCode from 'react-native-qrcode-svg';
import { normalize } from '../../../helper/FontSize';
import { black, blue} from '../../../helper/Color';
import CountdownTimer from './countDown';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../../api/config';

const SignInQrScreen = () => {
	const [googleInfo, setGoogleInfo] = useState(undefined);
	const [loading, setLoading] = useState(false);
	const [accessTokenInterval, setAccessTokenInterval] = useState(null); // Store the interval ID
	const navigation = useNavigation();
	useEffect(() => {
		fetchData(); // Add any initial setup logic here if needed
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const url = 'https://oauth2.googleapis.com/device/code'; // Replace with your desired URL
			const data = {
				// client_id: GOOGLE_CLIENT_ID,
				scope: 'email profile',
				// Add any other data you want to send in the request body here
			};

			const response = await axios.post(url, data);
			console.log('Response Data:', response.data);

			setGoogleInfo(response.data);
			setLoading(false);
			// Clear the previous interval (if any)
			if (accessTokenInterval) {
				clearInterval(accessTokenInterval);
			}

			// Start a new interval
			const intervalId = setInterval(() => {
				console.log('---')
				fetchAccessToken(response.data);
			}, 5000);
			setAccessTokenInterval(intervalId);


			// Handle the response data as needed
		} catch (error) {
			console.error('Error:', error);
			// Handle errors here
		}
	};

	const fetchAccessToken = async (info) => {
		// console.log('fecth token api called', info)
		if (!info || !info?.device_code) {
			return;
		}

		// console.log(info.device_code);
		const postData = {
			client_id:GOOGLE_CLIENT_ID, 
			// client_secret:GOOGLE_CLIENT_SECRET,
			device_code: info.device_code,
			grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
		};

		try {
			const response = await axios.post('https://oauth2.googleapis.com/token', postData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200) {
				// Access token and other data are available in response.data
				console.log('Access Token:', response.data);
				console.log('Token Type:', response.data.token_type);
				console.log('Expires In:', response.data.expires_in);
				// Add further processing as needed
				clearInterval(accessTokenInterval); // Clear the interval after successful API call
				console.warn('Success! Device connected');
			} else if (response.status === 428) {
				console.warn('Error:', response.status, response.statusText);
			}
		} catch (error) {
			// console.log('An error occurred:', error.code);
		}
	};


	const renderIsSignedIn = () => {
		console.log('jsonString--',googleInfo?.verification_url)
		return (
			<View style={{ paddingBottom: 20, height: 280 }}>
				{googleInfo ? (
					<View>
						{/* <QRCode value={googleInfo?.verification_url} size={260} /> */}
						<View style={{ paddingTop: 5, alignItems: 'center',}}>
							<CountdownTimer initialTime={googleInfo.expires_in} />
						</View>

					</View>
				) : loading ? (
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator size="large" />
					</View>
				) : null}
			</View>
		);
	};


const onSignInRemote=()=>{
	clearInterval(accessTokenInterval);
	navigation.goBack();
}
	

	// const jsonString = JSON.stringify(googleInfo);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.contentContainer}>
					<View style={styles.stepsContainer}>
						<Text style={styles.headerTitle}>Follow these steps on your computer or mobile device</Text>
						<View style={styles.stepContainer}>
							<Text style={styles.stepTitle}> STEP 1</Text>
							<View style={{ width: '80%' }}>
								<Text style={styles.stepTxt}>Scan the symbol with your phone's camera or go to:</Text>
								<Text style={styles.stepTxtImp}>{googleInfo ? googleInfo.verification_url : null}</Text>
							</View>

						</View>
						<View style={styles.stepContainer}>
							<Text style={styles.stepTitle}>STEP 2</Text>
							<View style={{ width: '80%' }}>
								<Text style={styles.stepTxt}>Enter sign-in code:</Text>
								<Text style={styles.stepTxtImp}>{googleInfo ? googleInfo.user_code : null}</Text>
							</View>


						</View>
						<View style={styles.stepContainer}>
							<Text style={styles.stepTitle}>STEP 3</Text>
							<Text style={styles.stepTxt}>Sign in to Google. Your TV will be ready to watch!</Text>
						</View>
					</View>
					<View style={styles.qrCodeContainer}>
						{renderIsSignedIn()}
					</View>
				</View>
				{/* need to put in last of the screen */}
				<View style={styles.footerContainer}>
					<View style={styles.separator} />
					<Text style={styles.footerText}>
						Or enter your email and password with your remote.
					</Text>
					<View style={{width:280}}>
					<CustomButton
						text="Sign In with Remote"
						onPress={onSignInRemote}
						bgColor="#e3e3e3"
						fgColor="#363636"
					/>
					</View>
					
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	contentContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: normalize(2),
	},
	stepsContainer: {
		width: Dimensions.get('window').width > 600 ? '60%' : '100%',
		padding: normalize(4),
	},
	qrCodeContainer: {
		width: Dimensions.get('window').width > 600 ? '40%' : '100%',
		alignItems: 'center',
		justifyContent: 'center',
		padding: normalize(4),
	},
	footerContainer: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: normalize(2),
		// marginTop: normalize(),
	},
	separator: {
		borderBottomColor: blue,
		borderBottomWidth: 2,
		marginBottom: normalize(1),
		width: Dimensions.get('window').width-100 ,
	},
	headerTitle: {
		fontSize: normalize(2),
		color: black,
		fontFamily: 'Montserrat-Bold',
		alignItems: 'center',
		justifyContent: 'center',
	},
	stepContainer: {
		flexDirection: 'row',
		paddingTop: normalize(2),
	},
	stepTitle: {
		width: '15%',
		fontSize: normalize(1.3),
		color: black,
		fontFamily: 'Montserrat-Bold',
		alignItems: 'center',
		justifyContent: 'center',
		
	},
	stepTxt: {
		fontSize: normalize(1.3),
		color: black,
		fontFamily: 'Montserrat-Medium',
		alignItems: 'center',
		justifyContent: 'center',
	},
	stepTxtImp: {
		fontSize: normalize(2),
		color: black,
		fontFamily: 'Montserrat-Bold',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: normalize(1.6),
		fontWeight: 'bold',
	},
	icon: {
		marginRight: normalize(1),
	},
	footerText: {
		fontSize: normalize(1.2),
		color: black,
		paddingBottom:10
	},
});


export default SignInQrScreen;
