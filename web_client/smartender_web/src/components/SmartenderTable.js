import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        width: '100%',
        paddingBottom: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    tableHead: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
});

const SmartenderTable = (props) => {
    const { classes, colOneHeader, colTwoHeader, data } = props;

    return (
        <Paper className={classes.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="dense" className={classes.tableHead}>{colOneHeader}</TableCell>
                        <TableCell align="right" padding="dense" className={classes.tableHead}>{colTwoHeader}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row" padding="dense">
                                {row.name}
                            </TableCell>
                            <TableCell align="right" padding="dense">{row.details}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

SmartenderTable.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(SmartenderTable);