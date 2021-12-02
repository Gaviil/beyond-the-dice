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
    labels: props.labels,
    datasets: [
      {
        label: props.title,
        data: props.values,
        backgroundColor: 'rgba(00, 79, 91, 0.2)',
        borderColor: '#007991',
        borderWidth: 1,
      },
    ],
  };
  return (
    <Radar data={data} />
  )
}
