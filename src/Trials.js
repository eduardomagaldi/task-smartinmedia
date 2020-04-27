import React from 'react';
import Paper from '@material-ui/core/Paper';
import "./Trials.css";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import AuthService from './AuthService';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(1),
        padding: "10px",
    },
}));

export default function Trials() {
    const classes = useStyles();

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [now, setNow] = React.useState(null);
    const [disable, setDisable] = React.useState({});
    const [isAdmin, setIsAdmin] = React.useState(false);

    const history = useHistory();

    function handleClick(trialId, e) {
        e.preventDefault();

        setDisable({
            [trialId]: true
        });

        AuthService.enroll({
            trialId,
            createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
        })
            .then(response => response.json())
            .then((response) => {
                if (response.id) {
                    history.go(0);
                }
            });
    }

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    React.useEffect(() => {
        setIsAdmin(AuthService.isAdmin());

        AuthService.getTrials()
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.error) {
                        history.push("/");
                    } else {
                        setIsLoaded(true);
                        setItems(result.trials);
                        setNow(result.now);
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
                <li>
                    {isAdmin &&
                        <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end"
                            >
                            {/* <Button
                                variant="contained"
                                color="secondary"
                                onClick={(e) => handleClick(e)}
                            >

                            </Button> */}

                            <Link to="/trial">
                                <Button variant="contained" color="secondary">
                                    Create trial
                                </Button>
                            </Link>
                            &nbsp;
                            <Link to="/enrollments">
                                <Button variant="contained" color="secondary">
                                    Enrollments
                                </Button>
                            </Link>
                        </Grid>
                    }
                </li>
                {items.map(item => (
                    <li key={item.name}>
                        <Paper className={classes.paper} elevation={10}>
                            <Grid container spacing={0}>
                                <Grid item xs={6} >
                                    <strong>{item.name}</strong><br />
                                    € {item.priceInEUR}<br />
                                    Max Participants: {item.maxPartipants}<br />
                                    Enrollments: {item.numberOfEnrollments}<br />
                                    Start Date: {item.registrationStartDate}<br />
                                    End Date: {item.registrationEndDate}<br />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-end"
                                    >

                                    {new Date(item.registrationStartDate) > new Date(now) &&
                                        <div>Not yet started&nbsp;</div>
                                    }

                                    {item.enrolled &&
                                        <div>Already enrolled</div>
                                    }

                                    {item.maxPartipants <= item.numberOfEnrollments &&
                                        <div>
                                            Maximum participants reached
                                        </div>
                                    }

                                    {item.maxPartipants > item.numberOfEnrollments &&
                                        new Date(item.registrationStartDate) <= new Date(now) &&
                                        !item.enrolled &&
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={(e) => handleClick(item.id, e)}
                                            disabled={disable[item.id]}
                                            >
                                            {disable[item.id] &&
                                                <div>Loading...</div>
                                            }

                                            {!disable[item.id] &&
                                                <div>Enroll</div>
                                            }
                                        </Button>
                                    }

                                    {isAdmin &&
                                        <div>
                                            &nbsp;
                                        <Link to={'/trial/' + item.id}>
                                            <Button variant="contained" color="secondary">
                                                Edit trial
                                            </Button>
                                        </Link>
                                        </div>
                                    }
                                </Grid>
                            </Grid>
                        </Paper>
                    </li>
                ))}
            </ul>
        );
    }
}