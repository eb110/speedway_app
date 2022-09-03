import React, {useEffect, useState} from 'react';


const RiderPoints = (props) => {

   // console.log('rider points')

    const {pts, calculateTeamPoints} = props
    const [points, setPoints] = useState([])
    const [result, setResult] = useState({})
    
    useEffect(() => {

        const countPoints = () => {
            let pointsTemp = pts.split(',')
            let res = {Pts:0.0, Bns:0, Bg:0}
            for(let i = 0; i < pointsTemp.length; i++){
                let ele = pointsTemp[i][0]
                if(ele >='1' && ele <= '9')
                    res.Pts += parseInt(ele)
                if(pointsTemp[i].includes('.'))
                    res.Pts += 0.5
            }
            res.Bns = pointsTemp.filter(x => x.includes('*')).length
            res.Bg = pointsTemp.filter(x => x !== '-').length
            calculateTeamPoints(res.Pts, res.Bg)
            setResult(res)
           }

           if(pts){
            setPoints(pts.split(','))
            countPoints()
          }
       
        },[pts, calculateTeamPoints])

    let key = 1
            
    return (
        <div
            style={{
                display: 'block'}}
        >
            <div
                style={{display: 'inline-block'}}
            >
                {points.map((point) => (
                    <div
                        key={key++}
                        style={{
                            display: 'inline-block',
                            margin: '1px',
                            border: '1px solid red'}}
                    >
                        {point}
                    </div>
            ))}
            </div>
            <div
                style={{
                    display: 'inline-block',
                    float: 'right'
                }}
            >
                {Object.entries(result).map((res) => (
                    <div
                        key={key++}
                        style={{
                            display: 'inline-block',
                            border: '1px solid red',
                            margin: '1px'
                        }}
                    >
                        {res[0]}:{res[1]}
                    </div> 
                ))}
            </div>
        </div>
    )
}

export default RiderPoints