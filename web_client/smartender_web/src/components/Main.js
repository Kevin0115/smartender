import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Topbar from './Appbar/Topbar';
import SimpleBarChart from './Charts/SimpleBarChart';
import Smartender from './Smartender';
import QuickCard from './QuickCard';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        backgroundSize: 'cover',
        backgroundPosition: '0 400px',
        overflow: 'hidden',
        paddingBottom: 200
    },
    grid: {
        width: 1200,
        margin: `0 ${theme.spacing.unit * 2}px`,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 20px)'
        }
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    block: {
        padding: theme.spacing.unit * 2,
    },
    outlinedButton: {
        textTransform: 'uppercase',
        margin: theme.spacing.unit
    },
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    drinkType: {
        paddingLeft: 10
    }
});

const hostname = "http://ec2-13-58-113-143.us-east-2.compute.amazonaws.com/machines";

// used to index table rows
var id = 0;

class Main extends Component {

    state = {
        smartenders: [],
        lifetimeDrinks: 0,
        lifetimeEarnings: 'N/A',
        currentDrinks: 0,
        currentEarnings: 'N/A',
        totalSmartenders: 0,
        bestSmartender: 0
    }

    componentDidMount() {
        this.getSmartenderDataOnce();
    }

    getSmartenderData = async (event) => {
        event.preventDefault();
    
        await fetch(`${hostname}`)
        .then(response => response.json())
        .then(contents => {
            // console.log(contents);
            this.setStateSmartender(contents);
        })
        .catch((e) => console.log(e));
    }

    // Used for compnentDidMount
    getSmartenderDataOnce = async () => {
        await fetch(`${hostname}`)
        .then(response => response.json())
        .then(contents => {
            this.setStateSmartender(contents);
        })
        .catch((e) => console.log(e));
    }

    sumWeeklyLog = (data) => {
        var i;
        var sum = {
            drinkSum: 0,
            revenueSum: 0
        };
        for(i = 0; i < data.length; i++) {
            sum.drinkSum += data[i].drinks;
            sum.revenueSum += data[i].revenue;
        }

        return sum;
    }

    setStateSmartender = (data) => {

        // variables used for refactoring smartender data
        // refectored data used for double bar chart
        var smartenderData = data;
        var smartendersArr = [];

        // variables used for QuickCard components
        var lifetimeDrinks = 0;
        var currentDrinks = 0;
        var totalSmartenders = 0;
        var bestSmartender = 0;
        var bestWeeklyLogSum = 0;
        var lifetimeEarnings = 0;
        var currentEarnings = 0;

        var j;
        for( j = 0; j < smartenderData.length; j++) {

            // Get each smartender obj
            var smartenderObj = smartenderData[j];

            // If obj isn't undefined do some calculations and refactoring
            if(typeof(smartenderObj) !== 'undefined') {
                var inventoryArr = smartenderObj.inventory;

                /* Calculations for Quick Cards */
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                var drinksArr = smartenderObj.drinks;
                var weeklyLog = smartenderObj.weekly_log;
                var drinksThisWeek = smartenderObj.drinks_this_week;
                var revenueThisWeek = smartenderObj.revenue_this_week;

                var weeklyLogSum = this.sumWeeklyLog(weeklyLog);

                if(weeklyLogSum.revenueSum > bestWeeklyLogSum) {
                    bestWeeklyLogSum = weeklyLogSum.revenueSum;
                    bestSmartender = j; // change this to smartender id?
                }

                lifetimeDrinks += weeklyLogSum.drinkSum + drinksThisWeek;
                lifetimeEarnings += weeklyLogSum.revenueSum + revenueThisWeek;
                currentDrinks += drinksThisWeek;
                currentEarnings += revenueThisWeek;
                totalSmartenders += 1;
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                /* End of calculations for Quick Cards */
    
                /* Refactor smartender array */
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                var drinksInv = [];
                if(inventoryArr.length !== 0 && drinksArr !== 0) {
                    var i;
                    for( i = 0; i < drinksArr.length; i++ ) {
                        var drinkObj = drinksArr[i];
                        drinkObj.curr_volume = inventoryArr[i];
                        drinksInv.push(drinkObj);
                    }
                    smartenderObj.drinks = drinksInv;
                }

                // create data for smartender table
                var smartenderTableRows = [
                    this.createData('Drinks this Week', drinksThisWeek),
                    this.createData('Revenue this Week', `$` + revenueThisWeek.toFixed(2)),
                    this.createData('Lifetime Drinks', weeklyLogSum.drinkSum + drinksThisWeek),
                    this.createData('Lifetime Revenue', `$` + (weeklyLogSum.revenueSum + revenueThisWeek).toFixed(2))
                ];
                smartenderObj.smartenderTableRows = smartenderTableRows;
                smartendersArr.push(smartenderObj);
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                /* End of refactoring for smartender array */
            }

        }

        this.setState({
            smartenders: smartendersArr,
            lifetimeDrinks: lifetimeDrinks,
            currentDrinks: currentDrinks,
            totalSmartenders: totalSmartenders,
            bestSmartender: bestSmartender,
            currentEarnings: `$` + currentEarnings.toFixed(2),
            lifetimeEarnings: `$` + lifetimeEarnings.toFixed(2)
        });
        
    }

    createData = (name, details) => {
        id += 1;
        return { id, name, details };
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <Topbar />
                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid item xs={12}>
                                <div className={classes.topBar}>
                                    <div className={classes.block}>
                                        <Typography variant="h6" gutterBottom>Dashboard</Typography>
                                        <Typography variant="body1">
                                            A visual dashboard for Smartender data.
                                        </Typography>
                                    </div>
                                    <div>
                                        <Button variant="outlined" className={classes.outlinedButton} 
                                            onClick={this.getSmartenderData}
                                        >
                                            Load Data
                                        </Button>
                                    </div>
                                </div>
                            </Grid>
                            <Grid spacing={24} item xs={12} container>
                                <QuickCard dataVal={this.state.lifetimeDrinks} dataKey="Lifetime Drinks"/>
                                <QuickCard dataVal={this.state.lifetimeEarnings} dataKey="Lifetime Earnings"/>
                                <QuickCard dataVal={this.state.currentDrinks} dataKey="Current Drinks"/>
                                <QuickCard dataVal={this.state.currentEarnings} dataKey="Current Earnings"/>
                                <QuickCard dataVal={this.state.totalSmartenders} dataKey="Total Smartenders"/>
                                <QuickCard dataVal={this.state.bestSmartender} dataKey="Best Smartender"/>
                            </Grid>
                            {this.state.smartenders.map((item, index) => (
                                <Smartender item={item} key={index} />
                            ))}
                            <Grid item xs={12}>
                                <SimpleBarChart 
                                    data={this.state.smartenders}
                                    xAxisKey="name"
                                    yAxisKey="drinks_this_week" />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Main);