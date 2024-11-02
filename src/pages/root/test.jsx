import { evaluate } from 'mathjs';
import React, { useState } from "react";
import NavBarRoot from '@/components/Navbarroot';
import FlooTer from '/src/components/Flooter';
import { MathJax } from 'better-react-mathjax';
import { LineChart } from '@mui/x-charts/LineChart';
import Link from 'next/link';

const Test = () => {
    const [data, setData] = useState([]);
    const [xl, setxl] = useState(0);
    const [xr, setxr] = useState(0);
    const [Equation, setEquation] = useState("");
    const [errorvalue, seterrorvalue] = useState(0.000001);
    const [answer, setanswer] = useState(0);

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
    };

    const Bisection = (xl, xr, errorvalue) => {
        if (xl === 0 && xr === 0) {
            alert("Please Enter a XL or XR");
            return;
        } else if (Equation === "") {
            alert("Please Enter an Equation");
            return;
        }
        const evaluateFunc = (x) => evaluate(Equation, { x });
        const obj = [];
        let xm, iteration = 1,error;

        for (let i = -10; i <= 10; i += 0.002) {
            ingraph.push({
                x: i,
                y: evaluateFunc(i)
            });
        }

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
                Y : y,
                Xm: xm,
                Error: error
            });

            iteration++;
            error = Math.abs(xr - xl);

        }
        setData(obj);
        setanswer(xm);

    };

    // แยกค่าที่จะใช้ในกราฟ
    const xValues = data.map(row => row.Xm);
    const yValues = data.map(row => row.Y);

    return (
        <>
            <div className='h-[auto] bg-stone-200'>
                <NavBarRoot />
                <div className='grid grid-cols-3'>
                    <div className='col-span-1 ml-10'>
                        <div className='mt-5 ml-[2.5rem]'>
                            <ul className="classmenu menu menu-lg bg-white rounded-box w-[80%] h-[3%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                                <li className='hover:bg-red-500 rounded-box'>
                                    <Link href="/root/graphicalmethod">Graphical Method</Link>
                                </li>
                                <li className='hover:bg-red-400 bg-red-500 text-white rounded-box'>
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
                                        {"`f(x): $`".replace("$", Equation ? Equation : "" )}
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
                                    <div className='grid grid-cols-3 ml-[4%]'>
                                        <div className='col-span-2'>
                                            <p>Equation</p>
                                            <input type="text" value={Equation} onChange={inputEquation} placeholder="f(x)" className="input input-bordered w-[100%] max-w-[26rem]" />
                                        </div>
                                        <div>
                                            <button className="calculatebutton btn mt-6 w-[80%] text-[1rem] text-white" onClick={() => Bisection(xl, xr, errorvalue)}>Calculate</button>
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
                            <LineChart
                                xAxis={[{ data: xValues }]}
                                series={[
                                    {
                                        data: yValues,
                                        color: '#FF0000',
                                        marker: {
                                            shape: 'circle',
                                            size: 6,
                                            color: '#000000',
                                            label: {
                                                formatter: (point) => {
                                                    return point.value.toFixed(6); // แสดง 6 ตำแหน่งทศนิยม
                                                },
                                            },
                                        },
                                        tooltip: {
                                            formatter: (point) => {
                                                return `Xm: ${point.value.toFixed(6)}`; // แสดง 6 ตำแหน่งทศนิยมใน tooltip
                                            },
                                        },
                                    },
                                ]}
                                width={1200}
                                height={550}
                            />



                        </div>
                    </div>
                </div>

                {answer === 0 && <div className='bg-white h-[9rem] w-[90%] ml-[5%] mb-[2%] rounded-box shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
                    <p className='ml-[45%] pt-[1.5%] text-[1.5rem]'>This is a Table</p>
                    <p className='ml-[38.5%] pt-[1.5%] text-[1.5rem]'>Please Enter a Calculate Button</p>
                </div>}
                {answer !== 0 && <div className='bg-white h-[auto] w-[90%] ml-[5%] mb-[2%] pb-[2%] rounded-box shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
                    <p className='ml-[5%] pt-[1.5%] text-[1.5rem]'>Table</p>
                    <hr className='border-black w-[90%] opacity-30 ml-[5%]' />
                    <table className='tablebisec'>
                        <thead>
                            <tr>
                                <th className='th1'>Iteration</th>
                                <th className='th2'>Xl</th>
                                <th className='th3'>Xr</th>
                                <th className='th4'>Xm</th>
                                <th className='th5'>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Iteration}</td>
                                    <td>{row.Xl}</td>
                                    <td>{row.Xr}</td>
                                    <td>{row.Xm}</td>
                                    <td>{row.Error}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}

                <FlooTer />
            </div>
        </>
    );
};

export default Test;
