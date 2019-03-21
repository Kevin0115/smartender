import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import SimpleLineChart from './Charts/SimpleLineChart';
import DoubleBarChart from './Charts/DoubleBarChart';

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

class Smartender extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid item xs={12} container>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paper}>
                        <Typography variant="subtitle1" gutterBottom>
                            {this.props.item.name} 
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Drinks served this week: {this.props.item.drinks_this_week} 
                        </Typography>
                        <Typography component="span" variant="body1" gutterBottom>
                            Serves: {this.props.item.drinks.map((item, index) => (
                                <Typography variant="body1" gutterBottom key={index} className={classes.drinkType}>
                                    {item.name}
                                </Typography>
                            ))} 
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SimpleLineChart data={this.props.item.weekly_log} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DoubleBarChart 
                        data={this.props.item.drinks}
                        xAxisKey="name"
                        yAxisKeyBarA="curr_volume"
                        yAxisKeyBarB="max_volume" />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Smartender);