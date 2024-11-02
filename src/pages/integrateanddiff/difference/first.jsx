import { evaluate, compile, derivative } from 'mathjs'
import React from 'react'
import { useState } from "react"
import Link from 'next/link'
import FlooTer from '/src/components/flooter'
import NavBardiff from '@/components/Navbardiff'
import { MathJax } from 'better-react-mathjax'


const Firstdiff = () => {

  const [x, setx] = useState(0);
  const [h, seth] = useState(0);
  const [Equation, setEquation] = useState("");
  const [thus, setanswer] = useState(null);
  const [error, seterror] = useState("");
  const [errorvalue, seterrorvalue] = useState(null);
  const [direction, setdirection] = useState("");


  const inputEquation = (event) => {
    setEquation(event.target.value);
  };

  const inputx = (event) => {
    setx(parseFloat(event.target.value));
  };

  const inputh = (event) => {
    seth(parseFloat(event.target.value));
  };

  // console.log(error);
  // console.log(direction);

  const calculate = () => {

    const func = (x) => evaluate(Equation, { x });
    const funcdiff = (x) => derivative(Equation, 'x').evaluate({ x });

    if (error == "O(h)" && direction == "Forward") {
      // console.log(x);
      // console.log(h);

      let diffanswer = (func(x + h) - func(x)) / h;
      console.log(diffanswer);

      let error = Math.abs((diffanswer - funcdiff(x)) / funcdiff(x)) * 100;

      setanswer(diffanswer);
      seterrorvalue(error);
    } else if (error == "O(h)" && direction == "Backward") {
      let diffanswer = (func(x) - func(x - h)) / h;
      console.log(diffanswer);

      let error = Math.abs((diffanswer - funcdiff(x)) / funcdiff(x)) * 100;

      setanswer(diffanswer);
      seterrorvalue(error);
    } else if (error == "O(h^2)" && direction == "Central") {
      let diffanswer = (func(x + h) - func(x - h)) / (2 * h);
      console.log(diffanswer);

      let error = Math.abs((diffanswer - funcdiff(x)) / funcdiff(x)) * 100;

      setanswer(diffanswer);
      seterrorvalue(error);
    } else if (error == "O(h^2)" && direction == "Forward") {
      let diffanswer = (-(func(x + (h + h))) + (4 * (func(x + h))) - (3 * (func(x)))) / (2 * h);
      console.log(diffanswer);

      let error = Math.abs((diffanswer - funcdiff(x)) / funcdiff(x)) * 100;

      setanswer(diffanswer);
      seterrorvalue(error);
    } else if (error == "O(h^2)" && direction == "Backward") {
      let diffanswer = ((3 * func(x)) - 4 * func(x - h) + func(x - h * 2)) / (2 * h);
      console.log(diffanswer);

      let error = Math.abs((diffanswer - funcdiff(x)) / funcdiff(x)) * 100;

      setanswer(diffanswer);
      seterrorvalue(error);
    } else if (error == "O(h^4)" && direction == "Central") {
      let diffanswer = (-func(x + h * 2) + (8 * func(x + h)) - (8 * func(x - h)) + func(x - h * 2)) / (12 * h);
      console.log(diffanswer);

      let error = Math.abs((diffanswer - funcdiff(x)) / funcdiff(x)) * 100;

      setanswer(diffanswer);
      seterrorvalue(error);
    }


  };
  return (
    <>
      <div className='h-screen bg-stone-200'>
        <NavBardiff />
        <div className='mt-5 h-[5rem] flex flex-col items-center justify-center pb-[2%]'>
          <ul className="classmenu menu menu-lg bg-white rounded-box w-[80%] gap-[0.5%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-row">
            <li className='hover:bg-red-500 rounded-box  bg-red-500 text-white w-[30%]'>
              <Link href="/integrateanddiff/difference/first">First-Divided-Difference</Link>
            </li>
            <li className='hover:bg-red-400 rounded-box'>
              <Link href="/integrateanddiff/difference/second" className=''>Second-Divided-Difference</Link>
            </li>
            <li className='hover:bg-red-400 rounded-box  '>
              <Link href="/integrateanddiff/difference/third">Third-Divided-Difference</Link>
            </li>
            <li className='hover:bg-red-400 rounded-box flex justify-center items-center'>
              <Link href="/integrateanddiff/difference/fourt">Fourth-Divided-Difference</Link>
            </li>
          </ul>
        </div>
        <div className='flex flex-col justify-center items-center gap-[1rem]'>
          <div className='w-[80%] mt-[1%] mb-[1%] bg-white h-auto p-[2%] rounded-box flex flex-col justify-center items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] text-[1.5rem]'>
            <MathJax className='text-[1.5rem]' inline dynamic>
              {"`f(x): $`".replace("$", Equation ? Equation : "")}
            </MathJax>
            <div className='flex flex-row gap-[1.5rem] mt-[2%]'>
              <label className="form-control bg-base-100 rounded-box w-[8rem]">
                <select className="select select-bordered " onChange={(e) => seterror(e.target.value)}>
                  <option disabled selected className="text-[1.4rem]  hover:bg-red-500">Error</option>
                  <option className="text-[1.3rem] hover:bg-red-500" >O(h)</option>
                  <option className="text-[1.3rem]  hover:bg-red-500" >O(h^2)</option>
                  <option className="text-[1.3rem] hover:bg-red-500" >O(h^4)</option>
                </select>
              </label>
              <label className="form-control bg-base-100 rounded-box w-[8rem]">
                <select className="select select-bordered " onChange={(e) => setdirection(e.target.value)}>
                  <option disabled selected className="text-[1.4rem]  hover:bg-red-500">Direction</option>
                  <option className="text-[1.3rem] hover:bg-red-500" >Forward</option>
                  <option className="text-[1.3rem]  hover:bg-red-500" >Backward</option>
                  <option className="text-[1.3rem] hover:bg-red-500" >Central</option>
                </select>
              </label>
            </div>
            <div>
              <MathJax className='text-[1rem]' inline dynamic>
                {"`Equation`"}
              </MathJax>
              <input type="text" value={Equation} onChange={inputEquation} placeholder="e^x" className="input input-bordered w-[100%] max-w-[26rem]" />
            </div>
            <div className='flex flex-row gap-[1rem]'>
              <div className='flex flex-col'>
                <MathJax className='text-[1rem]' inline dynamic>
                  {"`x`"}
                </MathJax>
                <input type="number" onChange={inputx} placeholder="0" className="input input-bordered w-[6rem]" />
              </div>
              <div className='flex flex-col'>
                <MathJax className='text-[1rem]' inline dynamic>
                  {"`h`"}
                </MathJax>
                <input type="number" onChange={inputh} placeholder="0" className="input input-bordered w-[6rem]" />
              </div>
              <button className="w-[6rem] text-[1rem] text-black shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl h-[3rem] hover:bg-red-500 hover:text-white mt-[1.5rem] font-semibold"
                onClick={(calculate)}>Calculate
              </button>
            </div>
          </div>
          <div className=' bg-white border border-black w-[80%] h-[auto] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-box p-[2rem] flex flex-row items-center justify-center gap-3'>
            {thus === null ? (
              <p className='text-black'>Please Click Calculate Button</p>
            ) : (
              <div className='flex flex-col items-center'>
                <MathJax className='text-[1rem] text-black' inline dynamic>
                  {`\\(Answer \\) \\(of \\) \\(f(${Equation}) = ${thus}\\)`}
                </MathJax>
                <MathJax className='text-[1rem] text-black' inline dynamic>
                  {`\\(Error \\) \\(of \\) \\(f(${Equation}) = ${errorvalue.toFixed(6)}\\) \\(\\% \\)`}
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

export default Firstdiff