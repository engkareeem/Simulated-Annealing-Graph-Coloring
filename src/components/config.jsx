import {FaTemperatureHalf} from "react-icons/fa6";
import {FaRegSnowflake} from "react-icons/fa";
import {MdColorLens} from "react-icons/md";
import {useRef, useState} from "react";
import {IoMdClose} from "react-icons/io";
import {RiSpeedFill} from "react-icons/ri";

const Config = ({startClickHandle, randomClickHandle,doneEditClickHandle,iterationStartHandle,
                    resetClickHandle,parameters,setParameters, isEditing, speed}) => {
    const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
    let [initialized, setInitialized] = useState(false);
    const [isIterate, setIsIterate] = useState(false);
    const [currentSpeed, setSpeed] = useState(speed.current);
    let onInputChange = (e) => {
        if(numberRegex.test(e.target.value) || e.target.value === "") {
            let newParams = {...parameters};
            if(e.target.name === "colors" && e.target.value !== "") {
                let value = parseInt(e.target.value);
                if(value > 0 && value <= 10) {
                    newParams[e.target.name] = e.target.value;
                    setParameters(newParams);
                }
            } else {
                newParams[e.target.name] = e.target.value;
                setParameters(newParams);
            }

        }
    }
    return (
        <div className="border-[#474060] border p-5 flex flex-col gap-4 rounded-3xl relative">
            <div className={`w-full h-full absolute left-0 top-0 rounded-3xl z-10 backdrop-blur-sm
                flex justify-center items-center ${isEditing ? "":"hidden"}`}>
                <button
                    onClick={doneEditClickHandle}
                    className="btn btn-info text-[1rem]"
                >
                    Done Editing
                </button>
            </div>
            <div className="text-3xl text-center font-bold">
                Settings
            </div>

            <div className={`flex flex-col gap-4 my-4 items-center`}>
                <div className="flex flex-row gap-2">
                    <label className="input input-bordered flex items-center gap-2 w-full ">
                        <input type="text" name="temp" className="grow w-full" placeholder="Temperature"
                               disabled={initialized}
                               value={parameters.temp} onChange={onInputChange}/>
                        <FaTemperatureHalf className="text-xl"/>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full ">
                        <input type="text" name="cool" className="grow w-full" placeholder="Cooling Rate"
                               disabled={initialized}
                               value={parameters.cool} onChange={onInputChange}/>
                        <FaRegSnowflake className="text-xl"/>
                    </label>

                    {/*<input type="text" placeholder="Temperature" className="input input-bordered w-full max-w-xs"/>*/}
                    {/*<input type="text" placeholder="Cooling Rate" className="input input-bordered w-full max-w-xs"/>*/}
                </div>
                <label className="input input-bordered flex items-center gap-2 w-full ">
                    <input type="text" name="colors" className="grow w-full" placeholder="# of Colors (Max 10)"
                           disabled={initialized}
                           value={parameters.colors} onChange={onInputChange}/>
                    <MdColorLens className="text-2xl"/>

                </label>
                {/*<input type="text" placeholder="# of Colors" className="input input-bordered w-full max-w-xs"/>*/}
            </div>
            <div className="flex justify-between">
                <div className="flex items-end gap-4 px-1">
                    <div className="text-xl">Iterating</div>
                    <input type="checkbox" className="toggle toggle-info" checked={isIterate}
                           onChange={(e) => {setIsIterate(e.target.checked)}}
                           />
                </div>
                <div className="flex items-center gap-4 pr-4">
                    <button className="btn btn-circle btn-outline btn-xs"
                            disabled={!isIterate}
                            onClick={() => {
                                if (speed.current <= 1) {
                                    speed.current = Math.max(speed.current - 0.1, 0.1);
                                } else {
                                    speed.current -= 1;
                                }
                            }}
                    ><RiSpeedFill className="rotate-180"/></button>
                    <div className={`${isIterate ? "text-white":"text-gray-500"}`}>Speed x{speed.current.toFixed(1)}</div>
                    <button className="btn btn-circle btn-outline btn-xs"
                            disabled={!isIterate}
                            onClick={() => {
                                if (speed.current < 1) {
                                    speed.current = speed.current + 0.1;
                                } else {
                                    speed.current += 1;
                                }
                            }}
                    ><RiSpeedFill/></button>

                </div>
            </div>
            <div className={`flex gap-2 `}>
                <button
                    onClick={isIterate ? iterationStartHandle : startClickHandle}
                    className={`btn btn-primary text-[1rem] grow ${initialized ? "" : "hidden"}`}
                    disabled={!(parameters.temp && parameters.cool && parameters.colors)}
                >
                    Optimize
                </button>
                <button
                    onClick={() => {
                        setInitialized(true);
                        randomClickHandle();
                    }}
                    className={`btn btn-accent text-[1rem] ${initialized ? "hidden" : ""} grow`}
                    disabled={!(parameters.temp && parameters.cool && parameters.colors)}
                >
                    Random Solution
                </button>
                <button className="btn btn-outline btn-primary px-3" onClick={() => {
                    resetClickHandle();
                    setInitialized(false);
                }}>
                    <IoMdClose className="text-2xl"/>
                </button>
            </div>


        </div>
    );
};

export default Config;