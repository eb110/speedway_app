import React, { useEffect, useState } from 'react';
import TotalResultModel from '../modelController/TotalResultModel'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0, .7)',
  zIndex: 1000
}

export default function SumRidersModal({ open, someText, onClose }) {

  const [totals, setTotals] = useState(false)

  const fetchRidersTotals = async () => {
    if (open) {
      await new TotalResultModel().getAllRidersTotals()
        .then((res) => { console.log(res); setTotals(res) })
    }
  }

  useEffect(() => {
    if (open)
      fetchRidersTotals()
  }, [open])


  if (!open) return null
  return (
    <>
      <div style={OVERLAY_STYLES}></div>
      <div style={MODAL_STYLES}>
        <div>
        Points: {totals.points}
        </div>
        <div>
        Heats: {totals.heats}
        </div>
        <div>
        Bonuses: {totals.bonuses}
        </div>
        <div>
        Games: {totals.games}
        </div>
        <div>
        Full Perfects: {totals.fullPerfects}
        </div>
        <div>
        Paid Perfects: {totals.paidPerfects}
        </div>
  
        
        <div>
          <button onClick={onClose}>Close</button>
        </div>


      </div>
    </>
  )
}
