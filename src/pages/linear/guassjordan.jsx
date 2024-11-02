import { evaluate } from 'mathjs'
import React from 'react'
import { MathJax } from 'better-react-mathjax'
import { useState } from "react"
import FlooTer from '/src/components/Flooter'
import Link from 'next/link'
import NavBarLinear from '@/components/Navbarlinear'

const GuassJor = () => {
    const [size, setSize] = useState(2);
    const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
    const [matrixB, setMatrixB] = useState(Array(2).fill(0));
    const [matrixX, setMatrixX] = useState(Array(2).fill(0));
    const [data, setdata] = useState([]);

    const inputSize = (event) => {
        const newSize = parseInt(event.target.value);
        setSize(newSize);
        setMatrixA(Array(newSize).fill().map(() => Array(newSize).fill(0)));
        setMatrixB(Array(newSize).fill(0));
        setMatrixX(Array(newSize).fill(0));
    };


    const updateMatrixA = (row, col, value) => {
        const newMatrixA = matrixA.map((r) => [...r]);
        newMatrixA[row][col] = parseFloat(value);
        setMatrixA(newMatrixA);
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

    const calculategaussjordan = (A, B) => {
        const n = A.length;
        let matrixachange = A.map((row) => [...row]);
        let result = Array(n).fill(0);
        let updatedB = B.slice();

        for (let i = 0; i < n; i++) {
            let maxRow = i;//หาตัวที่ pivot เยะสุด
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(matrixachange[k][i]) > Math.abs(matrixachange[maxRow][i])) {
                    maxRow = k;
                }
            }

            [matrixachange[i], matrixachange[maxRow]] = [matrixachange[maxRow], matrixachange[i]];

            if (matrixachange[i][i] === 0) {
                throw new Error("Matrix is singular or nearly singular");
            }

            const pivot = matrixachange[i][i]; // ทำให้ matrix i,i มีค่า = 1;
            for (let j = i; j < n; j++) {
                matrixachange[i][j] /= pivot;
            }
            updatedB[i] /= pivot;

            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = matrixachange[k][i]; // ทำให้ เป็น 0 พวก factor คือ หัวใจที่เอามาลบ
                    for (let j = i; j < n; j++) {
                        matrixachange[k][j] -= factor * matrixachange[i][j];
                    }
                    updatedB[k] -= factor * updatedB[i];
                }
            }
        }

        for (let i = 0; i < n; i++) {
            result[i] = updatedB[i];
        }

        return result;
    };



    return (
        <>
            <div className='h-auto bg-stone-200 pb-[10%]'>
                <NavBarLinear />
                <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
                    <ul className="classmenu menu menu-lg bg-white rounded-box w-[95%] gap-[0.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] grid grid-flow-col">
                        <li className='hover:bg-red-500 rounded-box'>
                            <Link href="/linear/cramersrule">Cramer's Rule</Link>
                        </li>
                        <li className='hover:bg-red-40 rounded-box'>
                            <Link href="/linear/guasselimination">Guass Elimination</Link>
                        </li>
                        <li className='hover:bg-red-400  bg-red-500 text-white rounded-box'>
                            <Link href="/linear/guassjordan">Guass Jordan</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/matrixinvertion">Matrix Inversion</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/ludecomposition">LU decomposition</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/jacobiiteration">Jacobi Interation</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/conjugate">Conjugate Gradiant</Link>
                        </li>
                    </ul>
                </div>
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box mb-[1rem] p-6'>
                    <div className='flex flex-col justify-center items-center pt-4 pb-4'>
                        <div className='grid grid-flow-col mt-3 gap-4'>
                            <div className='grid grid-flow-col mt-[3%]'>
                                <div className=''>
                                    <p>Matrix Size (NxN)</p>
                                    <input type="number" placeholder="Input Size" value={size} onChange={inputSize} className="input input-bordered w-[80%]" />
                                </div>
                                <button
                                    className="calculatebutton btn mt-[15%] w-[100%] text-[1rem] text-white"
                                    onClick={() => {
                                        const result = calculategaussjordan(matrixA, matrixB);
                                        setdata(result); // Set the result in the state
                                        setMatrixX(result);
                                    }}
                                >
                                    Calculate
                                </button>
                            </div>
                        </div>
                        <hr className='border-red-400 w-full mt-6 opacity-100 mb-4' />
                        <div className='flex flex-row justify-center items-center gap-4 w-full'>
                            <div className='flex flex-col items-center'>
                                <MathJax className='text-[1rem]' inline dynamic>
                                    {"`Matrix A`"}
                                </MathJax>
                                <div>
                                    {matrixA.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex flex-row items-center justify-center">
                                            {row.map((value, colIndex) => (
                                                <input
                                                    key={colIndex}
                                                    type="number"
                                                    placeholder="0"
                                                    onChange={(e) => updateMatrixA(rowIndex, colIndex, e.target.value)}
                                                    className="input input-bordered text-center m-1 w-20"
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <MathJax className='text-[1rem]' inline dynamic>
                                {"`x`"}
                            </MathJax>
                            <div className='flex flex-col items-center'>
                                <MathJax className='text-[1rem]' inline dynamic>
                                    {"`{X}`"}
                                </MathJax>
                                <div>
                                    {matrixX.map((value, rowIndex) => (
                                        <div key={rowIndex} className="flex flex-row items-center justify-center">
                                            <input
                                                type="number"
                                                value={matrixX[rowIndex]}
                                                onChange={(e) => updateMatrixX(rowIndex, e.target.value)}
                                                className="input input-bordered text-center m-1 w-auto max-w-[8rem]"
                                                disabled
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <MathJax className='text-[1rem]' inline dynamic>
                                {"`=`"}
                            </MathJax>
                            <div className='flex flex-col items-center'>
                                <MathJax className='text-[1rem]' inline dynamic>
                                    {"`{B}`"}
                                </MathJax>
                                <div>
                                    {matrixB.map((value, rowIndex) => (
                                        <div key={rowIndex} className="flex flex-row items-center justify-center">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                onChange={(e) => updateMatrixB(rowIndex, e.target.value)}
                                                className="input input-bordered text-center m-1 w-20"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-red-500 w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border-double border-4 border-white border-opacity-30 rounded-box p-[2rem] flex flex-col items-center justify-center gap-3 '>
                    {data.length === 0 ? (
                        <p className='text-[1.5rem] text-white'>Please Click Calculate Button</p>
                    ) : (
                        <div className='flex flex-col items-center p-[1rem]'>
                            <MathJax className='text-[1.5rem] text-white' inline dynamic>
                                {"`Answer`"}
                            </MathJax>
                            <hr className='border-white w-[100%] mt-[3%] opacity-100 mb-[2%]' />
                            {data.map((x, index) => (
                                <MathJax className='text-[1.2rem] mb-1 text-white'>
                                    <p key={index} >
                                        {"`X`"}<sub>{index + 1}</sub> : {`\\(${x.toFixed(6)}\\)`}
                                    </p>
                                </MathJax>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <FlooTer></FlooTer>
        </>
    );
}

export default GuassJor
