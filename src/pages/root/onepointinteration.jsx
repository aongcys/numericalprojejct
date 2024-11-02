import { evaluate } from 'mathjs'
import React from 'react'
import { useState, useEffect } from "react"
import axios from 'axios';
import NavBarRoot from '@/components/Navbarroot'
import FlooTer from '@/components/flooter'
import Link from "next/link";
import { MathJax } from 'better-react-mathjax'
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });


const Onep = () => {
    const [data, setdata] = useState([]);
    const [xinitial, setxinitial] = useState(0);
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

    const inputX = (event) => {
        setxinitial(parseFloat(event.target.value));
    };

    const inputerrorvalue = (event) => {
        seterrorvalue(parseFloat(event.target.value));
    }

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

    const Calculateonepoint = (xinitial, errorvalue) => {
        if (xinitial == null) {
            alert("Please Enter X initial");
            return;
        } else if (Equation == "") {
            alert("Please Enter a Equeation");
            return;
        }

        const evaluateFunc = (x) => evaluate(Equation, { x });
        let Max = 999, iteration = 1;
        let xold = xinitial, xnew = 0, error;
        let intable = [];

        xnew = evaluateFunc(xold);

        while (Math.abs(xnew - xold) >= errorvalue && iteration < Max) {
            xold = xnew;
            xnew = evaluateFunc(xold);
            error = Math.abs(xnew - xold);

            intable.push({
                Iteration: iteration,
                Xold: xold,
                Xm: xnew,
                Error: error
            });

            console.log(iteration);
            console.log(Math.abs(xnew - xold));
            console.log(xnew);
            iteration++;
        }
        setdata(intable);
        setanswer(xnew);
    };

    const xvalue = data.map(row => row.Xold);
    const yvalue = data.map(row => row.Xm);

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
                                <li className='hover:bg-red-400  rounded-box'>
                                    <Link href="/root/bisectionmethod">Bisection Method</Link>
                                </li>
                                <li className='hover:bg-red-400 rounded-box'>
                                    <Link href="/root/falseposition">False Position</Link>
                                </li>
                                <li className='hover:bg-red-400  bg-red-500 text-white  rounded-box'>
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
                                            <p>X(Initial)</p>
                                            <input type="number" value={xinitial} onChange={inputX} placeholder="0" className="input input-bordered w-[80%] max-w-xs" />
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
                                            <button className="calculatebutton btn mt-6 w-[9rem] text-[1rem] text-white " onClick={() => Calculateonepoint(xinitial, errorvalue)}>Calculate</button>
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
                            <Plot
                                data={[
                                    {
                                        x: xvalue,
                                        y: xvalue,
                                        type: 'scatter',
                                        mode: 'lines',
                                        line: { color: 'cyan', shape: 'spline' },
                                    },
                                    {
                                        x: xvalue,
                                        y: yvalue,
                                        type: 'scatter',
                                        mode: 'lines',
                                        line: { color: 'green', shape: 'spline' },
                                    },
                                    {
                                        x: xvalue,
                                        y: yvalue,
                                        type: 'scatter',
                                        mode: 'lines+markers',
                                        line: { color: 'black', shape: 'hv' },
                                        marker: { color: 'red' },
                                    },
                                ]}
                                layout={{ width: 1200, height: 550, title: 'Onepoint Iteration' }}
                            />

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
                                <th className='th4'>Xm</th>
                                <th className='th5'>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Iteration}</td>
                                    <td>{row.Xm}</td>
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


export default Onep
