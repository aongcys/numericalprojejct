import { useState, useEffect } from "react"
import axios from 'axios';
import FlooTer from '/src/components/flooter';
import Link from 'next/link';
import { MathJax } from 'better-react-mathjax';
import NavBarinter from '@/components/Navbarinterpolation';
import { Checkbox } from '@mui/material';

const Lagrange = () => {
    const [size, setSize] = useState(2);
    const [xvalue, setxvalue] = useState(0);
    const [matrixY, setmatrixY] = useState(Array(2).fill(0));
    const [matrixX, setmatrixX] = useState(Array(2).fill(0));
    const [check, setcheck] = useState([]);
    const [data, setdata] = useState(null);
    const [checkidfunc, setcheckidfunc] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4002/getinterpolationfunc')
            .then((response) => {
                setcheckidfunc(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const inputSize = (event) => {
        const newSize = parseInt(event.target.value);
        setSize(newSize);
        setmatrixY(Array(newSize).fill(0));
        setmatrixX(Array(newSize).fill(0));
        setcheck(Array(newSize).fill(false));
    };

    const inputX = (event) => {
        setxvalue(parseFloat(event.target.value));
    };

    const updatematrixY = (row, value) => {
        const newMatrixY = [...matrixY];
        newMatrixY[row] = parseFloat(value);
        setmatrixY(newMatrixY);
    };

    const updatematrixX = (row, value) => {
        const newMatrixX = [...matrixX];
        newMatrixX[row] = parseFloat(value);
        setmatrixX(newMatrixX);
    };

    const SelectXY = (rowIndex) => {
        const updatedSelection = [...check];
        updatedSelection[rowIndex] = !updatedSelection[rowIndex];
        setcheck(updatedSelection);
    };

    const Randomfunc = () => {
        let randomid = Math.floor(Math.random() * 4) + 1;

        const selectfunction = checkidfunc.find(item => item.id === randomid);
        console.log("Selected Function:", selectfunction);

        if (selectfunction) {
            const xrandom = selectfunction.xvalue;
            console.log("Raw xrandom:", xrandom);
            const xarray = xrandom.split(/[\[\],]/).map(value => parseFloat(value.trim())).filter(value => !isNaN(value));
            console.log("Processed xarray:", xarray);

            setmatrixX(xarray);

            const Yrandom = selectfunction.funcvalue;
            const yarray = Yrandom.split(/[\[\],]/).map(value => parseFloat(value.trim())).filter(value => !isNaN(value));
            setmatrixY(yarray);

            setSize(xarray.length);
            setcheck(Array(xarray.length).fill(false));

            console.log("Final matrixX:", xarray);
            console.log("Final matrixY:", yarray);
        } else {
            console.log("No function found for random id:", randomid);
        }
    };

    console.log(check);
    const includedX = matrixX.filter((_, index) => check[index]).map(value => parseFloat(value));
    const includedY = matrixY.filter((_, index) => check[index]).map(value => parseFloat(value));

    const calculateLagran = () => {
        const size = includedX.length;
        const findL = Array.from({ length: size }, () => Array(size).fill(0));

        for (let i = 0; i < size; i++) {
            findL[i][0] = includedY[i]; // เก็บค่า y
        }

        for (let i = 0; i < size; i++) {
            findL[i][1] = 1;
            for (let j = 0; j < size; j++) {
                if (i !== j) {
                    findL[i][1] *= (xvalue - includedX[j]) / (includedX[i] - includedX[j]);
                }
            }
        }

        let result = 0;

        for (let i = 0; i < size; i++) {
            console.log(findL[i][1]);
            result += findL[i][0] * findL[i][1];
        }

        setdata(result.toFixed(6));
    };


    return (
        <>
            <div className='h-auto bg-stone-200 pb-[10%] '>
                <NavBarinter></NavBarinter>
                <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
                    <ul className="classmenu menu menu-lg bg-white rounded-box w-[95%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-row gap-2">
                        <li className='hover:bg-red-500 rounded-box w-[32.5%] flex flex-row items-center justify-center'>
                            <Link href="/interpolation/newtondivided" className='w-[100%] flex flex-row items-center justify-center'>Newton's Divided Difference</Link>
                        </li>
                        <li className='hover:bg-red-400  rounded-box bg-red-500 text-white w-[32.5%] flex flex-row items-center justify-center'>
                            <Link href="/interpolation/lagrangeinter" className='w-[100%] flex flex-row items-center justify-center'>Lagrange Interpolation</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box w-[32.5%]  flex flex-row items-center justify-center'>
                            <Link href="/interpolation/splinelenear" className='w-[100%] flex flex-row items-center justify-center'>Spline interpolation</Link>
                        </li>
                    </ul>
                </div>
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box mb-[1rem]'>
                    <div>
                        <div className='flex flex-col justify-center items-center pt-[2%] pb-[2%]'>
                            <div className='flex flex-row gap-[10px] mt-[3%]'>
                                <div className='flex flex-col items-center'>
                                    <p>Table size</p>
                                    <input type="number" placeholder="Input Size" value={size} onChange={inputSize} className="input input-bordered w-[10rem]" />
                                </div>
                                <div className='flex flex-col items-center '>
                                    <p>find X</p>
                                    <input type="number" placeholder="Input X" onChange={inputX} className="input input-bordered w-[10rem]" />
                                </div>
                                <button className="calculatebutton btn mt-[1.35rem] w-[30%] text-[1rem] text-white" onClick={calculateLagran}>Calculate</button>
                                <button className="calculatebutton btn mt-[1.35rem] w-[10rem] text-[1rem] text-white" onClick={Randomfunc}>Random</button>
                            </div>
                            <hr className='border-red-400 w-[80%] mt-[3%] opacity-100 mb-[2%]' />
                            <div className='flex flex-row 4 justify-center items-center w-[25rem] h-[auto] p-[1rem] rounded-lg border border-opacity-30 border-black bg-stone-50'>
                                <div className='flex flex-col items-center'>
                                    <h3>X Value</h3>
                                    <div>
                                        <div>
                                            {matrixX.map((value, rowIndex) => (
                                                <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                    <Checkbox checked={check[rowIndex]} onChange={() => SelectXY(rowIndex)} />
                                                    <input
                                                        type="number"
                                                        value={matrixX[rowIndex]}
                                                        onChange={(e) => updatematrixX(rowIndex, e.target.value)}
                                                        className="input input-bordered text-center m-[5px] w-[10rem]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h3>Y Value (fx)</h3>
                                    <div>
                                        {matrixY.map((value, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                <input
                                                    type="number"
                                                    value={matrixY[rowIndex]}
                                                    onChange={(e) => updatematrixY(rowIndex, e.target.value)}
                                                    className="input input-bordered text-center m-[5px] w-[10rem]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' bg-black border-double border-4 text-[1rem] border-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box p-[2rem] flex flex-row items-center justify-center gap-3 text-white'>
                    {data === null ? (
                        <p>Please Click Calculate Button</p>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <MathJax className='text-[1rem] text-white' inline dynamic>
                                {`\\(Answer \\) \\(of \\) \\(f(${xvalue}) = ${data}\\)`}
                            </MathJax>
                        </div>
                    )}
                </div>
            </div>
            <FlooTer></FlooTer>
        </>
    );
}

export default Lagrange;
