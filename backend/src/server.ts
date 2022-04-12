import express, { Express, Request, Response} from 'express';
import cors from 'cors';
import { twitchAuth, validateTwitchAuth } from './middleware/auth/twitchauth';
import session from 'express-session';
import passport from 'passport';

const allowedOrigins = ['http://localhost:3000'];

const app = express();
const options: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(options));
// Allows us to use sessions    
app.use(session({
    secret: "SESSION_SECRET", 
    resave: false, 
    saveUninitialized: false,
    cookie: {maxAge: 3600000}
}));


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req : Request, res : Response) => res.json({message: 'Hello '}))

app.get('/twitch/auth', (req: Request, res: Response) => {
    res.json({test: "test"});
})
app.post('/twitch/auth', twitchAuth);

app.get('/twitch/auth/validate', validateTwitchAuth);

app.listen(4000);