import react, { Suspense, useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import db from "../../firebase/firestore";
import PollResults from "./PollResults";

export default function Poll() {
    
    let params = useParams();
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
                optionACount: optionOneCount + 1
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    
    const onOption2 = async () => {
        try {
            let pollRef = doc(db, 'polls', pollingID);
            await updateDoc(pollRef, {
                optionBCount: optionTwoCount + 1
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    
    const onOption3 = async () => {
        try {
            let pollRef = doc(db, 'polls', pollingID);
            await updateDoc(pollRef, {
                optionCCount: optionThreeCount + 1
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    
    const onOption4 = async () => {
        try {
            let pollRef = doc(db, 'polls', pollingID);
            await updateDoc(pollRef, {
                optionDCount: optionFourCount + 1
            })
            setVotingStatus(true);
            console.log(`Successfully updated ${pollRef.id}`);
        } catch(e) { console.log(e); }
    };

    useEffect(() => {
        // let totalVotes = optionOneCount + optionTwoCount + optionThreeCount + optionFourCount;
        // let votePercentageA = optionOneCount / totalVotes * 100;
        // let votePercentageB = optionTwoCount / totalVotes * 100;
        // let votePercentageC = optionThreeCount / totalVotes * 100;
        // let votePercentageD = optionFourCount / totalVotes * 100;
        // console.log(`${votePercentageA}% voted for Chenzo`);
        // console.log(`${votePercentageB}% voted for Marky`);
        // console.log(`${votePercentageC}% voted for Flax`);
        // console.log(`${votePercentageD}% voted for Ally`);

        onSnapshot(collection(db, "polls"), (snapshot) => {
            snapshot.docs.map(doc => {
                if(doc.id === params.id) {
                    const data = doc.data();
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
    }, []);


    return (
        <Suspense fallback={<div></div>}>
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
                    <PollResults pollID={pollingID} />
                )}
            </div>
        </Suspense>
    )
}