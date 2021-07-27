import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ButtonSave from '../MainApp/ButtonSaveTranslation';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
}));
export default function MultilineTextFields(props) {
  const classes = useStyles();
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          key={`${props.index}textField`}
          id={`${props.index}id`}
          label="Translation"
          rows={4}
          style={{ margin: 8 }}
          placeholder="Translate"
          multiline
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
        />
        <ButtonSave />
      </div>
    </form>
  );
}
