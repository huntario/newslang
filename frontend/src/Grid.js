import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 5,
  },
  paper: {
    paddingTop: '.5em',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: "5em",
    fontSize: "2em",
    verticleAlign: "center",
    display: "block",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  characterCard: {
    margin: '.25em'
  },
  pinyinCard: {
    fontSize: "2px"
  }
}));

export default function CenteredGrid(props) {
  const classes = useStyles();
  if (props.characters) {
    return (
      <div className={classes.root}>
        <Grid container spacing={1}>
          {
            props.characters.map(
              function (char, index) {
                return (
                  <Grid key={index} item xs={2} >
                    <Paper className={classes.paper}>
                      <div className="characterCard" style={{ fontSize: '24px' }}> <p>{char.character}</p> </div>
                      <div className="pinyinCard" style={{ fontSize: '18px', margin: '1px' }} > {char.piyin} </div>
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
  else {
    return <p> Hold on a moment, we are loading.....</p>
  }
}
