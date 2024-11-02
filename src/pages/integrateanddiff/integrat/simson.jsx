import { evaluate, compile } from 'mathjs'
import React from 'react'
import { useState, useEffect } from "react"
import axios from 'axios';
import Link from 'next/link'
import FlooTer from '/src/components/flooter'
import { MathJax } from 'better-react-mathjax'
import NavBardiff from '@/components/Navbardiff'
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const Singletrap = () => {

  const [xstart, setxstart] = useState(0);
  const [xend, setxend] = useState(0);
  const [lenght, setlenght] = useState([]);
  const [Equation, setEquation] = useState("");
  const [fvalue, setfvalue] = useState([]);
  const [thus, setanswer] = useState(null);
  const [xvalue, setxvalue] = useState([]);
  const [checkidfunc, setcheckidfunc] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4002/getintegreatfunction')
      .then((response) => {
        setcheckidfunc(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const inputEquation = (event) => {
    setEquation(event.target.value);
  };

  const inputa = (event) => {
    setxstart(parseFloat(event.target.value));
  };

  const inputb = (event) => {
    setxend(parseFloat(event.target.value));
  };

  const Randomfunc = () => {
    let randomid = Math.floor(Math.random() * 4) + 1;
    console.log(randomid);

    const selectfunction = checkidfunc.find(item => item.id == randomid);
    if (selectfunction) {
      setEquation(selectfunction.function);
    } else {
      console.log("Ha mai jer Kub");
    }
  }

  const calculate = () => {
    // console.log(xstart);
    // console.log(xend)
    const func = (x) => evaluate(Equation, { x });
    let h = (xend - xstart) / 2;
    let ingraph = [];
    // console.log(h)
    lenght[0] = xstart;
    lenght[1] = xstart + h;
    lenght[2] = xend;
    console.log(lenght)

    for (let i = 0; i < 3; i++) {
      fvalue[i] = func(lenght[i]);
      console.log(fvalue[i]);
    }

    setxvalue([fvalue[0], fvalue[1], fvalue[2]]);
    let integratenumer = (h / 3) * (fvalue[0] + (4 * fvalue[1]) + fvalue[2]);
    console.log(integratenumer);
    setanswer(integratenumer);
  };

  return (
    <>
      <div className='h-screen bg-stone-200'>
        <NavBardiff />
        <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
          <ul className="classmenu menu menu-lg bg-white rounded-box w-[80%] gap-[0.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-row">
            <li className='hover:bg-red-500 rounded-box'>
              <Link href="/integrateanddiff/integrat/singletrapezoidal">Single Trapezoidal Rule</Link>
            </li>
            <li className='hover:bg-red-400 rounded-box'>
              <Link href="/integrateanddiff/integrat/compositetrapezoidal" className=''>Composite Trapezoidal Rule</Link>
            </li>
            <li className='hover:bg-red-400 rounded-box  bg-red-500 text-white w-[30%] '>
              <Link href="/integrateanddiff/integrat/simson">Simpson's Rule</Link>
            </li>
            <li className='hover:bg-red-400 rounded-box flex justify-center items-center'>
              <Link href="/integrateanddiff/integrat/compositesimson">Composite Simpson's Rule</Link>
            </li>
          </ul>
        </div>
        <div className='flex flex-col justify-center items-center gap-[1rem]'>
          <div className='w-[80%] mt-[1%] mb-[1%] bg-white h-auto p-[2%] rounded-box flex flex-col justify-center items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] text-[1.5rem]'>
            <MathJax className='text-[1.5rem]' inline dynamic>
              {"`f(x): $`".replace("$", Equation ? Equation : "")}
            </MathJax>
            <div className='flex flex-row gap-[1rem] pt-[2rem]'>
              <div className='flex flex-col'>
                <MathJax className='text-[1rem]' inline dynamic>
                  {"`a = (x0)`"}
                </MathJax>
                <input type="number" onChange={inputa} placeholder="0" className="input input-bordered w-[6rem]" />
              </div>
              <div className='flex flex-col'>
                <MathJax className='text-[1rem]' inline dynamic>
                  {"`b = (xn)`"}
                </MathJax>
                <input type="number" onChange={inputb} placeholder="0" className="input input-bordered w-[6rem]" />
              </div>
              <button className="w-[6rem] text-[1rem] text-black shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl h-[3rem] hover:bg-red-500 hover:text-white mt-[1.5rem] font-semibold"
                onClick={(calculate)}>Calculate
              </button>
              <button className="w-[6rem] text-[1rem] text-black shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl h-[3rem] hover:bg-red-500 hover:text-white mt-[1.5rem] font-semibold"
                onClick={(Randomfunc)}>Random
              </button>
            </div>
            <div>
              <MathJax className='text-[1rem]' inline dynamic>
                {"`Equation`"}
              </MathJax>
              <input type="text" value={Equation} onChange={inputEquation} placeholder="4x^5 - 3x^4 + x^3 - 6x +2" className="input input-bordered w-[100%] max-w-[26rem]" />
            </div>
          </div>
          <div className=' bg-white border border-black w-[80%] h-[auto] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box p-[2rem] flex flex-row items-center justify-center gap-3'>
            {thus === null ? (
              <p className='text-black'>Please Click Calculate Button</p>
            ) : (
              <div className='flex flex-col items-center'>
                <MathJax className='text-[1rem] text-black' inline dynamic>
                  {`\\(Value \\) \\(of \\) \\(X0 = ${xvalue[0]}\\)`}
                </MathJax>
                <MathJax className='text-[1rem] text-black' inline dynamic>
                  {`\\(Value \\) \\(of \\) \\(X1 = ${xvalue[1]}\\)`}
                </MathJax>
                <MathJax className='text-[1rem] text-black' inline dynamic>
                  {`\\(Value \\) \\(of \\) \\(X2 = ${xvalue[2]}\\)`}
                </MathJax>
                <MathJax className='text-[1rem] text-black' inline dynamic>
                  {`\\(Answer \\) \\(of \\) \\(f(${Equation}) = ${thus}\\)`}
                </MathJax>
              </div>
            )}
          </div>
        </div>
      </div>
      <FlooTer></FlooTer>
    </>
  );
}

export default Singletrap