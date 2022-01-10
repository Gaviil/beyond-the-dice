import React, {useState} from 'react';
// import i18next from 'i18next';
import {
  getSessionPlayed,
  getMedium,
  getMedian,
  sortRoll,
  getRollByCharacterForGraph,
  getPercentOfSucAndFailByCharacters
} from '../utils/statsGeneration';
import "../styles/statistics.css";

import {
  AreaChart,
  XAxis,
  YAxis, 
  Tooltip,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';


const Statistics = (props) => {
  const {rollList, company} = props;
  const [filter, setFilter] = useState(null);
  const [filterType, setFilterType] = useState(null);

  const cleanRollList = rollList.filter(roll => roll.diceType !== "Magic");
  return (
    <div className='containerStats'>
      <div className='navFilterStats'>
        <ul>
          <li onClick={() => {
              setFilter(null);
              setFilterType(null);
            }}>
            Campagne
          </li>
          <li className='divider'></li>
          {getSessionPlayed(cleanRollList).reverse().map(session => (
            <li onClick={() => {
              setFilter(session.date);
              setFilterType('date');
            }}>
              {session.date}
            </li>
          ))}
        </ul>
      </div>
      <div className='statsCampaign'>
        {!filter && (
          <StatsGlobal
            company={company}
            rollList={cleanRollList}
          />
        )}
        {filter && filterType === 'date' && (
          <StatsByDate
            company={company}
            rollList={cleanRollList.filter(roll => roll.createdAt === filter)}
          />
        )}
      </div>
    </div>
  );
  
}

const StatsGlobal = (props) => {
  const {rollList, company} = props;
  const dataRollCrit = [
    { name: 'Réussite critique', value: rollList.filter(roll => roll.diceType === 100 && roll.value <= 10).length },
    { name: 'Echec critique', value: rollList.filter(roll => roll.diceType === 100 && roll.value >= 90).length },
  ];
  const dataRoll = [
    { name: 'Réussite', value: rollList.filter(roll => roll.diceType === 100 && roll.stat && roll.value <= roll.stat.value).length },
    { name: 'Echec', value: rollList.filter(roll => roll.diceType === 100 && roll.stat && roll.value > roll.stat.value).length },
  ];
  const COLORS = ['#007991', '#D52941', '#ffad23','#9EBD6E', '#FF8042' , '#7B4B94', '#0088FE', '#00C49F' ];
  const dataAllCharacterRoll = getPercentOfSucAndFailByCharacters(rollList, company)
  return (
    <div className='globalStats'>
      <div className='shortChart'>
        <div>
          <h3>Ratio de jet critique</h3>
          <PieChart width={300} height={120}>
            <Pie
              data={dataRollCrit}
              cx={145}
              cy={100}
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              label
            >
              {dataRollCrit.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div>
          <h3>Ratio réussite  / Echec</h3>
          <PieChart width={300} height={120}>
            <Pie
              data={dataRoll}
              cx={145}
              cy={100}
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              label
            >
              {dataRoll.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
      <div className='longChart'>
        <h3>Nombre de dés lancés par session</h3>
        <AreaChart width={800} height={250} data={getSessionPlayed(rollList)}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#007991" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#007991" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Area type="monotone" dataKey="numberOfRolls" stroke="#007991" fillOpacity={1} fill="url(#colorUv)" />
          <Tooltip />
        </AreaChart>
      </div>
      <div className='longChart'>
        <h3>Pourcentage de réussite et d'échec par personnage (dés de statistique)</h3>
        <BarChart
          width={800}
          height={300}
          data={dataAllCharacterRoll}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend /> 
          <Bar dataKey="success" fill="#007991" />
          <Bar dataKey="successCrit" fill="#40376E" />
          <Bar dataKey="fail" fill="#FF8042" />
          <Bar dataKey="failCrit" fill="#D52941" />
        </BarChart>
      </div>
    </div>
  );
}

const ColumnStatCharacter = (props) => {
  const {member,characterRoll, color} = props;
  if(member && characterRoll) {
    return (
      <div className='tableRow'>
        <div className='blockInfo'>
          <span style={{color: color, fontWeight: 'bold'}}>{member.name}</span>
        </div>
        <div className='blockInfo'>
          <span>{getMedium(characterRoll)}</span>
        </div>
        <div className='blockInfo'>
          <span>{getMedian(characterRoll)}</span>
        </div>
        <div className='blockInfo'>
          <span>{sortRoll(characterRoll)[0] || "-"}</span>
        </div>
        <div className='blockInfo'>
          <span>{sortRoll(characterRoll).reverse()[0] || "-"}</span>
        </div>
      </div>
    );  
  }
  return (
    <div className='tableRow'>
      <div className='blockInfo head'>
        Nom
      </div>
      <div className='blockInfo head'>
        Moyenne
      </div>
      <div className='blockInfo head'>
        Mediane
      </div>
      <div className='blockInfo head'>
        Plus petit dés
      </div>
      <div className='blockInfo head'>
        Plus haut
      </div>
    </div>
  );
} 

const StatsByDate = (props) => {
  const {rollList, company} = props;
  const COLORS = ['#007991', '#D52941', '#ffad23','#9EBD6E', '#FF8042' , '#7B4B94', '#0088FE', '#00C49F' ];
  // const COLORSOPA = ['rgba(0, 121, 145, 0.2)', 'rgba(213, 41, 65, 0.2)', 'rgba(255, 173, 35, 0.2)','rgba(158, 189, 110, 0.2)', 'rgba(255, 128, 66, 0.2)' , 'rgba(123, 75, 148, 0.2)', 'rgba(0, 136, 254, 0.2)', 'rgba(0, 196, 159, 0.2)' ];
  const rollbyCharacter = getRollByCharacterForGraph(rollList,company);
  const dataAllCharacterRoll = getPercentOfSucAndFailByCharacters(rollList, company)
  return (
    <div className='statsPerDate'>
      <div className='shortChart'>
        <div>
          <h3>Nombre de dés lancé par personnage</h3>
          <PieChart width={300} height={220}>
            <Pie
              data={rollbyCharacter}
              cx={145}
              cy={110}
              startAngle={90}
              endAngle={450}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              label
            >
              {rollbyCharacter.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div>
        <h3>Pourcentage de réussite et d'échec par personnage (dés de statistique)</h3>
        <BarChart
          width={800}
          height={300}
          data={dataAllCharacterRoll}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend /> 
          <Bar dataKey="success" fill="#007991" />
          <Bar dataKey="successCrit" fill="#40376E" />
          <Bar dataKey="fail" fill="#FF8042" />
          <Bar dataKey="failCrit" fill="#D52941" />
        </BarChart>
      </div>
      </div>
      <div className='table'>
        <ColumnStatCharacter />
        {company.map((member, i) => (
          <ColumnStatCharacter
            member={member}
            characterRoll={rollList.filter(roll => roll.characterId === member.uid)}
            color={COLORS[i % COLORS.length]}
          />
        ))}
        
      </div>
    </div>
  );
}

export default Statistics;