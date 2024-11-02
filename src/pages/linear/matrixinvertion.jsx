import { evaluate } from 'mathjs'
import { MathJax } from 'better-react-mathjax'
import React from 'react'
import { useState, useEffect } from "react"
import axios from 'axios'
import FlooTer from '/src/components/flooter'
import Link from 'next/link'
import NavBarLinear from '@/components/Navbarlinear'

const MatrixIN = () => {
    const [size, setSize] = useState(2);
    const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
    const [matrixB, setMatrixB] = useState(Array(2).fill(0));
    const [matrixX, setMatrixX] = useState(Array(2).fill(0));
    const [data, setdata] = useState([]);
    const [inverseMatrix, setInverseMatrix] = useState([]);
    const [checkidfunc, setcheckidfunc] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4002/getmatrixequeation')
            .then((response) => {
                setcheckidfunc(response.data);
                console.log("Check ID Function Data:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const Random = () => {
        const randomid = Math.floor(Math.random() * 2) + 1;
        const selectfunction = checkidfunc.find(item => item.id === randomid);

        console.log("checkidfunc:", checkidfunc); // แสดงข้อมูลของ checkidfunc
        console.log("Selected Function:", selectfunction); // แสดง selectfunction ที่ถูกเลือก

        if (selectfunction) {
            // ตรวจสอบค่า avlaue และ value
            const cleanedMatrixString = selectfunction.avlaue ? selectfunction.avlaue.replace(/(^"|"$)/g, '') : null;
            const cleanedConstantsString = selectfunction.value ? selectfunction.value.replace(/(^"|"$)/g, '') : null;

            console.log("Cleaned Matrix String:", cleanedMatrixString);
            console.log("Cleaned Constants String:", cleanedConstantsString);

            // ตรวจสอบว่าค่าทั้งสองไม่ใช่ null และมีความยาวมากกว่า 0
            if (cleanedMatrixString && cleanedConstantsString) {
                console.log("Before parsing:");
                console.log("Cleaned Matrix String:", cleanedMatrixString);
                console.log("Cleaned Constants String:", cleanedConstantsString);

                // ตรวจสอบความยาวก่อน parsing
                if (cleanedMatrixString.length > 0 && cleanedConstantsString.length > 0) {
                    try {
                        // Parse ค่าเป็น array
                        const parsedMatrix = JSON.parse(cleanedMatrixString);
                        const parsedConstants = JSON.parse(cleanedConstantsString);

                        console.log("After parsing:");
                        console.log("Parsed Matrix:", parsedMatrix);
                        console.log("Parsed Constants:", parsedConstants);

                        // ตรวจสอบว่า parsedMatrix และ parsedConstants เป็น array และมีขนาดที่ถูกต้อง
                        if (Array.isArray(parsedMatrix) && Array.isArray(parsedConstants)) {
                            const matrixSize = parsedMatrix.length;

                            // ตรวจสอบขนาดของ matrix กับ constants
                            if (matrixSize === parsedConstants.length) {
                                setSize(matrixSize);
                                setMatrixA(parsedMatrix);
                                setMatrixB(parsedConstants);
                                console.log("Random Matrix A:", parsedMatrix);
                                console.log("Random Constants B:", parsedConstants);
                            } else {
                                console.error("Matrix size does not match constants size:", matrixSize, parsedConstants.length);
                            }
                        } else {
                            console.error("Parsed matrix or constants are not arrays", parsedMatrix, parsedConstants);
                        }
                    } catch (error) {
                        console.error("Error parsing matrix or constants", error);
                    }
                } else {
                    console.error("Matrix or constants strings are empty");
                }
            } else {
                console.error("Matrix or constants strings are empty or undefined");
            }
        } else {
            console.log("No function found for random id:", randomid);
        }
    };

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

    const calculateinverse = (A) => {
        const n = A.length;
        let matrixachange = A.map((row) => [...row]);
        let inverseMatrix = Array.from({ length: n }, (_, i) => Array(n).fill(0));//เมตริกเอกลัษณ์

        for (let i = 0; i < n; i++) {
            inverseMatrix[i][i] = 1;
        }

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(matrixachange[k][i]) > Math.abs(matrixachange[maxRow][i])) {
                    maxRow = k;
                }
            }

            [matrixachange[i], matrixachange[maxRow]] = [matrixachange[maxRow], matrixachange[i]];
            [inverseMatrix[i], inverseMatrix[maxRow]] = [inverseMatrix[maxRow], inverseMatrix[i]];

            if (matrixachange[i][i] === 0) {
                throw new Error("Matrix is singular or nearly singular");
            }

            const pivot = matrixachange[i][i];
            for (let j = 0; j < n; j++) {
                matrixachange[i][j] /= pivot;
                inverseMatrix[i][j] /= pivot;
            }

            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = matrixachange[k][i];
                    for (let j = 0; j < n; j++) {
                        matrixachange[k][j] -= factor * matrixachange[i][j];
                        inverseMatrix[k][j] -= factor * inverseMatrix[i][j];
                    }
                }
            }
        }

        return inverseMatrix;
    };

    const calculatematrixX = (inverseMatrix, matrixB) => {
        const n = inverseMatrix.length;
        let result = Array(n).fill(0);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                result[i] += inverseMatrix[i][j] * matrixB[j];
            }
        }

        return result;
    };

    return (
        <>
            <div className='h-auto bg-stone-200 pb-[10%]'>
                <NavBarLinear />
                <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
                    <ul className="classmenu menu menu-lg bg-white rounded-box w-[90%] gap-[0.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] grid grid-flow-col">
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/cramersrule">Cramer's Rule</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/guasselimination">Guass Elimination</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/guassjordan">Guass Jordan</Link>
                        </li>
                        <li className='hover:bg-red-400  bg-red-500 text-white rounded-box'>
                            <Link href="/linear/matrixinvertion">Matrix Inversion</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/jacobiiteration">Jacobi Interation</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/guassseidel">Guass-Seidel</Link>
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
                                        const invMatrix = calculateinverse(matrixA);
                                        setInverseMatrix(invMatrix);

                                        const solutionX = calculatematrixX(invMatrix, matrixB);
                                        setMatrixX(solutionX);
                                    }}
                                >
                                    Calculate
                                </button>
                                <button className="calculatebutton btn mt-[15%] ml-[1rem] w-[100%] text-[1rem] text-white" onClick={Random}>Random</button>
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
                                                    value={value}
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
                                                value={value}
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
                <div className='bg-red-500 w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border-double border-4 border-white border-opacity-30 rounded-box p-[2rem] flex flex-col items-center justify-center gap-3'>
                    {inverseMatrix.length === 0 ? (
                        <p className='text-[1.5rem] text-white'>Please Click Calculate Button</p>
                    ) : (
                        <div className='flex flex-col items-center p-[1rem] w-[60rem]'>

                            <div className='flex flex-row items-center gap-4'>
                                <div className='flex flex-col items-center p-[1rem]'>
                                    <MathJax className='text-[1.5rem] text-white' inline dynamic>
                                        {"`Matrix  A^-1`"}
                                    </MathJax>
                                    <hr className='border-white w-[100%] mt-[3%] opacity-100 mb-[2%]' />
                                    {inverseMatrix.map((row, rowIndex) => (
                                        <div key={rowIndex} className='flex gap-4'>
                                            {row.map((value, colIndex) => (
                                                <p key={colIndex} className='text-[1.2rem] mb-1 text-white'>
                                                    {value.toFixed(6)}
                                                </p>
                                            ))}
                                        </div>
                                    ))}
                                    <hr className='border-white w-[100%] mt-[3%] opacity-100 mb-[2%]' />
                                </div>

                                <p className='text-[1.75rem] text-white'>x</p>

                                <div className='flex flex-col items-center p-[1rem]'>
                                    <MathJax className='text-[1.5rem] text-white' inline dynamic>
                                        {"`{B}`"}
                                    </MathJax>
                                    <hr className='border-white w-[100%] mt-[3%] opacity-100 mb-[2%] pt-[2%]' />
                                    {matrixB.map((value, rowIndex) => (
                                        <p key={rowIndex} className='text-[1.2rem] mb-1 text-white'>
                                            {value}
                                        </p>
                                    ))}
                                    <hr className='border-white w-[100%] mt-[3%] opacity-100 mb-[2%]' />
                                </div>

                                <p className='text-[1.75rem] text-white'>=</p>

                                <div className='flex flex-col items-center p-[1rem]'>
                                    <MathJax className='text-[1.5rem] text-white' inline dynamic>
                                        {"`{x}`"}
                                    </MathJax>
                                    <hr className='border-white w-[100%] mt-[3%] opacity-100 mb-[2%]' />
                                    {matrixX.map((value, rowIndex) => (
                                        <p key={rowIndex} className='text-[1.2rem] mb-1 text-white'>
                                            {typeof value === 'number' ? value.toFixed(6) : value}
                                        </p>
                                    ))}
                                    <hr className='border-white w-[100%] mt-[3%] opacity-100 mb-[2%]' />
                                </div>
                            </div>
                        </div>

                    )}
                </div>

            </div>
            <FlooTer></FlooTer>
        </>
    );
}

export default MatrixIN
