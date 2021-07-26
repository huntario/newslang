import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MultiLine from './MultiLine';
import Grid from './Grid';

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '120px',
    "& .MuiPaper-root": {
      marginBottom: ".5em",
      marginTop: ".5em"
    }
  },
  Accordion: {
    marginTop: '12em'
  },
  accordionDetails: {
    padding: '120px'
  },
  multiLine: {
    width: '100%',
    position: "absolute"
  },
  grid: {
    width: '100%',
    position: "absolute",
    fontSize: "100px"
  }
});
export default function ActionsInAccordionSummary(props) {
  const classes = useStyles();
  if (props.sentences) {
    return (
      <div className={classes.root}>
        {
          props.sentences.map(
            function (art, index) {
              return (
                <div className="drawerdrawer" key={`drawerdrawer${index}`}>
                  <Accordion key={index} >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-label="Expand"
                      aria-controls="additional-actions1-content"
                      id="additional-actions1-header"
                      key={`additional-actions1-header${index}`}
                    >
                      <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Checkbox />}
                        label={art}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <div>
                        <MultiLine className={classes.multiLine} key={`index${classes.multiLine}`} index={index}> </MultiLine>
                        <Grid className={classes.grid} characters={props.withEnglish[index]} />
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            }
          )
        }
      </div>
    );
  }
  else {
    return <p>Loading, please wait</p>
  }
}
