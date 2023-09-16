

//---------


'use client';

import { useState } from 'react';

export default function Home() {

  const [data, setData] = useState({})
  const [team, setTeam] = useState('')

  const getData = async () => {
    const res = await fetch('team_weaknesses', {
      method: 'POST',
      body: JSON.stringify({team}),
    });
    const data = await res.json();
    setData(data);
  }

  return (
    <div className='flex justify-center'>
      <div className='m-4 rounded-lg border-2 max-w-lg w-full'>
        <div className='m-4'>
          <button
            className='border border-black hover:border-white rounded bg-indigo-400'
            onClick={e=>{e.preventDefault; getData()}}>
              <div className='m-2'>get data</div>
          </button>
        </div>
        <div className='m-4'>{JSON.stringify(data)}</div>
        <div className='m-4'>Input your team here:</div>
        <div className='m-4'>
          <textarea
            className="whitespace-pre text-white w-2/3 h-80 bg-slate-700"
            onChange={e=>{e.preventDefault; setTeam(e.target.value)}}
          />
        </div>
      </div>
    </div>
  )
}







             