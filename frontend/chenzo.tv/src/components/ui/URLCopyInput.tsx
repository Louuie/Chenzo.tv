import { Copy } from 'phosphor-react';
interface Props {
    id: string
}

export default function URLCopyInput({ id } : Props) {
    let url = `http://localhost:3000/poll/${id}`
    return (
        <div className="flex group space-x-auto items-center align-middle justify-center">
            <div className="flex bg-gray-600 border-2 border-cyan-800 border-solid py-1 px-1 rounded-md cursor-pointer">
                <Copy className='mt-[0.125rem] mr-1' width={"18"} height={"18"}/>
                <div className="text-sm group-hover:text-gray-900 opacity-90 transition" onClick={() => navigator.clipboard.writeText(url)}>{url}</div>
            </div>
            <div className='hidden group-hover:block bg-white h-20 w-20'></div>
        </div>
    )
}