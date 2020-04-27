import React from 'react';
import Paper from '@material-ui/core/Paper';
import "./Enrollments.css";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import AuthService from './AuthService';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(1),
        padding: "10px",
    },
}));

export default function Enrollments() {
    const classes = useStyles();

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);

    const [disable, setDisable] = React.useState({});

    const history = useHistory();

    function handleClick(item, status, e) {
        e.preventDefault();

        setDisable({
            [item.id]: true
        });

        AuthService.updateEnrollment({
            ...item,
            status
        })
            .then(response => response.json())
            .then((response) => {
                if (response.id) {
                    history.go(0);
                }
            });
    }

    React.useEffect(() => {
        AuthService.getEnrollments()
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.error) {
                        history.push("/");
                    } else {
                        setIsLoaded(true);
                        setItems(result);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <Paper className={classes.paper} elevation={10}>
                            <Grid container spacing={0}>
                                <Grid item xs={6} >
                                    Created at: {item.createdAt}<br />
                                    userId {item.userId}<br />
                                    trialId: {item.trialId}<br />

                                    status: {item.status === 'approved' &&
                                        <span className="label green">{item.status}</span>
                                    }

                                    {item.status === 'cancelled' &&
                                        <span className="label red">{item.status}</span>
                                    }

                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-end"
                                    >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e) => handleClick(item, 'cancelled', e)}
                                        disabled={disable[item.id]}
                                    >
                                        {disable[item.id] &&
                                            <div>Loading...</div>
                                        }

                                        {!disable[item.id] &&
                                            <div>Cancel</div>
                                        }
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e) => handleClick(item, 'approved', e)}
                                        disabled={disable[item.id]}
                                    >
                                        {disable[item.id] &&
                                            <div>Loading...</div>
                                        }

                                        {!disable[item.id] &&
                                            <div>Approve</div>
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </li>
                ))}
            </ul>
        );
    }
}