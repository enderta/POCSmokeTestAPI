const qaAPIURL = Cypress.env('QA_API_URL');
const qaToken = Cypress.env('QA_TOKEN');

const endpoints = [
    { path: '/application-process/admins', expectProperty: 'admins' },
    { path: '/cities', expectProperty: 'cities' },
    { path: '/regions', expectProperty: 'regions' },
    { path: '/teams', expectProperty: 'teams' },
    { path: '/employers', expectProperty: 'employers' },
    { path: '/stats', expectProperty: 'stats' },
];

const getFutureDate = days => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

describe('QA API Smoke Test', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    endpoints.forEach(({ path, expectProperty }) => {
        it(`${path} endpoint`, () => {
            cy.request({
                method: 'GET', url: `${qaAPIURL}${path}`, headers: { Authorization: `Bearer ${qaToken}` },
            }).then(response => {
                cy.log(response.body);
                expect(response.status).to.eq(200);
                if (expectProperty) {
                    expect(response.body).to.have.property(expectProperty);
                }
            });
        });
    });

    it('/cities endpoint without token', () => {
        cy.request({
            method: 'GET', url: `${qaAPIURL}/cities`,
        }).then(response => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('cities');
        });
    });

    it('/cohorts CRUD', () => {
        const cohortDetails = {
            cohort_number: Math.floor(Math.random() * 10000),
            itd_end_date: getFutureDate(77),
            itd_registration_end_date: getFutureDate(30),
            itd_start_date: getFutureDate(40),
            region_id: "650097d7efacde5c929c10a9",
            sdc_start_date: getFutureDate(80),
        };

        let cohortID = '';

        cy.request({
            method: 'POST', url: `${qaAPIURL}/cohorts`, headers: { Authorization: `Bearer ${qaToken}` }, body: cohortDetails,
        }).then(response => {
            cohortID = response.body.cohort._id;
            cy.log(response.body);
            expect(response.status).to.eq(201);

            cy.request({
                method: 'GET', url: `${qaAPIURL}/cohorts/${cohortID}`, headers: { Authorization: `Bearer ${qaToken}` },
            }).then(response => {
                expect(response.status).to.eq(200);

                cy.request({
                    method: 'PUT',
                    url: `${qaAPIURL}/cohorts/${cohortID}`,
                    headers: { Authorization: `Bearer ${qaToken}` },
                    body: {
                        itd_registration_end_date: getFutureDate(31),
                        sdc_start_date: getFutureDate(81),
                    },
                }).then(response => expect(response.status).to.eq(200));

                cy.request({
                    method: 'DELETE',
                    url: `${qaAPIURL}/cohorts/${cohortID}`,
                    headers: { Authorization: `Bearer ${qaToken}` },
                }).then(response => expect(response.status).to.eq(204));
            });
        });
    });

    it('/users CRUD', () => {
        const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
        let userID = '';

        cy.request({
            method: 'POST', url: `${qaAPIURL}/register`, headers: { Authorization: `Bearer ${qaToken}` }, body: { email },
        }).then(response => {
            userID = response.body.user._id;
            expect(response.status).to.eq(200);

            cy.request({
                method: 'PUT', url: `${qaAPIURL}/user`, headers: { Authorization: `Bearer ${qaToken}` }, body: { roles: ["VOLUNTEER", "STUDENT", "STAFF"] },
            }).then(response => expect(response.status).to.eq(200));

            cy.request({
                method: 'DELETE', url: `${qaAPIURL}/admin/${userID}`, headers: { Authorization: `Bearer ${qaToken}` },
            }).then(response => expect(response.status).to.eq(200));
        });
    });

    it('/volunteer CRUD', () => {
        const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
        let volunteerID = '';

        cy.request({
            method: 'POST', url: `${qaAPIURL}/volunteer`, headers: { Authorization: `Bearer ${qaToken}` }, body: { email },
        }).then(response => {
            volunteerID = response.body.volunteer._id;
            expect(response.status).to.eq(200);

            cy.request({
                method: 'DELETE',
                url: `${qaAPIURL}/volunteer/${volunteerID}`,
                headers: { Authorization: `Bearer ${qaToken}` },
            }).then(response => expect(response.status).to.eq(201));
        });
    });
});