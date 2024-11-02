import { evaluate, abs } from 'mathjs'
import { useState, useEffect } from "react"
import axios from 'axios'
import { MathJax } from 'better-react-mathjax'
import FlooTer from '/src/components/flooter'
import Link from 'next/link'
import NavBarLinear from '@/components/Navbarlinear'

const Seidel = () => {
    const [size, setSize] = useState(2);
    const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
    const [matrixB, setMatrixB] = useState(Array(2).fill(0));
    const [matrixX, setMatrixX] = useState(Array(2).fill(0));
    const [xinitial, setxinitial] = useState(0);
    const [ans, setcheck] = useState(null);
    const [time, settime] = useState(null);

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

    const inputxinitial = (event) => {
        setxinitial(parseFloat(event.target.value));
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

    const calculate = () => {
        let xnew = [];
        let xold = [];
        let interation = 0;
        let error = 0.000001, newerror = 1;

        for (let i = 0; i < size; i++) {
            xold[i] = xinitial;
            xnew[i] = xinitial;
        }

        while (newerror > error && newerror !== error) {
            newerror = 0;
            for (let i = 0; i < size; i++) {
                let inrow = 0;
                xold[i] = xnew[i];

                for (let j = 0; j < size; j++) {
                    if (i !== j) {
                        inrow += matrixA[i][j] * xnew[j];
                    }
                }
                xnew[i] = (matrixB[i] - inrow) / matrixA[i][i];
            }

            for (let i = 0; i < size; i++) {
                newerror += Math.abs(xnew[i] - xold[i]) / Math.abs(xnew[i]);
            }

            interation++;
        }

        while (newerror > error) {
            newerror = 0;

            for (let i = 0; i < size; i++) {
                let inrow = 0;

                for (let j = 0; j < size; j++) {
                    if (i !== j) {
                        inrow += matrixA[i][j] * xnew[j]; // ใช้ xnew ที่อัพเดทไปเรื่อยๆ
                    }
                }

                // คำนวณค่าใหม่สำหรับ xnew[i]
                const oldXnew = xnew[i];
                xnew[i] = (matrixB[i] - inrow) / matrixA[i][i];

                // อัพเดทค่า error
                newerror += Math.abs((xnew[i] - oldXnew) / xnew[i]);
            }

            interation++;
        }

        settime(interation);
        setcheck(xnew[0]);
        setMatrixX(xnew);
    };

    return (
        <>
            <div className='h-auto bg-stone-200 pb-[10%] '>
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
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/matrixinvertion">Matrix Inversion</Link>
                        </li>
                        <li className='hover:bg-red-400 rounded-box'>
                            <Link href="/linear/jacobiiteration">Jacobi Interation</Link>
                        </li>
                        <li className='hover:bg-red-400  bg-red-500 text-white rounded-box'>
                            <Link href="/linear/guassseidel">Guass-Seidel</Link>
                        </li>
                    </ul>
                </div>
                <div className='bg-white w-[70rem] h-[auto] ml-[10.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box mb-[1rem]'>
                    <div>
                        <div className='flex flex-col justify-center items-center pt-[2%] pb-[2%]'>
                            <div className='flex flex-row gap-[1rem] mt-[3rem]'>
                                <div className=''>
                                    <p>Matrix Size (NxN)</p>
                                    <input type="number" placeholder="Input Size" value={size} onChange={inputSize} className="input input-bordered w-[9rem]" />
                                </div>
                                <div className=''>
                                    <p>X Initial</p>
                                    <input type="number" placeholder="Input xinitial" value={xinitial} onChange={inputxinitial} className="input input-bordered w-[9rem]" />
                                </div>
                                <button className="calculatebutton btn mt-[1.4rem] w-[9rem] text-[1rem] text-white" onClick={calculate}>Calculate</button>
                                <button className="calculatebutton btn mt-[1.4rem] ml-[1rem] w-[9rem] text-[1rem] text-white" onClick={Random}>Random</button>
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
                                                        value={value}
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
                                                    className="input input-bordered text-center m-[3px] w-[7rem]"
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
                                                    value={value}
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
                <div className='bg-red-500 w-[70rem] h-[auto] ml-[10.5%] border-double border-4 border-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box p-[2rem] flex flex-row items-center justify-center gap-3 '>
                    {ans === null ? (
                        <p className='text-white'>Please Click Calculate Button</p>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <MathJax className='text-[1rem] text-white' inline dynamic>
                                {`\\(Total \\) \\(Interation \\) \\(${time}\\)`}
                            </MathJax>
                            <MathJax className='text-[1.5rem] text-white' inline dynamic>
                                {"`Answer`"}
                            </MathJax>
                            <hr className='border-white w-[20rem] mt-[3%] opacity-100 mb-[2%]' />
                            {matrixX.map((value, index) => (
                                <MathJax className='text-white'>
                                    {"`X`"}<sub>{index + 1}</sub> : {`\\(${value}\\)`}
                                </MathJax>
                            ))}
                            <hr className='border-white w-[20rem] mt-[3%] opacity-100 mb-[2%]' />
                        </div>
                    )}
                </div>
            </div>
            <FlooTer></FlooTer>
        </>
    );
}

export default Seidel

