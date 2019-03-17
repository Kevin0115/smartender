import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import Topbar from './Appbar/Topbar';

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

const hostname = "http://localhost:8888/";

class Main extends Component {

    state = {
        smartenders: []
    }

    componentDidMount() {}

    getSmartenderData = async (event) => {
        event.preventDefault();
    
        await fetch(`${hostname}`)
        .then(response => response.json())
        .then(contents => {
            this.setState({
                smartenders: contents.smartenders
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
                                <Grid item xs={12} md={4} key={index}>
                                    <Paper className={classes.paper}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {item.name} 
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            Drinks served today: {item.numberOfDrinks} 
                                        </Typography>
                                        <Typography component="span" variant="body1" gutterBottom>
                                            Serves: {item.drinkTypes.map((item, index) => (
                                                <Typography variant="body1" gutterBottom key={index} className={classes.drinkType}>
                                                    {item}
                                                </Typography>
                                            ))} 
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Main);