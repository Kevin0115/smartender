import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'center',
        color: theme.palette.text.secondary
    }
});

class QuickCard extends Component {
    render() {
        const { classes, dataVal, dataKey } = this.props;
        return (
            <Grid item xs={4} md={2}>
                <Paper className={classes.paper} >
                    <Typography variant="h6">
                        {dataVal}
                    </Typography>
                    <Typography variant="subtitle2">
                        {dataKey}
                    </Typography>
                </Paper>
            </Grid>
        );
    }
}

export default withStyles(styles)(QuickCard);