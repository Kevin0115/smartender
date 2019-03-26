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

const SimpleBarChart = (props) => {
    const { theme, data, xAxisKey, yAxisKey } = props;
    return (
        <ResponsiveContainer width="99%" height="100%" minHeight={255}>
            <BarChart data={data} margin={{top: 24, right: 24}}>
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yAxisKey} fill={theme.palette.primary.main} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(SimpleBarChart);