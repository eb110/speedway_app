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
  const [totalSum, setTotalSum] = useState(false)

  const fetchRidersTotals = async () => {
    if (open) {
      await new TotalResultModel().getAllRidersTotals()
        .then((res) => { console.log(res); setTotals(res); })
        .then(() => new TotalResultModel().getTotalResultById(1))
        .then((res) => {console.log(res); setTotalSum(res);})
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
        Points: {totals.points} Points: {totalSum.point}
        </div>
        <div>
        Heats: {totals.heats} Heats: {totalSum.heat}
        </div>
        <div>
        Bonuses: {totals.bonuses} Bonuses: {totalSum.bonus}
        </div>
        <div>
        Games: {totals.games} Games: {totalSum.game}
        </div>
        <div>
        Full Perfects: {totals.fullPerfects} Full Perfects: {totalSum.fullPerfect}
        </div>
        <div>
        Paid Perfects: {totals.paidPerfects} Paid Perfects: {totalSum.paidPerfect}
        </div>
  
        
        <div>
          <button onClick={onClose}>Close</button>
        </div>


      </div>
    </>
  )
}
