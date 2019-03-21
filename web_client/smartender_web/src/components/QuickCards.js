import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import QuickCard from './QuickCard';

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    drinkType: {
        paddingLeft: 10
    }
});

class QuickCards extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid spacing={24} item xs={12} container>
                <QuickCard dataVal={300} dataKey="Lifetime Drinks"/>
                <QuickCard dataVal={`$` + 4500} dataKey="Lifetime Earnings"/>
                <QuickCard dataVal={23} dataKey="Current Drinks"/>
                <QuickCard dataVal={`$` + 45} dataKey="Current Earnings"/>
                <QuickCard dataVal={5} dataKey="Total Smartenders"/>
                <QuickCard dataVal={2} dataKey="Best Smartender"/>
            </Grid>
        );
    }
}

export default withStyles(styles)(QuickCards);