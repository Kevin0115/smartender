import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend,
    ResponsiveContainer 
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';

const RangeBarChart = (props) => {
    const { theme, data, yAxisKey, xAxisKey } = props;
    return (
        <ResponsiveContainer width="99%" height={225}>
            <BarChart data={data} margin={{top: 24, right: 24}}>
                <XAxis />
                <YAxis type="number" domain={[0, 100]}/>
                <Tooltip />
                <Legend />
                <Bar dataKey={data.keys()} fill={theme.palette.primary.light} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(RangeBarChart);