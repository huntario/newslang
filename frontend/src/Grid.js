import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from './Card';

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
                  <Card key={index} char={char}></Card>
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
