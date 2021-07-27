import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    display: "inline-block"
  },
}));

export default function IconLabelButtons() {
  const classes = useStyles();

  return (
    <div style={{ display: "inline-block" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        startIcon={<SaveIcon />}
      >
        Save Translation
      </Button>
    </div>
  );
}
