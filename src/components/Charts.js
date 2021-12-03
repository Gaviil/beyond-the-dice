import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Pie, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title
);

export const MyPie = (props) => {
  const data = {
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: [
        '#007991',
        '#D52941',
        '#ffad23',
        '#1b1d29',
        '#9EBD6E',
        '#7B4B94',
        '#21295C',
      ],
      borderColor: [
        '#fff'
      ],
      borderWidth: 2,
    },
  ],
};

  return (
    <Pie data={data} />
  );
  
}

export const MyBar = (props) => {

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Critique par joueur',
    },
  },
};

const data = {
  labels: props.labels,
  datasets: [
    {
      label: 'Réussite critique',
      data: props.valuesOne,
      backgroundColor: '#007991',
    },
    {
      label: 'Échec critique',
      data: props.valuesTwo,
      backgroundColor: '#D52941',
    },
  ],
};

  return (
    <Bar options={options} data={data} />
  );
  
}

export const Block = (props) => {

  return (
    <div className='blockStat' style={{backgroundColor: props.background || "#1b1d29"}}>
      <span>{props.label}</span>
      <span>{props.value}</span>
    </div>
  )
}

export const MyRadar = (props) => {
  const data = {
    labels: props.data[0].nameOfSkills,
    datasets: [],
  };
  const colors = [
        {
          full: 'rgba(00, 79, 91, 1)',
          empty: 'rgba(00, 79, 91, 0.2)',
        },
        {
          full:"rgba(213, 41, 65, 1)",
          empty: "rgba(213, 41, 65, 0.2)"
        },
        {
          full:"rgba(255, 173, 35, 1)",
          empty: "rgba(255, 173, 35, 0.2)"
        },
        {
          full:"rgba(27, 29, 41, 1)",
          empty: "rgba(27, 29, 41, 0.2)"
        },
        {
          full:"rgba(158, 189, 110, 1)",
          empty: "rgba(158, 189, 110, 0.2)"
        },
        {
          full:"rgba(123, 75, 148, 1)",
          empty: "rgba(123, 75, 148, 0.2)"
        },
        {
          full:"rgba(33, 41, 92, 1)",
          empty: "rgba(33, 41, 92, 0.2)"
        },
      ];
  let idColorSelected = 0;
  for( let i = 0;i< props.data.length; i+= 1) {
    data.datasets.push({
        label: props.data[i].name,
        data: props.data[i].numberOfRoll,
        backgroundColor: colors[idColorSelected].empty,
        borderColor: colors[idColorSelected].full,
        borderWidth: 1,
      });
    if(idColorSelected === colors.length) {
      idColorSelected = 0;
    } else {
      idColorSelected += 1;
    }
  }
  return (
    <Radar data={data} />
  )
}
