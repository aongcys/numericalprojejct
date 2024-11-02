import { evaluate, Matrix, det, replace } from 'mathjs';
import React, { useState } from 'react';
import FlooTer from '/src/components/Flooter';
import Link from 'next/link';
import NavBarinter from '@/components/Navbarinterpolation';
import { Checkbox, getFormControlLabelUtilityClasses, Radio } from '@mui/material';

const NewtonDi = () => {
    const [size, setSize] = useState(2);
    const [xvalue, setxvalue] = useState(0);
    const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
    const [matrixB, setMatrixB] = useState(Array(2).fill(0));
    const [matrixX, setMatrixX] = useState(Array(2).fill(0));
    const [check,setcheck] = useState(2);
    const [data, setdata] = useState([]);

    const inputSize = (event) => {
        const newSize = parseInt(event.target.value);
        setSize(newSize);
        setMatrixB(Array(newSize).fill(0));
        setMatrixX(Array(newSize).fill(0));
        setcheck(newSize);
    };

    const inputX = (event) => {
        setxvalue(parseFloat(event.target.value));
    };

    const updateMatrixB = (row, value) => {
        const newMatrixB = [...matrixB];
        newMatrixB[row] = parseFloat(value);
        setMatrixB(newMatrixB);
    };

    const updateMatrixX = (row, value) => {
        const newMatrixX = [...matrixX];
        newMatrixX[row] = parseFloat(value);
        setMatrixX(newMatrixX);
    };

    const calculateCramersRule = () => {
        const detA = det(matrixA);

        if (detA === 0) {
            alert("Determinant of matrix A is zero. Plese enter a matrix value");
            return;
        }

        let results = [];

        for (let i = 0; i < size; i++) {
            const matrixachange = matrixA.map((row, rowIndex) => {
                const newRow = [...row];
                newRow[i] = matrixB[rowIndex];
                return newRow;
            });

            const detchange = det(matrixachange);
            const findx = detchange / detA;
            results.push(findx);

        }
        setdata(results)
        setMatrixX(results);
    };

    return (
        <>
            <div className='h-auto bg-stone-200 pb-[10%] '>
                <NavBarinter></NavBarinter>
                <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
                    <ul className="classmenu menu menu-lg bg-white rounded-box w-[95%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-row gap-2">
                        <li className='hover:bg-red-500 bg-red-500 text-white rounded-box w-[32.5%] flex flex-row items-center justify-center'>
                            <Link href="/interpolation/newtondivided" className='w-[100%] flex flex-row items-center justify-center'>Newton's Divided Difference</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box w-[32.5%] flex flex-row items-center justify-center'>
                            <Link href="/interpolation/lagrangeinter" className='w-[100%] flex flex-row items-center justify-center'>Lagrange Interpolation</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box w-[32.5%]  flex flex-row items-center justify-center'>
                            <Link href="/interpolation/splineinterpo" className='w-[100%] flex flex-row items-center justify-center'>Spline interpolation</Link>
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
                                <button className="calculatebutton btn mt-[1.35rem] w-[30%] text-[1rem] text-white" onClick={calculateCramersRule}>Calculate</button>
                            </div>
                            <hr className='border-red-400 w-[80%] mt-[3%] opacity-100 mb-[2%]' />
                            <div className='flex flex-row 4 justify-center items-center w-[25rem] h-[auto] p-[1rem] rounded-lg border border-opacity-30 border-black bg-stone-50'>
                                <div className='flex flex-col items-center'>
                                    <div>
                                        {matrixB.map((value, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-col items-center justify-center">
                                                <Checkbox/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h3>X Value</h3>
                                    <div>
                                        {matrixX.map((value, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                <input
                                                    type="number"
                                                    value={matrixX[rowIndex]}
                                                    onChange={(e) => updateMatrixX(rowIndex, e.target.value)}
                                                    className="input input-bordered text-center m-[5px] w-[10rem]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h3>Y Value (fx)</h3>
                                    <div>
                                        {matrixB.map((value, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                <input
                                                    type="number"
                                                    value={matrixB[rowIndex]}
                                                    onChange={(e) => updateMatrixB(rowIndex, e.target.value)}
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
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box p-[2rem] flex flex-row items-center justify-center gap-3 '>
                    {data.length === 0 ? (
                        <p>Please Click Calculate Button</p>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <p className='Text-[1.5rem]'>Matrix X</p>
                            {data.map((x, index) => (
                                <p key={index} className='text-[1rem]'>
                                    X<sub>{index + 1}</sub> : {x.toFixed(6)}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <FlooTer></FlooTer>
        </>
    );
}

export default NewtonDi;
