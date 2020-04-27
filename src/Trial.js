import React, { useRef } from 'react';
import { useParams } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AuthService from './AuthService';
import { useHistory } from "react-router-dom";

export default function Trial() {
    let { trialId } = useParams();
    const nameInput = useRef(null);
    const startDateInput = useRef(null);
    const endDateInput = useRef(null);
    const registrationStartDateInput = useRef(null);
    const registrationEndDateInput = useRef(null);
    const maxPartipantsInput = useRef(null);
    const priceInEURInput = useRef(null);

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(false);

    const history = useHistory();

    function setDate() {
        return new Date().toISOString().replace('T', ' ').substr(0, 19);
    }

    function handleClick(e) {
        e.preventDefault();

        setIsDisabled(true);

        const result = {
            trialId,
            name: nameInput.current.value,
            startDate: startDateInput.current.value,
            endDate: endDateInput.current.value,
            registrationStartDate: registrationStartDateInput.current.value,
            registrationEndDate: registrationEndDateInput.current.value,
            maxPartipants: maxPartipantsInput.current.value,
            priceInEUR: priceInEURInput.current.value,
        };

        if (trialId) {
            AuthService.updateTrial(result)
                .then(response => response.json())
                .then((response) => {
                    history.push("/trials");
                });
        } else {
            AuthService.createTrial(result)
                .then(response => response.json())
                .then((response) => {
                    history.push("/trials");
                });
        }
    }

    React.useEffect(() => {
        if (trialId) {
            AuthService.getTrial(trialId)
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true);

                        nameInput.current.value = result['name'];
                        startDateInput.current.value = result['startDate'];
                        endDateInput.current.value = result['endDate'];
                        registrationStartDateInput.current.value = result['registrationStartDate'];
                        registrationEndDateInput.current.value = result['registrationEndDate'];
                        maxPartipantsInput.current.value = result['maxPartipants'];
                        priceInEURInput.current.value = result['priceInEUR'];
                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                );
        } else {
            setIsLoaded(true);
        }
    }, [])


    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                {
                    !trialId &&
                    <div><h2>New trial</h2></div>
                }

                {
                    trialId &&
                    <div><h2>Edit trial</h2></div>
                }

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    inputRef={nameInput}
                />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="startDate"
                            label="Start Date"
                            name="startDate"
                            inputRef={startDateInput}
                            value={setDate()}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="endDate"
                            label="End Date"
                            name="endDate"
                            inputRef={endDateInput}
                            value={setDate()}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="registrationStartDate"
                            label="Registration Start Date"
                            name="registrationStartDate"
                            inputRef={registrationStartDateInput}
                            value={setDate()}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="registrationEndDate"
                            label="Registration End Date"
                            name="registrationEndDate"
                            inputRef={registrationEndDateInput}
                            value={setDate()}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="maxPartipants"
                            label="maxPartipants"
                            name="Maximum Participants"
                            inputRef={maxPartipantsInput}
                        />
                    </Grid>

                    <Grid item xs={6} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="priceInEUR"
                            label="priceInEUR"
                            name="Price in EUR"
                            inputRef={priceInEURInput}
                        />
                    </Grid>
                </Grid>

                <br />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    disabled={isDisabled}
                >
                    {!isDisabled &&
                        <span>Save</span>
                    }

                    {isDisabled &&
                        <span>Saving...</span>
                    }
                </Button>
            </div>
        );
    }

}