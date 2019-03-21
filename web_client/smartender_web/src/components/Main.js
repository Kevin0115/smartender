import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Topbar from './Appbar/Topbar';
import SimpleBarChart from './Charts/SimpleBarChart';
import Smartender from './Smartender';

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

class Main extends Component {

    state = {
        smartenders: []
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
            this.setState({
                smartenders: contents
            });
        })
        .catch(() => console.log("Cannot connect, blocked by browser."));
    }

    // Used for compnentDidMount
    getSmartenderDataOnce = async () => {
        await fetch(`${hostname}`)
        .then(response => response.json())
        .then(contents => {
            this.setState({
                smartenders: contents
            });
        })
        .catch(() => console.log("Cannot connect, blocked by browser."));
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