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
            <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="numberOfDrinks" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(SimpleBarChart);