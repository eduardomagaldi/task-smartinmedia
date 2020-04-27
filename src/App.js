import React from "react";
import "./App.css";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import Button from '@material-ui/core/Button';
import SignIn from "./SignIn";
import Trials from "./Trials";
import Trial from "./Trial";
import Enrollments from "./Enrollments";
import Container from '@material-ui/core/Container';

export default function App() {
	return (
		<Router>
			<Container maxWidth="sm">
				<nav>
					<ul>
						<li>
							<Link to="/">
								<Button variant="contained" color="primary">
									Home
								</Button>
							</Link>
						</li>
						<li>
							<Link to="/trials">
								<Button variant="contained" color="primary">
									Trials
								</Button>
							</Link>
						</li>
					</ul>
				</nav>

				<Switch>
					<Route path="/trials">
						<h2>Trials</h2>

						<Trials />
					</Route>

					<Route path="/trial/:trialId?">
						<Trial />
					</Route>

					<Route path="/enrollments">
						<h2>Enrollments</h2>

						<Enrollments />
					</Route>

					<Route path="/">
						<SignIn />
					</Route>
				</Switch>
			</Container>
		</Router>
	);
}