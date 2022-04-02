import react, { Suspense, useEffect, useState, } from "react";
import Button from '../ui/Button';
import { NumberOne, NumberTwo, NumberThree, NumberFour, ChartBar, ShareNetwork} from "phosphor-react";
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import { NavLink, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, arrayUnion, updateDoc } from "firebase/firestore";
import db from "../../firebase/firestore";
import PollResults from "./PollResults";
import UrlCopyInput from '../ui/URLCopyInput';

export default function Poll() {
    let params = useParams();
    let [ipAddress, setIPAddress] = useState('');
    let [resultClicked, setResultClickedStatus] = useState(false);
    let [isLoading, setLoadingStatus] = useState(true);
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
        setTimeout(() => {setLoadingStatus(false);}, 1200);
    }

    return (
            <div>
                {docStatus ? (
                <div>
                    <div>
                        {!isLoading ? (
                        <div>
                            {!votingStatus ? (
                                <div className="flex flex-col items-center justify-center py-[5rem] bg-gray-900">
                                    {!resultClicked ? (
                                    <div>
                                        <div className="flex-col text-center bg-gray-800 h-auto w-auto md:h-[25rem] md:w-[40rem]">
                                            <h1 className="flex-1 text-3xl font-bold py-2">{title}</h1>
                                            <div className="grid grid-rows-4 grid-flow-row gap-4 px-36 m-auto w-auto">
                                                <Button label={options[0]} onButtonClick={onOption1} icon={NumberOne}></Button>
                                                <Button label={options[1]} onButtonClick={onOption2} icon={NumberTwo}></Button>
                                                <Button label={options[2]} onButtonClick={onOption3} icon={NumberThree}></Button>
                                                <Button label={options[3]} onButtonClick={onOption4} icon={NumberFour}></Button>
                                            </div>
                                            <div className='flex justify-end py-12 px-2'>
                                                <Button label={"Results"} icon={ChartBar} onButtonClick={()=>
                                                    setResultClickedStatus(true)}/>
                                            </div>
                                    </div>
                                    <div className="flex-1 items-center text-left py-2 px-2 bg-gray-800 h-[9rem] w-auto mt-4 ">
                                        <div className="flex">
                                            <ShareNetwork className="mt-[0.26rem]" width={"20"} height={"20"}/>
                                            <div className="font-bold text-lg">Share</div>
                                        </div>
                                        <div className="align-middle py-6"> 
                                            <UrlCopyInput id={pollingID} />       
                                        </div>
                                    </div>
                                </div>
                                    ) : <PollResults id={pollingID} />}
                                </div>
                            ) : (
                                <PollResults id={pollingID} />
                            )}
                        </div>
                        ) : (
                            <Spinner />
                        )}
                    </div>
                </div>
                ) : (
                     <div>
                        <h1>This document does not exist!</h1>
                    </div>
                )}
            </div>
    )
}