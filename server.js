// server.js
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(bodyParser.json())

// Add custom routes before JSON Server router
server.post('/login', (req, res) => {
    const db = router.db;
    const users = db.get('api-users').value();

    const userFound = users.find((user) => {
        return user.email === req.body.email;
    });

    if (userFound && userFound.password === req.body.password) {
        const apiRoleMappings = db.get('api-role-mappings').value();

        const mappingFound = apiRoleMappings.find((mapping) => {
            return mapping.userId === userFound.id;
        });

        const apiRoles = db.get('api-roles').value();

        const roleFound = apiRoles.find((role) => {
            return mappingFound.roleId === role.id;
        });

        res.jsonp({
            token: 'fdsasd98fs98dd98sfudsa9f8nsdffsusfdanu',
            role: roleFound.name,
            userId: userFound.id
        });
    } else {
        res.status(401).json({
            error: "unauthorized"
        });
    }
});

// Add custom routes before JSON Server router
server.get('/api-trials', (req, res) => {
    const db = router.db;
    const trials = db.get('api-trials').value();
    const enrollments = db.get('api-enrollments').value();
    const numberOfEnrollments = {};

    const result = trials.map((trial) => {
        const resultTrial = {...trial};

        enrollments.forEach((enrollment) => {
            if (enrollment.trialId === resultTrial.id) {
                if (numberOfEnrollments[resultTrial.id] === undefined) {
                    numberOfEnrollments[resultTrial.id] = 0;
                }

                if (enrollment.status === 'approved') {
                    numberOfEnrollments[resultTrial.id] += 1;
                }

                if (req.query.userId === enrollment.userId.toString()) {
                    resultTrial.enrolled = true;
                }
            }
        });

        resultTrial.numberOfEnrollments = numberOfEnrollments[resultTrial.id] || 0;

        return resultTrial;
    });

    res.json({
        trials: result,
        now: new Date()
    });
});

server.use((req, res, next) => {
    if (req.headers.authorization === 'fdsasd98fs98dd98sfudsa9f8nsdffsusfdanu') {
        next();
    } else {
        res.status(401).json({
            error: "unauthorized"
        });
    }
});

server.use(router);
server.listen(3001, () => {
    console.log('JSON Server is running')
})