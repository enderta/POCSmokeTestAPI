const qaAPIURL = Cypress.env('QA_API_URL');
const qaToken = Cypress.env('QA_TOKEN');

describe('QA API Smoke Test', () => {
    const getFutureDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });


    it('/application-process/admins endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/application-process/admins`,
            headers: { Authorization: `Bearer ${qaToken}` },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
        });

    });

    it('/cities endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/cities`,
            headers: { Authorization: `Bearer ${qaToken}` },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('cities');
        });
    });

    it('/cities endpoint without token', () => {
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/cities`,
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('cities');
        });
    });

    it('/regions endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/regions`,
            headers: { Authorization: `Bearer ${qaToken}` },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('regions');
        });
    });

    it('/teams endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/teams`,
            headers: { Authorization: `Bearer ${qaToken}` },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('teams');
        });
    });

    it('/employers endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/employers`,
            headers: { Authorization: `Bearer ${qaToken}` },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('employers');
        });
    });

    it('/stats endpoint', () => {
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/stats`,
            headers: { Authorization: `Bearer ${qaToken}` },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('stats');
        });
    });

    it('/cohorts CRUD', () => {
        const itdStartDate = getFutureDate(40);
        const itdEndDate = getFutureDate(77);
        const registrationEndDate = getFutureDate(30);
        const sdcStartDate = getFutureDate(80);
        const cohortNumber = Math.floor(Math.random() * 10000);
        let cohortID = '';

        // Create a new cohort
        cy.request({
            method: 'POST',
            url: `${qaAPIURL}/cohorts`,
            headers: { Authorization: `Bearer ${qaToken}` },
            body: {
                cohort_number: cohortNumber,
                itd_end_date: itdEndDate,
                itd_registration_end_date: registrationEndDate,
                itd_start_date: itdStartDate,
                region_id: "650097d7efacde5c929c10a9",
                sdc_start_date: sdcStartDate,
            },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('cohort');
            cohortID = response.body.cohort._id;

            // Retrieve the created cohort
            cy.request({
                method: 'GET',
                url: `${qaAPIURL}/cohorts/${cohortID}`,
                headers: { Authorization: `Bearer ${qaToken}` },
            }).then((response) => {
                cy.log(response.body);
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('cohort');

                // Delete the cohort
                cy.request({
                    method: 'DELETE',
                    url: `${qaAPIURL}/cohorts/${cohortID}`,
                    headers: { Authorization: `Bearer ${qaToken}` },
                }).then((response) => {
                    cy.log(response.body);
                    expect(response.status).to.eq(204);
                });
            });
        });
    });

    it('/users CRUD', () => {
        const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
        let userID = '';

        // Create a new user
        cy.request({
            method: 'POST',
            url: `${qaAPIURL}/register`,
            headers: { Authorization: `Bearer ${qaToken}` },
            body: {
                email: email,
            },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('user');
            userID = response.body.user._id;

            // Update the user
            cy.request({
                method: 'PUT',
                url: `${qaAPIURL}/user`,
                headers: { Authorization: `Bearer ${qaToken}` },
                body: {
                    roles: ["VOLUNTEER", "STUDENT", "STAFF"]
                },
            }).then((response) => {
                cy.log(response.body);
                expect(response.status).to.eq(200);

                // Delete the user
                cy.request({
                    method: 'DELETE',
                    url: `${qaAPIURL}/admin/${userID}`,
                    headers: { Authorization: `Bearer ${qaToken}` },
                }).then((response) => {
                    cy.log(response.body);
                    expect(response.status).to.eq(200);
                });
            });
        });
    });

    it('/volunteer CRUD', () => {
        const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
        let volunteerID = '';

        // Retrieve the volunteers
        cy.request({
            method: 'GET',
            url: `${qaAPIURL}/volunteer`,
            headers: { Authorization: `Bearer ${qaToken}` },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('volunteers');
        });

        // Create a volunteer
        cy.request({
            method: 'POST',
            url: `${qaAPIURL}/volunteer`,
            headers: { Authorization: `Bearer ${qaToken}` },
            body: {
                email: email,
            },
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('volunteer');
            volunteerID = response.body.volunteer._id;

            // Delete the volunteer
            cy.request({
                method: 'DELETE',
                url: `${qaAPIURL}/volunteer/${volunteerID}`,
                headers: { Authorization: `Bearer ${qaToken}` },
            }).then((response) => {
                cy.log(response.body);
                expect(response.status).to.eq(201);
            });
        });
    });
});
