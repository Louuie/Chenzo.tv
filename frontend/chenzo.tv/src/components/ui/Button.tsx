import React from "react"

interface Props {
    label : string,
    icon?: React.ComponentType,
    ComponentToRender?: React.ComponentType
    onButtonClick?: React.MouseEventHandler
}
export default function Button({label, icon: Icon, onButtonClick} : Props) {
    if(!Icon) {
        return <button className={`bg-blue-700 text-white bg-opacity-50`} onClick={onButtonClick}>{label}</button>
    }
    return (
        <button className={`flex space-x-auto items-center text-left py-2 px-2 hover:transition-[ease-in-out] bg-cyan-800 hover:bg-cyan-900 text-white`} onClick={onButtonClick}>
            <Icon />
            <div className="text-left text-xl font-bold">{label}</div>
        </button>
    )
}