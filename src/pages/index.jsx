import Image from "next/image";
import React from 'react'
import Link from "next/link";

function Home() {
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="startcon relative flex items-center justify-center h-[450px] w-[700px] rounded-lg drop-shadow-lg bg-white">
          <div className="Welcomee">
            <div className="losub">
              <img className="logo" src="/NUlogo.png" alt="NU Logo" />
              <p className="des1">Welcome</p>
            </div>
            <div className="Numer grid grid-cols-2">
              <p className="nu">Numerical</p>
              <p className="me">Method</p>
            </div>
            <div className="ChoinceS">
              <Link href="/root/graphicalmethod">
                <button className="button-81">
                  Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
