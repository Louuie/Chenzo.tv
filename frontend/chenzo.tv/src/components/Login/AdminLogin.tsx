import Button from '../ui/Button';
import axios from 'axios';
import { SignIn, SignOut } from 'phosphor-react';
import { firebaseApp } from '../../firebase/firestore';
import { signInWithCustomToken, getAuth, onAuthStateChanged, signOut} from 'firebase/auth'
import { useEffect, useState } from 'react';
export default function AdminLogin() {
    const auth = getAuth(firebaseApp);
    let [firebaseAuth, setFirebaseAuth] = useState(false); 
    const onLogin = async () => {
        const uri = 
        `https://id.twitch.tv/oauth2/authorize?` +
        `client_id=w6if41rebjkg7yl6ko24mfvgdn22d8&` +
        `redirect_uri=http://localhost:3000/admin/login/callback&` +
        `response_type=code&` +
        `scope=openid user_read&`;
        const code = await getCode(uri);
        sendCode(code);
        console.log('code:', code);
    }

    const getCode = (uri : string) => {
        return new Promise((resolve, reject) => {
            const authWindow = window.open(
                uri,
                "_blank_",
                "toolbar=yes,scrollbar=yes,resizable=yes,width=800,height=700"
            );

            let url : string | null;
            setInterval(async () => {
                try {
                  url = authWindow && authWindow.location && authWindow.location.search;
                } catch (e) {}  
                if (url) {
                  const url = authWindow?.location.search.substring(6);
                  const formattedCode = url?.slice(0, 30);
                  authWindow!.close();
                  resolve(formattedCode);
                }
              }, 500);
        })
    };

    const sendCode = (code : unknown) => {
        axios.post(`http://localhost:4000/twitch/auth?code=${code}`).then((res) => {         
                        signInWithCustomToken(auth, res.data.Firebase_Authentication.token).then((user) => {
                            console.log(user);
                            setFirebaseAuth(true);
                        }).catch((e) => console.log(e));
            console.log('Firebase Token:', res.data.Firebase_Authentication);
        }).catch((e) => {
            if(!e.response) return;
            if(e.response.status == 401) console.log('Bad Access Token!');
        });
    };

    const onLogout = async () => {
        signOut(auth).then(() => {setFirebaseAuth(false); console.log('Successfully signed out!');}).catch((e) => console.log(e));
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            // User is NOT Signed In
            if(!user) setFirebaseAuth(false);
            // MAKE A CALL TO OUR BACKEND API TO VALIDATE THE USERS ACCESS TOKEN
            const uid : string = user?.uid as string;
            axios.get('http://localhost:4000/twitch/auth/validate', {
                headers: {
                    uuid: uid
                }
            }).then((response) => {  if(response.status == 200) setFirebaseAuth(true); console.log('Access token is valid!')}).catch((e) => {
                if(!e.response) return;
                if(e.response.status == 401) setFirebaseAuth(false); console.log('Access Token is invalid!')
            })
        });
    }, [firebaseAuth])


    return (
        <div className="flex items-center justify-center py-[5rem] bg-gray-900">
            <div className='flex-col text-center bg-gray-800 h-auto w-auto md:h-[20rem] md:w-[30rem]'>
                <div className='flex items-center align-middle justify-center py-[8rem]'>
                    {firebaseAuth ? (
                        <Button label='Sign out' icon={SignOut} onButtonClick={onLogout} />
                    ) : (
                        <Button label='Login' icon={SignIn} onButtonClick={onLogin} />
                    )}
                </div>
            </div>
        </div>
    )
}