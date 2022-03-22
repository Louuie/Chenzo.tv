import react, { Suspense, useEffect, useState, } from "react";
import axios from 'axios';
import { NavLink, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, arrayUnion, updateDoc } from "firebase/firestore";
import db from "../../firebase/firestore";
import PollResults from "./PollResults";

export default function Poll() {
    let params = useParams();
    let [ipAddress, setIPAddress] = useState('');
    let [entryIPAddresses, setEntryIPAddresses] = useState(['']);
    let [docStatus, setDocStatus] = useState(true);
    let [title, setTitle] = useState('');
    let [votingStatus, setVotingStatus] = useState(false);
    let [pollingID, setPollingID] = useState('');
    let [options, setOptions] = useState([]);
    let [optionOneCount, setOptionOneCount] = useState(0);
    let [optionTwoCount, setOptionTwoCount] = useState(0);
    let [optionThreeCount, setOptionThreeCount] = useState(0);
    let [optionFourCount, setOptionFourCount] = useState(0);

    const onOption1 = async () => {
        try {
            let pollRef = doc(db, 'polls', pollingID);
            await updateDoc(pollRef, {
                optionACount: optionOneCount + 1,
                IPAddresses: arrayUnion(ipAddress)
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    
    const onOption2 = async () => {
        try {
            let pollRef = doc(db, 'polls', pollingID);
            await updateDoc(pollRef, {
                optionBCount: optionTwoCount + 1,
                IPAddresses: arrayUnion(ipAddress)
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    
    const onOption3 = async () => {
        try {
            let pollRef = doc(db, 'polls', pollingID);
            await updateDoc(pollRef, {
                optionCCount: optionThreeCount + 1,
                IPAddresses: arrayUnion(ipAddress)
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    
    const onOption4 = async () => {
        try {
            let pollRef = doc(db, 'polls', pollingID);
            await updateDoc(pollRef, {
                optionDCount: optionFourCount + 1,
                IPAddresses: arrayUnion(ipAddress)
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    // get user IP Address useEffect Hook
    useEffect(() => {
        axios.get('http://ip-api.com/json/?fields=61439').then((res) => setIPAddress(res.data.query)).catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const firestoreInsert = async () => {
            const checkRef = doc(db, 'polls', `${params.id}`)
            const checkSnap = await getDoc(checkRef);
            if(checkSnap.exists()) {
                onSnapshot(collection(db, "polls"), (snapshot) => {
                    snapshot.docs.map(doc => {
                        if(doc.id === params.id) {
                            const data = doc.data();
                            setEntryIPAddresses([data.IPAddresses]);
                            axios.get('http://ip-api.com/json/?fields=61439').then((res) => checkDuplicateEntries(data.IPAddresses, res.data.query)).catch((err) => console.log(err));
                            setTitle(data.title);
                            setOptions(data.options);
                            setPollingID(doc.id);
                            setOptionOneCount(data.optionACount);
                            setOptionTwoCount(data.optionBCount);
                            setOptionThreeCount(data.optionCCount);
                            setOptionFourCount(data.optionDCount);
                        }
                    });
                });
            } else setDocStatus(false);
        };
        firestoreInsert();
    }, []);

    const checkDuplicateEntries = (entryIPAddresses : string[], clientIPAddress : string) => {
        entryIPAddresses.forEach(ip => {
            if(ip === clientIPAddress) setVotingStatus(true);
        });
    }

    return (
        <Suspense fallback={<div></div>}>
            <div>
                {docStatus ? (
                                <div>
                                    {!votingStatus ? (
                                    <div>
                                        <h1>{title}</h1>
                                        <button onClick={onOption1}>{options[0]}</button><br></br>
                                        <button onClick={onOption2}>{options[1]}</button><br></br>
                                        <button onClick={onOption3}>{options[2]}</button><br></br>
                                        <button onClick={onOption4}>{options[3]}</button><br></br>
                                    </div>
                                    ) : (
                                        <NavLink to={`/poll/results/${pollingID}`} children={<PollResults />}/>
                                    )}
                                </div>
                          ) : (       
                        <div>
                            <h1>This document does not exist!</h1>
                        </div>
                    )}
                </div>
        </Suspense>
    )
}