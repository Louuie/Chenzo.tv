import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../auth/firebase';
import admin from '../auth/firebaseSDK';


interface Auth {
    access_token: string
}


export const fetchAccessToken = async (uid : string) => {
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


// CREATES FIREBASE USER SO THAT WAY WE CAN AUTH THE USER WITH FIREBASE
export const createFirebaseUser = async (displayName: string, id: string) => {
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
export const getFirebaseToken = async (id: string) => {
    const customToken = await admin.auth().createCustomToken(id);
    return customToken;
}

// STORE THE USERS INFORMATION IN A DATABASE
export const storeUserInformation = async (id: string, display_name: any, auth: Auth) => {
    setDoc(doc(db, "users", id), {
        displayName: display_name.slice(7),
        accessToken: auth.access_token
    }).then((res) => console.log(`Successfully Created ${res}`)).catch((e) => {
        console.log(e)
    });
};