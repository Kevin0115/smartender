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
    const { theme, data } = props;
    return (
        <ResponsiveContainer width="99%" height={225}>
            <BarChart data={data} margin={{top: 24, right: 24}}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="numberOfDrinks" fill={theme.palette.primary.main} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(SimpleBarChart);