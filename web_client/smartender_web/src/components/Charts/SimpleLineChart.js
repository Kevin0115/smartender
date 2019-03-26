import React from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend,
    ResponsiveContainer 
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';

const SimpleLineChart = (props) => {
    const { theme, data } = props;
    return (
        <ResponsiveContainer width="99%" height="100%" minHeight={255}>
            <AreaChart data={data} margin={{top: 24, right: 24}}>
                <defs>
                    <linearGradient id="colorDrinks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area dataKey="drinks" type="monotone" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorDrinks)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(SimpleLineChart);