import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response, Router } from 'express';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection } from 'firebase/firestore';
import admin from './firebase';

dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });
let userInformation = {  };

interface Auth {
    access_token: string
}

const firebaseConfig = {
    apiKey: "AIzaSyCkiL_ZyjBEiY6NfD7ihk20nBP-PePkjXU",
    authDomain: "chenzotv-e811a.firebaseapp.com",
    projectId: "chenzotv-e811a",
    storageBucket: "chenzotv-e811a.appspot.com",
    messagingSenderId: "939651085415",
    appId: "1:939651085415:web:9df1f9afeb0e68213490c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



// VALIDATE USER TOKEN
const validateToken = async (token: string) => {
    return new Promise((resolve, reject) => {
        axios.get('https://id.twitch.tv/oauth2/validate', {
            headers: {
                Authorization: `OAuth ${token}`
            }
        }).then((res) => {
            let num: number = res.status;
            resolve(num);
            // resolve 401 if the access token is invalid
        }).catch((e) => resolve(401));
    });
};


const fetchAccessToken = async (uid : string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return new Promise((resolve, reject) => {
        // QUERY THROUGH THE DATABASE AND GRAB WHERE THE DOCUMENT ID EQUALS THE USER ID SO WE CAN GRAB THEIR ACCESS TOKEN
        if(!userSnap.exists()) reject(401);
        onSnapshot(collection(db, 'users'), (snapshot) => {
            snapshot.docs.map(doc => {
                if(doc.id !== uid) reject(401);
                const data = doc.data();
                resolve(data.accessToken);
            })
        });
    })
};






export const twitchAuth = async (req: Request, res: Response) => {

    // GETS THE USERS TWITCH INFORMATION AND RETURNS THE USER OBJECT
    const getUserInfo = async (auth : Auth) => {
        try {
            const { data } = await axios.get('https://api.twitch.tv/helix/users', {
                headers: {
                    Authorization: `Bearer ${auth.access_token}`,
                    "Client-Id": 'w6if41rebjkg7yl6ko24mfvgdn22d8'
                }
            });
            return data;
        } catch (err) { throw err; }
      };

      // CREATES FIREBASE USER SO THAT WAY WE CAN AUTH THE USER WITH FIREBASE
      const createFirebaseUser = async (displayName : string, id : string) => {
          admin.auth().updateUser(id, {
              displayName: displayName
          }).catch((e) => {
              // new user
              admin.auth().createUser({
                  uid: id,
                  displayName: displayName
              }).catch((e) => console.log(e));
          });
      };

      // CREATES FIREBASE TOKEN WITH USER ID AND RETURNS IT
      const getFirebaseToken = async (id: string) => {
        const customToken = await admin.auth().createCustomToken(id);
        return customToken;
    }

    // STORE THE USERS INFORMATION IN A DATABASE
    const storeUserInformation = async (id : string, display_name : any, auth: Auth) => {
        setDoc(doc(db, "users", id), {
            displayName: display_name.slice(7), 
            accessToken: auth.access_token
        }).then((res) => console.log(`Successfully Created ${res}`)).catch((e) => {console.log(e)});
    };

    const code = req.query.code;
    if(!code) res.status(400).json({Error: "Missing required code query parameter"});
    try {
        const { data } = await axios.post(
        `https://api.twitch.tv/kraken/oauth2/token?` +
        `client_id=w6if41rebjkg7yl6ko24mfvgdn22d8&` +
        `client_secret=mfv186nqhc7ho398ddrcbt7wmb4dih&` +
        `code=${code}&` +
        `grant_type=authorization_code&` +
        `redirect_uri=http://localhost:3000/admin/login/callback`
        );
        const userInfo = await getUserInfo(data);
        const id = `twitch:${userInfo.data[0].id}`;
        const display_name = `twitch:${userInfo.data[0].display_name}`;
        await storeUserInformation(id, display_name, data);
        await createFirebaseUser(display_name, id);
        const token = await getFirebaseToken(id);
        res.status(200).json({
            Firebase_Authentication: {
                Authenticated: true,
                token: token
            }
        });
        console.log(id);
    } catch (e) { throw e; }

}


export const validateTwitchAuth = async (req: Request, res: Response) => {
    let accessToken : string = await fetchAccessToken(req.header('uuid')) as string;
    let validateAccessToken : number = await validateToken(accessToken) as number;
    if(validateAccessToken != 200) {
        res.status(401).json({
            TwitchAuthentication: {
                auth: false,
                reason: "access_token is invalid"
            }
        });
    }
    res.status(200).json({
        TwitchAuthentication: {
            auth: true,
            reason: "access_token is valid!"
        }
    });
};
