import React, { ChangeEvent, useState } from "react";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firestore";
import { Link, NavLink } from "react-router-dom";
import Poll from "./Poll";
import Button from "../ui/Button";


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
            <div className="flex justify-center py-[5rem]">
                <form onSubmit={onPollCreation}>
                    <div className="bg-gray-800 text-gray-100 px-8 py-6">
                        <input type="text" placeholder="Title" className="text-gray-800 mb-4"></input><br></br>
                        <input type="text" placeholder="Option1" className="text-gray-800 mb-4"></input><br></br>
                        <input type="text" placeholder="Option2" className="text-gray-800 mb-4"></input><br></br>
                        <input type="text" placeholder="Option3" className="text-gray-800 mb-4"></input><br></br>
                        <input type="text" placeholder="Option4" className="text-gray-800 mb-4"></input><br></br>
                        <div className="py-2 px-16">
                            <Button label="Submit" />
                        </div>
                    </div>
                </form>
            </div>
            )}
        </div>
    )
}