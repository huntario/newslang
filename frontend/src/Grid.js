import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CenteredGrid(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {
          props.characters.map(
            function (char, index) {
              return (
                char.map(
                  function (sen, index) {
                    return (
                      <Grid key={index} item xs={2}>
                        <Paper className={classes.paper}>
                          {sen}
                        </Paper>
                      </Grid>
                    );
                  }
                )
              )
            }
          )
        }
      </Grid>
    </div>
  );
}
