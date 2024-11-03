import {BiStats} from "react-icons/bi";
import {FaRandom} from "react-icons/fa";
import {LuIterationCcw} from "react-icons/lu";
import {RiMicrosoftLoopFill} from "react-icons/ri";
import {SiLoopback} from "react-icons/si";
import {FaTemperatureThreeQuarters} from "react-icons/fa6";

const Stats = ({saObject}) => {
    return (
        <div className="border-[#474060] border p-5 flex flex-col gap-2 rounded-3xl h-full">
            <div
                className="text-2xl font-bold border-b border-[rgba(71,64,96,0.5)] pb-3 flex gap-4 justify-center items-center">
                <BiStats/>
                <div>Current Stats</div>
                <BiStats/>
            </div>
            <div className="flex flex-col gap-2 h-full">
                <div className="flex items-center gap-2">
                    <FaRandom className="text-sm text-gray-500"/>
                    <div className="text-gray-300">Random Solution Conflict: <span
                        className="text-white">{saObject.getConflictsCount(saObject.firstVerticesColors)}</span></div>
                </div>
                <div className="flex items-center gap-2">
                    <FaRandom className="text-sm text-gray-500"/>
                    <div className="text-gray-300">Current Conflict: <span
                        className="text-white">{saObject.getConflictsCount(saObject.testedVerticesColors)}</span></div>
                </div>
                <div className="flex items-center gap-2">
                    <FaRandom className="text-sm text-gray-500"/>
                    <div className="text-gray-300">Best Conflict: <span
                        className="text-white">{saObject.bestSolutionConflict}</span></div>
                </div>

                <div className="flex items-center gap-2">
                    <FaTemperatureThreeQuarters className="text-sm text-gray-500"/>
                    <div className="text-gray-300">Current Temp: <span
                        className="text-white">{saObject.currentTemp.toFixed(2)}</span></div>
                </div>
                <div className="flex items-center gap-2 self-center mt-auto">
                    <div className="text-gray-300 text-2xl font-semibold">Solutions Explored: <span
                        className="text-white">{saObject.iteration}</span></div>
                </div>
            </div>
        </div>
    );
};

export default Stats;