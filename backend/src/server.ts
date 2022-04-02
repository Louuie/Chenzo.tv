import express, { Express, Request, Response} from 'express';
import session from 'express-session';
import passport from 'passport';

const app : Express = express();
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

app.listen(8080);