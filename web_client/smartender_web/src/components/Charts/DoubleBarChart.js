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

const DoubleBarChart = (props) => {
    const { theme, data, yAxisKeyBarA, yAxisKeyBarB, xAxisKey } = props;
    return (
        <ResponsiveContainer width="99%" height="100%" minHeight={255}>
            <BarChart data={data} margin={{top: 24, right: 24}}>
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yAxisKeyBarB} fill={theme.palette.primary.dark} />
                <Bar dataKey={yAxisKeyBarA} fill={theme.palette.primary.light} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(DoubleBarChart);