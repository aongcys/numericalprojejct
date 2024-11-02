import { evaluate, Matrix, det, replace, e, row } from 'mathjs';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlooTer from '/src/components/flooter';
import Link from 'next/link';
import NavBarexter from '@/components/Navbarinterpolation';
import dynamic from 'next/dynamic';
import { MathJax } from 'better-react-mathjax'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });


const Simple = () => {
  const [size, setSize] = useState(2);
  const [xvalue, setxvalue] = useState(0);
  const [matrixY, setMatrixY] = useState(Array(2).fill(0));
  const [matrixX, setMatrixX] = useState(Array(2).fill(0));
  const [result, setresult] = useState(null);
  const [avalue, setavalue] = useState([]);
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

  const Random = () => {
    let randomid = Math.floor(Math.random() * 4) + 1;

    const selectfunction = checkidfunc.find(item => item.id === randomid);
    console.log("Selected Function:", selectfunction);

    if (selectfunction) {
      const xrandom = selectfunction.xvalue;
      console.log("Raw xrandom:", xrandom);
      const xarray = xrandom.split(/[\[\],]/).map(value => parseFloat(value.trim())).filter(value => !isNaN(value));
      console.log("Processed xarray:", xarray);
      setMatrixX(xarray);

      const Yrandom = selectfunction.funcvalue;
      const yarray = Yrandom.split(/[\[\],]/).map(value => parseFloat(value.trim())).filter(value => !isNaN(value));
      setMatrixY(yarray);

      setSize(xarray.length);

      console.log("Final matrixX:", xarray);
      console.log("Final matrixY:", yarray);
    } else {
      console.log("No function found for random id:", randomid);
    }
  };

  const inputSize = (event) => {
    const newSize = parseInt(event.target.value);
    setSize(newSize);
    setMatrixY(Array(newSize).fill(0));
    setMatrixX(Array(newSize).fill(0));
  };

  const inputX = (event) => {
    setxvalue(parseFloat(event.target.value));
  };

  const updateMatrixY = (row, value) => {
    const newMatrixY = [...matrixY];
    newMatrixY[row] = parseFloat(value);
    setMatrixY(newMatrixY);
  };

  const updateMatrixX = (row, value) => {
    const newMatrixX = [...matrixX];
    newMatrixX[row] = parseFloat(value);
    setMatrixX(newMatrixX);
  };

  const matrixA = new Array(2).fill().map(() => new Array(2).fill(0));

  const calculate = () => {
    let xsumation = 0;
    let ysumation = 0;
    let xpowsum = 0;
    let xysum = 0;
    let bvalue = [];

    for (let i = 0; i < size; i++) {
      xsumation += matrixX[i];
      ysumation += matrixY[i];
      xpowsum += Math.pow(matrixX[i], 2);
      xysum += matrixX[i] * matrixY[i];
    }
    // console.log(xsumation, ysumation, xpowsum, xysum);

    matrixA[0][0] = size;
    matrixA[0][1] = xsumation;
    matrixA[1][0] = xsumation;
    matrixA[1][1] = xpowsum;
    bvalue[0] = ysumation;
    bvalue[1] = xysum;
    let answer = 0;

    let detmatrixa = det(matrixA);

    // for (let i = 0; i < matrixA.length; i++) {
    //   for (let j = 0; j < matrixA.length; j++) {
    //     console.log(matrixA[i][j]);
    //   }
    // }

    const matrixachange = matrixA.map(row => [...row]);
    for (let i = 0; i < 2; i++) {
      matrixachange[i] = [...bvalue];
      console.log(matrixachange);
      avalue[i] = det(matrixachange) / detmatrixa;
      matrixachange[i] = [...matrixA[i]];
    }

    // console.log(avalue)
    answer = avalue[0] + avalue[1] * xvalue;
    console.log(answer);


    setresult(answer);
  };

  return (
    <>
      <div className='h-auto bg-stone-200 pb-[10%] '>
        <NavBarexter></NavBarexter>
        <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
          <ul className="classmenu menu menu-lg bg-white rounded-box mr-[3%] w-[76%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-row gap-2">
            <li className='rounded-box w-[100%] flex flex-row items-center justify-center'>
              <Link href="/extrapolation/lenearregression" className='w-[100%] flex flex-row items-center justify-center'>Lenear Regression extrapolation</Link>
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
                <button className="calculatebutton btn mt-[1.35rem] w-[30%] text-[1rem] text-white" onClick={calculate}>Calculate</button>
                <button className="calculatebutton btn mt-[1.35rem] w-[10rem] text-[1rem] text-white" onClick={Random}>Random</button>
              </div>
              <hr className='border-red-400 w-[80%] mt-[3%] opacity-100 mb-[2%]' />
              <div className='flex flex-row 4 justify-center items-center w-[25rem] h-[auto] p-[1rem] rounded-lg border border-opacity-30 border-black bg-stone-50'>
                <div className='flex flex-col items-center'>
                  <h3>X Value</h3>
                  <div>
                    {matrixX.map((value, rowIndex) => (
                      <div key={rowIndex} className="flex flex-row items-center justify-center">
                        <input
                          type="number"
                          value={value}
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
                    {matrixY.map((value, rowIndex) => (
                      <div key={rowIndex} className="flex flex-row items-center justify-center">
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => updateMatrixY(rowIndex, e.target.value)}
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
          {result === null ? (
            <p>Please Click Calculate Button</p>
          ) : (
            <div className='flex flex-col items-center'>
              <MathJax className='text-[1.5rem] text-black' inline dynamic>
                {"`Answer`"}
              </MathJax>
              <hr className='border-black w-[20rem] mt-[3%] opacity-100 mb-[2%]' />
              {avalue.map((x, index) => (
                <MathJax className='text-black'>
                  {"`a`"}<sub>{index + 1}</sub> : {`\\(${x.toFixed(6)}\\)`}
                </MathJax>
              ))}
              <MathJax className='text-[1rem] text-black' inline dynamic>
                {`\\(f(${xvalue}) = ${result.toFixed(6)}\\)`}
              </MathJax>
            </div>
          )}
        </div>
      </div>
      <FlooTer></FlooTer>
    </>
  );
}

export default Simple;
