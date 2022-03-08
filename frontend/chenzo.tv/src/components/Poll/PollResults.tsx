import { collection, onSnapshot } from "firebase/firestore";
import { PieChart } from "react-minimal-pie-chart";
import db from "../../firebase/firestore";
import React, { useEffect, useState } from "react";
import './PollResults.css';





export default function PollResults({ pollID }) {

    let [title, setTitle] = useState('');
    let [votePercentageACalc, setVotePercentageACalc] = useState(0);
    let [votePercentageBCalc, setVotePercentageBCalc] = useState(0);
    let [votePercentageCCalc, setVotePercentageCCalc] = useState(0);
    let [votePercentageDCalc, setVotePercentageDCalc] = useState(0);
    let [options, setOptions] = useState(['']);
    let [results, setResults] = useState([{}]);
    let [isLoading, setLoadingStatus] = useState(true);


    useEffect(() => {
        onSnapshot(collection(db, 'polls'), (snapshot) => {
            snapshot.docs.map((doc) => {
                if(doc.id === pollID) {
                    const data = doc.data();
                    let totalVotes = data.optionACount + data.optionBCount + data.optionCCount + data.optionDCount;
                    setVotePercentageACalc(Math.round(data.optionACount / totalVotes * 100));
                    setVotePercentageBCalc(Math.round(data.optionBCount / totalVotes * 100));
                    setVotePercentageCCalc(Math.round(data.optionCCount / totalVotes * 100));
                    setVotePercentageDCalc(Math.round(data.optionDCount / totalVotes * 100));
                    setTitle(data.title);
                    setOptions(data.options);
                    const calcData = [
                        {title: `${options[0]}`, value: Math.round(votePercentageACalc), color: '#E38627'},
                        {title: `${options[1]}`, value: Math.round(votePercentageBCalc), color: '#C13C37'},
                        {title: `${options[2]}`, value: Math.round(votePercentageCCalc), color: '#6A2135'},
                        {title: `${options[3]}`, value: Math.round(votePercentageDCalc), color: '#873e23'},
                    ];
                    setResults(calcData);
                    setTimeout(() => { setLoadingStatus(false); }, 1200);
                }
            })
        })
    }, [results]);


    
    return (
        <div>
            {!isLoading ? (
                <div>
                    <h1>{title}</h1>
                        <PieChart data={[
                            { title: `${options[0]}`, value: votePercentageACalc, color: '#E38627' },
                            { title: `${options[1]}`, value: votePercentageBCalc, color: '#C13C37' },
                            { title: `${options[2]}`, value: votePercentageCCalc, color: '#6A2135' },
                            { title: `${options[3]}`, value: votePercentageDCalc, color: '#154c79' },
                        ]} viewBoxSize={[100, 100]} label={(label) => label.dataEntry.title}/>
                </div>
            ) : (
                <h1>Loading!</h1>
            )}
        </div>
    )
}