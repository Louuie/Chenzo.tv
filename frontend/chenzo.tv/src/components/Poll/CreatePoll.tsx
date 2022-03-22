import React, { ChangeEvent, useState } from "react";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import db from "../../firebase/firestore";
import { Link, NavLink } from "react-router-dom";
import Poll from "./Poll";


export default function CreatePoll() {

    let [pollCreated, isPollCreated] = useState(false);
    let [pollID, setPollID] = useState('');

    const onPollCreation = async (e : any) => {
        e.preventDefault();
        try {
            let options = [
                e.target[1].value,
                e.target[2].value,
                e.target[3].value,
                e.target[4].value,
            ]

            const pollRef = await addDoc(collection(db, 'polls'), {
                title: e.target[0].value,
                options: options,
                optionACount: 0,
                optionBCount: 0,
                optionCCount: 0,
                optionDCount: 0,
                IPAddresses: ''
            });
            isPollCreated(true);
            setPollID(pollRef.id);
            console.log(`Poll ID: ${pollRef.id} has been created!`)
        } catch (e) { console.log("Error adding document: ", e) }
    };


    return (
        <div>
            {pollCreated ? (
                <NavLink to={`/poll/${pollID}`} children={<Poll/>}/>
            ) : (
            <div>
                <form onSubmit={onPollCreation}>
                    <label id={"title"}>Title</label><br></br>
                    <input type="text" name="title"></input><br></br>
                    <label id={"option1"}>Option 1</label><br></br>
                    <input type="text" name="option1"></input><br></br>
                    <label id={"option2"}>Option 2</label><br></br>
                    <input type="text" name="option2"></input><br></br>
                    <label id={"option3"}>Option 3</label><br></br>
                    <input type="text" name="option3"></input><br></br>
                    <label id={"option4"}>Option 4</label><br></br>
                    <input type="text" name="option4"></input><br></br>
                    <input type="submit" value="Submit"></input><br></br>
                </form>
            </div>
            )}
        </div>
    )
}