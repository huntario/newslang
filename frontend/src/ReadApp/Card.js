import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ReactCardFlip from 'react-card-flip';

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
    fontSize: "2px",
    paddingTop: '.25em'
  }
}));
export default function CenteredGrid(props) {
  const [isFlipped, updateisFlipped] = useState(false);
  const handleClick = () => updateisFlipped(!isFlipped)
  useEffect(() => {
    const clicked = () => handleClick;
    window.addEventListener('click', clicked)
    // return a clean-up function
    return () => {
      window.removeEventListener('click', clicked)
    }
  })
  const classes = useStyles();
  if (props) {
    return (
      <Grid key={`Grid${props.index + props.words.characters}`} item xs={4} >
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
          <Paper className={classes.paper} onClick={handleClick}>
            <div className="characterCard" style={{ fontSize: '24px', paddingTop: '.75em' }}> <p>{props.words.characters}</p> </div>
          </Paper>
          <Paper className={classes.paper} onClick={handleClick}>
            <div className="pinyinCard" style={{ fontSize: '24px', margin: '1px', paddingTop: '1em' }} > {props.words.pinyin} </div>
            <div className="pinyinCard" style={{ fontSize: '12px', margin: '1px' }} > {props.words.english.join(', ')} </div>
          </Paper>
        </ReactCardFlip>
      </Grid>
    );
  }
}