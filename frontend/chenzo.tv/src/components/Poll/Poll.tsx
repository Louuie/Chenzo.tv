import react, { Suspense, useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
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
        setVotingStatus(true);
        setOptionOneCount(optionOneCount + 1);
    };

    
    const onOption2 = async () => {
        setVotingStatus(true);
        setOptionTwoCount(optionTwoCount + 1);
    };

    
    const onOption3 = async () => {
        setVotingStatus(true);
        setOptionThreeCount(optionThreeCount + 1);
    };

    
    const onOption4 = async () => {
        setVotingStatus(true);
        setOptionFourCount(optionFourCount + 1);
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
                    console.log(doc.data());
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
                    <PollResults title={title} pollID={pollingID} options={options} option1Count={optionOneCount} option2Count={optionTwoCount} option3Count={optionThreeCount} option4Count={optionFourCount}/>
                )}
            </div>
        </Suspense>
    )
}