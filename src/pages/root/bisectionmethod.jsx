import { evaluate, random, row } from 'mathjs'
import React from 'react'
import NavBarRoot from '@/components/Navbarroot'
import FlooTer from '/src/components/flooter'
import { MathJax } from 'better-react-mathjax'
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react"
import axios from 'axios';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
import Link from 'next/link'

const Bisec = () => {

    const [data, setData] = useState([]);
    const [xl, setxl] = useState(0);
    const [xr, setxr] = useState(0);
    const [Equation, setEquation] = useState("");
    const [errorvalue, seterrorvalue] = useState(0.000001);
    const [answer, setanswer] = useState(0);
    const [checkidfunc, setcheckidfunc] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4002/getrootfunc')
            .then((response) => {
                setcheckidfunc(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const inputEquation = (event) => {
        setEquation(event.target.value);
    };

    const inputXL = (event) => {
        setxl(parseFloat(event.target.value));
    };

    const inputXR = (event) => {
        setxr(parseFloat(event.target.value));
    };

    const inputerrorvalue = (event) => {
        seterrorvalue(parseFloat(event.target.value));
    }

    var Max = 999;

    const Random = () => {
        let randomid = Math.floor(Math.random() * 6) + 1;
        console.log(randomid);

        const selectfunction = checkidfunc.find(item => item.id == randomid);
        if (selectfunction) {
            setEquation(selectfunction.function);
        } else {
            console.log("Ha mai jer Kub");
        }
    }

    const Bisection = (xl, xr, errorvalue) => {
        if (xl == 0 && xr == 0) {
            alert("Please Enter a XL or XR");
        } else if (Equation == "") {
            alert("Please Enter a Equeation");
        }
        const evaluateFunc = (x) => evaluate(Equation, { x });
        const obj = [];
        let xm, iteration = 1, Max = 999, error = Math.abs(xr - xl), y;

        while (Math.abs(xr - xl) >= errorvalue) {
            xm = ((xl + xr) / 2);
            const fxr = evaluateFunc(xr);
            const fxm = evaluateFunc(xm);

            let y = evaluateFunc(xm);

            if (fxm * fxr < 0) {
                xl = xm;
            } else {
                xr = xm;
            }
            console.log(iteration);
            console.log(Math.abs(xr - xl));
            console.log(xl, xr);
            console.log(xm);

            obj.push({
                Iteration: iteration,
                Y: y,
                Xm: xm,
                Error: error
            });

            iteration++;
            error = Math.abs(xr - xl);

        }
        setData(obj);
        setanswer(xm);

    };

    const xvalue = data.map(row => row.Xm);
    const yvalue = data.map(row => row.Y);

    return (
        <>
            <div className='h-[auto] bg-stone-200'>
                <NavBarRoot />
                <div className='grid grid-cols-3'>
                    <div className='col-span-1 ml-10' >
                        <div className=' mt-5 ml-[2.5rem]'>
                            <ul className="classmenu menu menu-lg bg-white rounded-box w-[80%] h-[3%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                                <li className='hover:bg-red-500   rounded-box'>
                                    <Link href="/root/graphicalmethod">Graphical Method</Link>
                                </li>
                                <li className='hover:bg-red-400  bg-red-500 text-white  rounded-box'>
                                    <Link href="/root/bisectionmethod">Bisection Method</Link>
                                </li>
                                <li className='hover:bg-red-400 rounded-box'>
                                    <Link href="/root/falseposition">False Position</Link>
                                </li>
                                <li className='hover:bg-red-400 rounded-box'>
                                    <Link href="/root/onepointinteration">One-point Iteration</Link>
                                </li>
                                <li className='hover:bg-red-400 rounded-box'>
                                    <Link href="/root/newtonmethod">Newton Method</Link>
                                </li>
                                <li className='hover:bg-red-400 rounded-box'>
                                    <Link href="/root/secantmethod">Secant Method</Link>
                                </li>
                            </ul>

                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div className='grid grid-rows-3'>
                            <div className='row-span-1'>
                                <div className='mt-5 mr-20 h-[75%] bg-white rounded-box flex justify-center items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
                                    <MathJax className='text-[1.5rem]' inline dynamic>
                                        {"`f(x): $`".replace("$", Equation ? Equation : "")}
                                    </MathJax>
                                </div>
                            </div>
                            <div className='row-span-2 mt-5 mr-20 h-[150%] bg-white rounded-box flex justify-center items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
                                <div className='grid grid-rows-2'>
                                    <div className='grid grid-cols-3 ml-[4%]'>
                                        <div>
                                            <p>X(L)</p>
                                            <input type="number" value={xl} onChange={inputXL} placeholder="0" className="input input-bordered w-[80%] max-w-xs" />
                                        </div>
                                        <div>
                                            <p>X(R)</p>
                                            <input type="number" value={xr} onChange={inputXR} placeholder="0" className="input input-bordered w-[80%] max-w-xs" />
                                        </div>
                                        <div>
                                            <p>Error</p>
                                            <input type="number" value={errorvalue} onChange={inputerrorvalue} placeholder="0.000001" className="input input-bordered w-[80%] max-w-xs" />
                                        </div>
                                    </div>
                                    <div className='flex flex-row ml-[4%] gap-[1rem]'>
                                        <div className='col-span-2'>
                                            <p>Equation</p>
                                            <input type="text" value={Equation} onChange={inputEquation} placeholder="x^2 - 7" className="input input-bordered w-[20rem]" />
                                        </div>
                                        <div className='flex flex-row gap-[1rem]'>
                                            <button className="calculatebutton btn mt-6 w-[9rem] text-[1rem] text-white " onClick={() => Bisection(xl, xr, errorvalue)}>Calculate</button>
                                            <button className="calculatebutton btn mt-6 w-[9rem] text-[1rem] text-white" onClick={() => Random()}>Random</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-[90%] ml-[5%] mt-[2%] mb-[2%] bg-white h-[5rem] rounded-box flex justify-center items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] text-[1.5rem]'>
                    <p>Result : {answer.toFixed(6)}</p>
                </div>
                <div className='w-[90%] ml-[5%] mb-[2%] bg-white rounded-box shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex justify-center'>
                    <div className='h-[40rem] w-full flex justify-center items-center'>
                        <div className='w-[90%]'>
                            <p className='ml-[5%] pt-[1.5%] text-[1.5rem]'>Graph</p>
                            <hr className='border-black w-[90%] opacity-30 ml-[5%]' />
                            <Plot data={[
                                {
                                    x: xvalue,
                                    y: yvalue,
                                    type: 'scatter',
                                    mode: 'lines+markers',
                                    marker: { color: '#FF4F4F' },
                                    line: { color: '#424242' }
                                }
                            ]} layout={{ width: 1200, height: 550, title: 'Bisection Method' }}></Plot>
                        </div>
                    </div>
                </div>

                {answer == 0 && <div className='bg-white h-[9rem] w-[90%] ml-[5%] mb-[2%] rounded-box shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
                    <p className='ml-[45%] pt-[1.5%] text-[1.5rem]'>This is a Table</p>
                    <p className='ml-[38.5%] pt-[1.5%] text-[1.5rem]'>Please Enter a Calculate Button</p>


                </div>}
                {answer != 0 && <div className='bg-white h-[auto] w-[90%] ml-[5%] mb-[2%] pb-[2%] rounded-box shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
                    <p className='ml-[5%] pt-[1.5%] text-[1.5rem]'>Table</p>
                    <hr className='border-black w-[90%] opacity-30 ml-[5%]' />
                    <table className='tablebisec'>
                        <thead>
                            <tr>
                                <th className='th1'>Iteration</th>
                                <th className='th3'>Xm</th>
                                <th className='th4'>f(x)</th>
                                <th className='th5'>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Iteration}</td>
                                    <td>{row.Xm}</td>
                                    <td>{row.Y}</td>
                                    <td>{row.Error}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}

                <FlooTer></FlooTer>
            </div>
        </>
    );
}

export default Bisec
