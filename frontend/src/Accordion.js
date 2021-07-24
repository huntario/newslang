import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
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
  }
});

export default function ActionsInAccordionSummary(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        props.article.map(
          function (art, index) {
            return (
              <div className="drawerdrawer">
                <Accordion key={index} >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
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
                    <MultiLine unique={index}> </MultiLine>
                  </AccordionDetails>
                </Accordion>
                <Grid characters={props.characters[index]} />
              </div>
            );
          }
        )
      }
    </div>
  );
}
