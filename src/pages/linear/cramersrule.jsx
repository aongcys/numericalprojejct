import { evaluate, Matrix, det, replace } from 'mathjs';
import { MathJax } from 'better-react-mathjax';
import React, { useState } from 'react';
import FlooTer from '/src/components/Flooter';
import Link from 'next/link';
import NavBarLinear from '@/components/Navbarlinear';

const Cramer = () => {
    const [size, setSize] = useState(2);
    const [matrixa, setmatrixa] = useState(Array(2).fill().map(() => Array(2).fill(0)));
    const [matrixb, setmatrixb] = useState(Array(2).fill(0));
    const [matrixX, setmatrixX] = useState(Array(2).fill(0));
    const [data, setdata] = useState([]);

    const inputSize = (event) => {
        const newSize = parseInt(event.target.value);
        setSize(newSize);
        setmatrixa(Array(newSize).fill().map(() => Array(newSize).fill(0)));
        setmatrixb(Array(newSize).fill(0));
        setmatrixX(Array(newSize).fill(0));
    };


    const changematrixasize = (row, col, value) => {
        const changesizea = matrixa.map((r) => [...r]);
        changesizea[row][col] = parseFloat(value);
        setmatrixa(changesizea);
    };

    // for (let i = 0; i < size; i++) {
    //     for (let j = 0; j < size; j++) {
    //         console.log(matrixa[i][j]);
    //     }
    // }

    const changematrixbsize = (row, value) => {
        const changesizeb = [...matrixb];
        changesizeb[row] = parseFloat(value);
        setmatrixb(changesizeb);
    };

    const changematrixsizex = (row, value) => {
        const changesizex = [...matrixX];
        changesizex[row] = parseFloat(value);
        setmatrixX(changesizex);
    };

    const calculateCramersRule = () => {
        const detA = det(matrixa);

        if (detA === 0) {
            alert("Determinant of matrix A is zero. Plese enter a matrix value");
            return;
        }

        let results = [];

        for (let i = 0; i < size; i++) {
            const matrixachange = matrixa.map((row, rowIndex) => {
                const newRow = [...row];
                newRow[i] = matrixb[rowIndex];//สลับ a b
                return newRow;
            });

            const detchange = det(matrixachange);
            const findx = detchange / detA;
            results.push(findx);

        }
        setdata(results)
        setmatrixX(results);
    };

    return (
        <>
            <div className='h-auto bg-stone-200 pb-[10%] '>
                <NavBarLinear />
                <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
                    <ul className="classmenu menu menu-lg bg-white rounded-box w-[95%] gap-[0.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] grid grid-flow-col">
                        <li className='hover:bg-red-500 bg-red-500 text-white rounded-box'>
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
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box mb-[1rem]'>
                    <div>
                        <div className='flex flex-col justify-center items-center pt-[2%] pb-[2%]'>
                            <div className='grid grid-flow-col mt-[3%]'>
                                <div className=''>
                                    <p>Matrix Size (NxN)</p>
                                    <input type="number" placeholder="Input Size" value={size} onChange={inputSize} className="input input-bordered w-[80%]" />
                                </div>
                                <button className="calculatebutton btn mt-[15%] w-[100%] text-[1rem] text-white" onClick={calculateCramersRule}>Calculate</button>
                            </div>
                            <hr className='border-red-400 w-[80%] mt-[3%] opacity-100 mb-[2%]' />
                            <div className='flex flex-row 4 justify-center items-center gap-[2%] w-[60rem]'>
                                <div className='flex flex-col items-center'>
                                    <MathJax className='text-[1rem]' inline dynamic>
                                        {"`Matrix A`"}
                                    </MathJax>
                                    <div>
                                        {matrixa.map((row, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                {row.map((value, colIndex) => (
                                                    <input
                                                        key={colIndex}
                                                        type="number"
                                                        placeholder="0"
                                                        onChange={(e) => changematrixasize(rowIndex, colIndex, e.target.value)}
                                                        className="input input-bordered text-center m-[3px] w-[5rem]"
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
                                                    onChange={(e) => changematrixsizex(rowIndex, e.target.value)}
                                                    className="input input-bordered text-center m-[3px] w-auto max-w-[8rem]"
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
                                        {matrixb.map((value, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row items-center justify-center">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    onChange={(e) => changematrixbsize(rowIndex, e.target.value)}
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

export default Cramer;
