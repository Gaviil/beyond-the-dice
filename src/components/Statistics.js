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
} from 'recharts';
import i18next from 'i18next';


const Statistics = (props) => {
  const {rollList, company} = props;
  const [filter, setFilter] = useState(null);

  const cleanRollList = rollList.filter(roll => roll.diceType !== "Magic");
  return (
    <div className='containerStats' id="containerStats">
      <div className='navFilterStats'>
        <ul>
          <li className={`${!filter ? 'active' : ''}`} onClick={() => {
              setFilter(null);
            }}>
            {i18next.t('stats.campaign')}
          </li>
          {getSessionPlayed(cleanRollList).reverse().map((session, i) => (
            <li key={i} className={`${session.date === filter ? 'active' : ''}`} onClick={() => {
              setFilter(session.date);
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
        {filter && (
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
    { name: i18next.t(`stats.successCrit`), value: rollList.filter(roll => roll.diceType === 100 && roll.value <= 10).length },
    { name: i18next.t(`stats.failCrit`), value: rollList.filter(roll => roll.diceType === 100 && roll.value >= 90).length },
  ];
  const dataRoll = [
    { name: i18next.t(`stats.success`), value: rollList.filter(roll => roll.diceType === 100 && roll.stat && roll.value <= roll.stat.value).length },
    { name: i18next.t(`stats.fail`), value: rollList.filter(roll => roll.diceType === 100 && roll.stat && roll.value > roll.stat.value).length },
  ];
  const COLORS = ['#007991', '#ffad23' ];
  const dataAllCharacterRoll = getPercentOfSucAndFailByCharacters(rollList, company);
  return (
    <div className='globalStats'>
      <div className='columnChart longChart'>
        <div className={'blockStat'}>
          <h3>{i18next.t('stats.graph1')}</h3>
          <AreaChart width={1000} height={250} data={getSessionPlayed(rollList)}
            margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffad23" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffad23" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <Area type="monotone" dataKey="numberOfRolls" stroke="#ffad23" strokeWidth="3" fillOpacity={1} fill="url(#colorUv)" />
            <Tooltip content={<CustomTooltipArea />}/>
          </AreaChart>
        </div>
        <div className={'blockStat'}>
          <h3>{i18next.t('stats.graph2')}</h3>
          <BarChart
            width={1000}
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
            <Tooltip content={<CustomTooltipBar />} cursor={false}/>
            <Bar dataKey="success" fill="#4059AD" />
            <Bar dataKey="successCrit" fill="#007991" />
            <Bar dataKey="fail" fill="#ffad23" />
            <Bar dataKey="failCrit" fill="#FF4242" />
          </BarChart>
        </div>
      </div>
      <div className='columnChart'>
        <div className='blockStat fix'>
          <h3>{i18next.t('stats.graph3')}</h3>
          <div>
            <span>7</span>
          </div>
        </div>
        <div className='blockStat'>
          <h3>{i18next.t('stats.graph4')}</h3>
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
            <Tooltip content={<CustomTooltipPie />}/>
          </PieChart>
        </div>
        <div className='blockStat'>
          <h3>{i18next.t('stats.graph5')}</h3>
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
            <Tooltip  content={<CustomTooltipPie />}/>
          </PieChart>
        </div>
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
          <span style={{textDecoration: 'underline', textDecorationColor: color, fontWeight: 'bold', textDecorationThickness: 3, textUnderlineOffset: 3}}>{member.name}</span>
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
        <span>{i18next.t('name')}</span>
      </div>
      <div className='blockInfo head'>
        <span>{i18next.t('stats.average')}</span>
      </div>
      <div className='blockInfo head'>
        <span>{i18next.t('stats.median')}</span>
      </div>
      <div className='blockInfo head'>
        <span>{i18next.t('stats.lowerDice')}</span>
      </div>
      <div className='blockInfo head'>
        <span>{i18next.t('stats.hightestDice')}</span>
      </div>
    </div>
  );
} 

const StatsByDate = (props) => {
  const {rollList, company} = props;
  const COLORS = ['#ffad23', '#ffc96e', '#FF4242', '#007991', '#64c6d9' , '#4059AD', '#798cc9', '#00C49F' ];
  const rollbyCharacter = getRollByCharacterForGraph(rollList,company);
  const dataAllCharacterRoll = getPercentOfSucAndFailByCharacters(rollList, company)
  console.log(dataAllCharacterRoll);
  return (
    <div className='statsPerDate'>
      <div className='shortChart'>
        <div className={'blockStat'}>
          <h3>{i18next.t('stats.graph6')}</h3>
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
            <Tooltip content={<CustomTooltipBar />} cursor={false}/>
            <Bar dataKey="success" fill="#4059AD" />
            <Bar dataKey="successCrit" fill="#007991" />
            <Bar dataKey="fail" fill="#ffad23" />
            <Bar dataKey="failCrit" fill="#FF4242" />
          </BarChart>
        </div>
        <div className={'blockStat'}>
          <h3>{i18next.t('stats.graph7')}</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={rollbyCharacter}
              cx={145}
              cy={135}
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
            <Tooltip content={<CustomTooltipPie />}/>
          </PieChart>
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


function CustomTooltipArea({ payload, label, active }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
}

function CustomTooltipBar ({ payload, label, active }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label" style={{color: payload[0].fill}}>{`${i18next.t(`stats.${payload[0].name}`)} : ${payload[0].value}%`}</p>
        <p className="label" style={{color: payload[1].fill}}>{`${i18next.t(`stats.${payload[1].name}`)} : ${payload[1].value}%`}</p>
        <p className="label" style={{color: payload[2].fill}}>{`${i18next.t(`stats.${payload[2].name}`)} : ${payload[2].value}%`}</p>
        <p className="label" style={{color: payload[3].fill}}>{`${i18next.t(`stats.${payload[3].name}`)} : ${payload[3].value}%`}</p>
      </div>
    );
  }

  return null;
}
function CustomTooltipPie ({ payload, label, active }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
}


export default Statistics;