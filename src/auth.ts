import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

let provider: any = new GoogleAuthProvider();
let auth: any = null;
let app: any = null;
const loginProviders = ['google.com', 'microsoft.com', 'password', 'email-link']

export function initilizeFirebase(configOptions: any) {
    const options = {
        projectId: configOptions.projectId,
        authDomain: configOptions.authDomain,
        apiKey: configOptions.apiKey,
        appId: configOptions.appId,
        measurementId: configOptions.measurementId
    }
    app = firebase.initializeApp(options)
    app.auth().tenantId = configOptions.tenantId
    auth = getAuth()
}

export function authenticate(providerId: string = 'google.com') {
    if (providerId === 'google.com') {
        provider = new GoogleAuthProvider();
    } else {
        provider = new OAuthProvider(providerId)
    }
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential !== null) {
            const token = credential.accessToken
        }
        // The signed-in user info.
        const user = result.user;
        user.getIdToken().then((token: any) => {
            window.sessionStorage.removeItem('loginFailed')
            window.sessionStorage.setItem('accessToken', token)
            window.location.reload()
        });
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.log('Errors: ' + errorCode, errorMessage)
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used
        const credential = GoogleAuthProvider.credentialFromError(error)
        window.sessionStorage.setItem('loginFailed', errorMessage)
        window.location.reload()
        // ...
    });
}

export function signOut() {
    const auth = getAuth()
    auth.signOut().then(() => {
        window.sessionStorage.removeItem('accessToken')
        window.location.reload()
    }).catch((error) => {
        console.log(error)
    });
}

export function getAccessToken() {
    const token: string|null = window.sessionStorage.getItem('accessToken')
    if (!token) {
        console.error('Not authenticated');
    } else if (isTokenExpired(token)) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user.getIdToken().then((token: any) => {
                    window.sessionStorage.setItem('accessToken', token)
                })
            } else {
              console.error('Not authenticated');
              window.sessionStorage.removeItem('accessToken')
            }
        }); 
    }

    return window.sessionStorage.getItem('accessToken')
}

function isTokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    const expired = (Math.floor((new Date()).getTime() / 1000)) >= expiry;
    return expired
}