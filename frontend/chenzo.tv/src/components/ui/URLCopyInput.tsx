import { Copy } from 'phosphor-react';
import { useEffect, useState } from 'react';
interface Props {
    id: string
}


export default function URLCopyInput({ id } : Props) {
    let [urlClicked, setURLClickStatus] = useState(false);

    useEffect(() => {
        if(urlClicked) setTimeout(() => setURLClickStatus(false), 3200)
    }, [urlClicked])
    let url = `http://localhost:3000/poll/${id}`

    if(!urlClicked) {
       return ( <div className="h-screen">
            <div className='flex space-x-auto items-center align-middle justify-center'>
                <div className="flex group has-tooltip bg-gray-600 border-2 border-cyan-800 border-solid py-1 px-1 rounded-md align-middle justify-center items-center">
                    <div className='tooltip rounded-md shadow-lg p-1 bg-cyan-800 text-gray-100 text-sm -mt-20'>Click to Copy</div>
                    <Copy className='mt-[0.125rem] mr-1' width={"18"} height={"18"} />
                    <div className="text-sm hover:text-gray-900 opacity-90 transition cursor-pointer" onClick={()=> {
                        navigator.clipboard.writeText(url); setURLClickStatus(true);}}>{url}</div>
                </div>
            </div>
        </div>
       )
    }
    return (
        <div className="h-screen">
            <div className='flex group space-x-auto items-center align-middle justify-center w-auto'>
                <div className="flex has-tooltip bg-gray-600 border-2 border-cyan-800 border-solid py-1 px-1 rounded-md cursor-pointer align-middle justify-center items-center">
                    <div className='tooltip rounded-md shadow-lg p-1 bg-green-400 text-gray-100 text-sm -mt-20'>✅ Successfully Copied to Clipboard!</div>
                    <Copy className='mt-[0.125rem] mr-1' width={"18"} height={"18"}/>
                    <div className="text-sm hover:text-gray-900 opacity-90 transition" onClick={() => { navigator.clipboard.writeText(url); setURLClickStatus(true); }}>{url}</div>
                </div>
            </div>
        </div>
    )
}