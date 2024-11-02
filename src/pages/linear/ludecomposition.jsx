import { evaluate } from 'mathjs'
import React from 'react'
import { useState } from "react"
import FlooTer from '/src/components/Flooter'
import Link from 'next/link'
import NavBarLinear from '@/components/Navbarlinear'

const LUDcom = () => {
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

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            console.log(matrixA[i][j]);
        }
    }

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
                <NavBarLinear />
                <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
                    <ul className="classmenu menu menu-lg bg-white rounded-box w-[95%] gap-[0.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] grid grid-flow-col">
                        <li className='hover:bg-red-50 rounded-box'>
                            <Link href="/linear/cramersrule">Cramer's Rule</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/guasselimination">Guass Elimination</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/guassjordan">Guass Jordan</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/matrixinvertion">Matrix Inversion</Link>
                        </li>
                        <li className='hover:bg-red-400  bg-red-500 text-white  rounded-box'>
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
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box mb-[1rem]'>
                    <div>
                        <div className='flex flex-col justify-center items-center pt-[2%] pb-[2%]'>
                            <div className='grid grid-flow-col mt-[3%]'>
                                <div className=''>
                                    <p>Matrix Size (NxN)</p>
                                    <input type="number" placeholder="Input Size" value={size} onChange={inputSize} className="input input-bordered w-[80%] max-w-xs" />
                                </div>
                                <button className="calculatebutton btn mt-[15%] w-[100%] text-[1rem] text-white" onClick={calculateCramersRule}>Calculate</button>
                            </div>
                            <hr className='border-red-400 w-[80%] mt-[3%] opacity-100 mb-[2%]' />
                            <div className='flex flex-row 4 justify-center items-center gap-[2%] w-[60rem]'>
                                <div className='flex flex-col items-center'>
                                    <p>Matrix A</p>
                                    <div>
                                        {matrixA.map((row, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                {row.map((value, colIndex) => (
                                                    <input
                                                        key={colIndex}
                                                        type="number"
                                                        value={matrixA[rowIndex][colIndex]}
                                                        onChange={(e) => updateMatrixA(rowIndex, colIndex, e.target.value)}
                                                        className="input input-bordered text-center m-[3px] w-[5rem]"
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p>X</p>
                                <div className='flex flex-col items-center'>
                                    <h3>Matrix X</h3>
                                    <div>
                                        {matrixX.map((value, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                <input
                                                    type="number"
                                                    value={matrixX[rowIndex]}
                                                    onChange={(e) => updateMatrixX(rowIndex, e.target.value)}
                                                    className="input input-bordered text-center m-[3px] w-[5rem]"
                                                    disabled
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p>=</p>
                                <div className='flex flex-col items-center'>
                                    <h3>Matrix B</h3>
                                    <div>
                                        {matrixB.map((value, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                <input
                                                    type="number"
                                                    value={matrixB[rowIndex]}
                                                    onChange={(e) => updateMatrixB(rowIndex, e.target.value)}
                                                    className="input input-bordered text-center m-[3px] w-[5rem]"
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

export default LUDcom
