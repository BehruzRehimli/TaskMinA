import React, { PureComponent } from 'react';
import { BarChart,Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Status 0',
    pv: 4800,
    fill: 'purple', 
  },
  {
    name: 'Status 1',
    pv: 3800,
    fill: 'green', 
  },
  {
    name: 'Status 2',
    pv: 4300,
    fill: 'blue', 
  },
];

export default class Example extends PureComponent {

  render() {

    var status0=this.props.barData.filter(x=>x.status===0)
    data[0].pv=status0.reduce((total, array)=>total+ +array.len,0)

    var status1=this.props.barData.filter(x=>x.status===1)
    data[1].pv=status1.reduce((total, array)=>total+ +array.len,0)

    var status2=this.props.barData.filter(x=>x.status===2)
    data[2].pv=status2.reduce((total, array)=>total+ +array.len,0)


    return (
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="pv">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
