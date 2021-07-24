import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 5,
  },
  paper: {
    // margin: '.25em',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: "5em",
    fontSize: "2em",
    verticleAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    width: "100%"
  },
  characterCard: {
    margin: '.25em'
  }
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
                <Grid key={index} item xs={2} >
                  <Paper className={classes.paper}>
                    <div className="characterCard"> {char} </div>
                  </Paper>
                </Grid>
              )
            }
          )
        }
      </Grid>
    </div>
  );
}
