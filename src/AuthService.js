let authHeaders;
let postHeaders;
let getHeaders;
let putHeaders;

setHeaders();

export default {
    login: (body) => {
        setHeaders();
        const requestOptions = {
            ...postHeaders,
            body: JSON.stringify(body)
        };
        return fetch('http://localhost:3001/login', requestOptions);
    },
    getTrials: (userId) => {
        setHeaders();
        return fetch("http://localhost:3001/api-trials?userId=" + getCookie('userId'), getHeaders);
    },
    getTrial: (trialId) => {
        setHeaders();
        return fetch("http://localhost:3001/api-trials/" + trialId, getHeaders);
    },
    getEnrollments: () => {
        setHeaders();
        return fetch("http://localhost:3001/api-enrollments", getHeaders);
    },
    enroll: (body) => {
        setHeaders();

        body.userId = parseInt(getCookie('userId'), 10);

        const requestOptions = {
            ...postHeaders,
            body: JSON.stringify(body)
        };

        return fetch('http://localhost:3001/api-enrollments', requestOptions);
    },
    isAdmin: () => {
        return getCookie('role') === 'admin';
    },
    updateTrial: (body) => {
        setHeaders();

        const requestOptions = {
            ...putHeaders,
            body: JSON.stringify(body)
        };

        return fetch('http://localhost:3001/api-trials/' + body.trialId, requestOptions);
    },
    updateEnrollment: (body) => {
        setHeaders();

        const requestOptions = {
            ...putHeaders,
            body: JSON.stringify(body)
        };

        return fetch('http://localhost:3001/api-enrollments/' + body.id, requestOptions);
    },
    createTrial: (body) => {
        setHeaders();

        const requestOptions = {
            ...postHeaders,
            body: JSON.stringify(body)
        };

        return fetch('http://localhost:3001/api-trials', requestOptions);
    },
};

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setHeaders() {
    authHeaders = {
        headers: {
            'Authorization': getCookie('token'),
            'Content-Type': 'application/json'
        },
    };

    postHeaders = {
        ...authHeaders,
        method: 'POST',
    };

    putHeaders = {
        ...authHeaders,
        method: 'PUT',
    };

    getHeaders = {
        ...authHeaders
    };
};