import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import AuthService from './AuthService';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    let [error, setError] = useState(false);
    const history = useHistory();

    function handleClick(e) {
        e.preventDefault();

        AuthService.login({
            email: emailInput.current.value,
            password: passwordInput.current.value
        })
            .then(response => response.json())
            .then((response) => {
                if (response.error) {
                    setError(true);
                } else if (response.token) {
                    setError(false);
                    document.cookie = "token=" + response.token;
                    document.cookie = "userId=" + response.userId;
                    document.cookie = "role=" + response.role;
                    history.push("/trials");
                }
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign in
            	</Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        inputRef={emailInput}
                        autoComplete="email"
                        error={error}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        inputRef={passwordInput}
                        autoComplete="current-password"
                        error={error}
                        helperText={error ? 'Wrong email or password.' : ' '}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleClick}
                        >
                        Sign In
                    </Button>

                </form>
            </div>
        </Container>
    );
}