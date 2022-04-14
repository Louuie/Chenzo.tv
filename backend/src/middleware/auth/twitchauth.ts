import axios from 'axios';
import { Request, Response } from 'express';
import { clientID, clientSecret } from '../../env';
import { storeUserInformation, createFirebaseUser, getFirebaseToken, fetchAccessToken } from '../db/firestore';

interface Auth {
    access_token: string
}

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


    const code = req.query.code;
    if(!code) res.status(400).json({Error: "Missing required code query parameter"});
    try {
        const { data } = await axios.post(
        `https://api.twitch.tv/kraken/oauth2/token?` +
        `client_id=${clientID}&` +
        `client_secret=${clientSecret}&` +
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
