import { evaluate, det } from 'mathjs'; // ลบ replace ออกจากการนำเข้า
import React, { useState } from 'react';
import FlooTer from '/src/components/Flooter';
import Link from 'next/link';
import NavBarLinear from '@/components/Navbarlinear';

const Gusseli = () => {
    const [size, setSize] = useState(2);
    const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
    const [matrixB, setMatrixB] = useState(Array(2).fill(0));
    const [matrixX, setMatrixX] = useState(Array(2).fill(0));
    const [data, setData] = useState([]);

    const inputSize = (event) => {
        const newSize = parseInt(event.target.value);
        if (isNaN(newSize) || newSize < 2) {
            alert("Please enter a valid size (minimum 2).");
            return;
        }
        setSize(newSize);
        setMatrixA(Array(newSize).fill().map(() => Array(newSize).fill(0)));
        setMatrixB(Array(newSize).fill(0));
        setMatrixX(Array(newSize).fill(0));
        setData([]);
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

    const gaussianElimination = (A, B) => {
        const n = A.length;

        // สร้าง augmented matrix
        let augmented = A.map((row, i) => [...row, B[i]]);

        // Forward Elimination
        for (let i = 0; i < n; i++) {
            // หา pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }

            // สลับแถว
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

            // ตรวจสอบว่า pivot ไม่เป็นศูนย์
            if (augmented[i][i] === 0) {
                throw new Error("Matrix is singular or nearly singular");
            }

            // ทำให้ค่าต่ำกว่า pivot เป็นศูนย์
            for (let k = i + 1; k < n; k++) {
                const factor = augmented[k][i] / augmented[i][i];
                for (let j = i; j <= n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }

        // Back Substitution
        let X = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            X[i] = augmented[i][n] / augmented[i][i];
            for (let k = i - 1; k >= 0; k--) {
                augmented[k][n] -= augmented[k][i] * X[i];
            }
        }

        return X;
    };

    const calculateGaussianElimination = () => {
        try {
            const solution = gaussianElimination(matrixA, matrixB);
            setData(solution);
            setMatrixX(solution);
        } catch (error) {
            alert(error.message);
            setData([]);
            setMatrixX(Array(size).fill(0));
        }
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
                        <li className='hover:bg-red-400 bg-red-500 text-white rounded-box'>
                            <Link href="/linear/guasselimination">Gauss Elimination</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/guassjordan">Gauss Jordan</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/matrixinvertion">Matrix Inversion</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/ludecomposition">LU Decomposition</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/jacobiiteration">Jacobi Iteration</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/conjugate">Conjugate Gradient</Link>
                        </li>
                    </ul>
                </div>
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box mb-[1rem] p-6'>
                    <div className='flex flex-col justify-center items-center pt-4 pb-4'>
                        <div className='grid grid-flow-col mt-3 gap-4'>
                            <div>
                                <label className='block mb-2'>Matrix Size (NxN)</label>
                                <input 
                                    type="number" 
                                    placeholder="Input Size" 
                                    value={size} 
                                    onChange={inputSize} 
                                    className="input input-bordered w-full max-w-xs" 
                                />
                            </div>
                            <button 
                                className="calculatebutton btn mt-8 w-full text-[1rem] text-white bg-red-500 hover:bg-red-600" 
                                onClick={calculateGaussianElimination}
                            >
                                Calculate Gaussian Elimination
                            </button>
                        </div>
                        <hr className='border-red-400 w-full mt-6 opacity-100 mb-4' />
                        <div className='flex flex-row justify-center items-center gap-4 w-full'>
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
                                                    className="input input-bordered text-center m-1 w-20"
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
                                                className="input input-bordered text-center m-1 w-20"
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
                                                className="input input-bordered text-center m-1 w-20"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Result Section */}
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box p-6 flex flex-row items-center justify-center gap-3 '>
                    {data.length === 0 ? (
                        <p>Please Click Calculate Button</p>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <p className='text-[1.5rem]'>Matrix X</p>
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

export default Gusseli;
