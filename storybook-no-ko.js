// / <reference types="cypress" />
Cypress.on('uncaught:exception', () => false);

const getIframeBody = selector =>
    cy
        .get(selector)
        .its('0.contentDocument.body')
        .then(cy.wrap);


describe('Storybook testing', () => {
    it('Visits all stories then assert all are generated', () => {
        const tests = [];
        cy.visit('')
            .get('button[data-ref-id="storybook_internal"][aria-expanded="false"]', {timeout: 50000})
            .each($item => {
                cy
                    .get($item)
                    .click();
            })
            .then(() => {
                getIframeBody('iframe')
                    .get('a[data-nodetype="story"]', {timeout: 5000})
                    .each($item => {
                        cy
                            .get($item)
                            .click()
                            .wait(50)
                            .then(() => {
                                getIframeBody('iframe')
                                    .find('#root')
                                    .invoke('html')
                                    .then(html => {
                                        cy.location().its('href')
                                            .then(itsUrl => {
                                                const url = itsUrl.split('?path=/')[1];
                                                tests.push({url, html});
                                            });
                                    });
                            });
                    });
            })
            .then(() => {
                cy.get(tests).should(() => {
                    const resultWithError = tests.filter(test => {
                        cy.log(test.url);
                        return test.html === '';
                    });
                    cy.log(resultWithError);
                    Cypress.log(resultWithError);
                    expect(resultWithError).to.have.lengthOf(0);
                });
            });
    });
});
