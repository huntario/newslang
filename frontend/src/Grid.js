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

export default function CenteredGrid() {
  const classes = useStyles();

  const [articles, updateArticles] = useState([]);
  useEffect(() => {
    async function fetchData2() {
      const response = await fetch('/read', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ "url": "https://www.bbc.com/zhongwen/simp/chinese-news-57815871" }) // body data type must match "Content-Type" header
      }).then(function (response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(function (data) {
        console.log("DATA", data);
        // `data` is the parsed version of the JSON returned from the above endpoint.
        updateArticles(data);
        // { "userId": 1, "id": 1, "title": "...", "body": "..." }
      });
    }
    fetchData2();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {articles.map((char, index) => <Grid key={index} item xs={2}> <Paper className={classes.paper}>{char.character}{char.pinyin}</Paper></Grid>)}
      </Grid>
    </div>
  );
}
