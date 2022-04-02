import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import db from "../../firebase/firestore";
import React, { useEffect, useState } from "react";
import './PollResults.css';
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    id : string
}
/**
 * @param {string} id PollID (DocumentID)
 * @description Renders PollResults in a Pie chart
 */
export default function PollResults({ id } : Props) {

    //let params = useParams();
    let [title, setTitle] = useState('');
    let [docExists, setDocExists] = useState(true);
    let [firstOptionValue, setFirstOptionValue] = useState(0);
    let [secondOptionValue, setSecondOptionValue] = useState(0);
    let [thirdOptionValue, setThirdOptionValue] = useState(0);
    let [fourthOptionValue, setFourthOptionValue] = useState(0);
    let [options, setOptions] = useState(['']);
    let [results, setResults] = useState([0, 0, 0, 0]);
    let [isLoading, setLoadingStatus] = useState(true);

    useEffect(() => {
        const firebaseInsert = async () => {
            const checkRef = doc(db, 'polls', `${id}`)
            const checkSnap = await getDoc(checkRef);
            if(checkSnap.exists()) {
                onSnapshot(collection(db, 'polls'), (snapshot) => {
                    snapshot.docs.map((doc) => {
                        if(doc.id === checkSnap.id) {
                            const data = doc.data();
                            setFirstOptionValue(data.optionACount);
                            setSecondOptionValue(data.optionBCount);
                            setThirdOptionValue(data.optionCCount);
                            setFourthOptionValue(data.optionDCount);
                            setTitle(data.title);
                            setOptions(data.options);
                            setResults([data.optionACount, data.optionBCount, data.optionCCount, data.optionDCount]);
                            setTimeout(() => { setLoadingStatus(false); }, 1200);
                        }
                    });
                });
            } else setDocExists(false);
        };
        firebaseInsert();
    }, [firstOptionValue || secondOptionValue || thirdOptionValue || fourthOptionValue]);


    
    return (
            <div>
                {docExists ? (
                    <div>
                        <h1 className='flex-1 text-center text-4xl font-[700]'>{title}</h1>
                        <div className='flex-1 align-middle max-w-60'> 
                            <Pie data={{
                            labels: [...options],
                            datasets: [
                                {
                                    label: `# of Votes on ${title}`,
                                    data: [firstOptionValue, secondOptionValue, thirdOptionValue, fourthOptionValue],
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                    ],
                                    borderWidth: 1,
                                },
                            ]
                        }} options={{
                            responsive: true,
                            maintainAspectRatio: false
                    }} width={"400"} height={"400"}/>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>This Document does not exist!</h1>
                    </div>
                )}
            </div>
    )
}