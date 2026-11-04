const openSection = (id) => cy.get(`[data-target="${id}"]`).click()

describe('Elements page', () => {
  beforeEach(() => {
    cy.visit('/pages/elements.html')
  })

  describe('Sidebar navigation', () => {
    const sections = [
      'text-box',
      'check-box',
      'radio-button',
      'web-tables',
      'buttons',
      'links',
      'broken-links',
      'upload-download',
      'dynamic-properties',
    ]

    it('shows Text Box by default', () => {
      cy.get('#text-box').should('be.visible')
      cy.get('#check-box').should('not.be.visible')
    })

    sections.forEach((id) => {
      it(`opens the "${id}" section`, () => {
        openSection(id)
        cy.get(`#${id}`).should('be.visible').and('have.class', 'active')
        cy.get(`[data-target="${id}"]`).should('have.class', 'active')
        // only one section is visible at a time
        cy.get('.section-content.active').should('have.length', 1)
      })
    })
  })

  describe('Text Box', () => {
    it('shows the submitted values', () => {
      cy.get('#full-name').type('Nazmul Hasan')
      cy.get('#email').type('nazmul@example.com')
      cy.get('#current-address').type('Comilla, Bangladesh')
      cy.get('#permanent-address').type('Dhaka, Bangladesh')
      cy.get('#submit').click()

      cy.get('#output').should('be.visible')
      cy.get('#output-name').should('contain', 'Nazmul Hasan')
      cy.get('#output-email').should('contain', 'nazmul@example.com')
      cy.get('#output-currentAddress').should('contain', 'Comilla, Bangladesh')
      cy.get('#output-permanentAddress').should('contain', 'Dhaka, Bangladesh')
    })

    it('shows only the fields that were filled in', () => {
      cy.get('#full-name').type('Only Name')
      cy.get('#submit').click()

      cy.get('#output-name').should('contain', 'Only Name')
      cy.get('#output-email').should('not.exist')
      cy.get('#output-currentAddress').should('not.exist')
      cy.get('#output-permanentAddress').should('not.exist')
    })

    it('does not show output before submit', () => {
      cy.get('#output').should('not.be.visible')
    })

    it('FINDING: renders HTML typed into a field (XSS risk, uses innerHTML)', () => {
      cy.get('#full-name').type('<b>bold</b>')
      cy.get('#submit').click()
      // If the app escaped input, no <b> element would exist here.
      cy.get('#output-name b').should('have.text', 'bold')
    })
  })

  describe('Check Box (tree)', () => {
    beforeEach(() => openSection('check-box'))

    it('selecting Home selects every node', () => {
      cy.get('#home').check()
      cy.get('.tree-checkbox').each(($cb) => {
        expect($cb[0].checked).to.eq(true)
      })
      cy.get('#result').should('contain', 'You have selected')
      cy.get('#result').should('contain', 'Home')
      cy.get('#result').should('contain', 'Excel File.doc')
    })

    it('unchecking Home clears everything', () => {
      cy.get('#home').check()
      cy.get('#home').uncheck()
      cy.get('.tree-checkbox').each(($cb) => {
        expect($cb[0].checked).to.eq(false)
      })
      cy.get('#result').should('be.empty')
    })

    it('selecting one child makes parents indeterminate', () => {
      cy.get('#notes').check()
      cy.get('#desktop').should('have.prop', 'indeterminate', true)
      cy.get('#home').should('have.prop', 'indeterminate', true)
      cy.get('#home').should('not.be.checked')
      cy.get('#result').should('contain', 'Notes')
    })

    it('selecting all children checks the parent', () => {
      cy.get('#notes').check()
      cy.get('#commands').check()
      cy.get('#desktop').should('be.checked')
      cy.get('#desktop').should('have.prop', 'indeterminate', false)
    })

    it('selecting a parent selects only its own children', () => {
      cy.get('#downloads').check()
      cy.get('#wordFile').should('be.checked')
      cy.get('#excelFile').should('be.checked')
      cy.get('#desktop').should('not.be.checked')
      cy.get('#result').should('contain', 'Downloads')
      cy.get('#result').should('not.contain', 'Notes')
    })
  })

  describe('Radio Button', () => {
    beforeEach(() => openSection('radio-button'))

    it('selects Yes', () => {
      cy.get('#yesRadio').check()
      cy.get('#yesRadio').should('be.checked')
      cy.get('#radioResult').should('contain', 'You have selected Yes')
    })

    it('selects Impressive and deselects Yes', () => {
      cy.get('#yesRadio').check()
      cy.get('#impressiveRadio').check()
      cy.get('#impressiveRadio').should('be.checked')
      cy.get('#yesRadio').should('not.be.checked')
      cy.get('#radioResult').should('contain', 'You have selected Impressive')
    })

    it('"No" radio is disabled', () => {
      cy.get('#noRadio').should('be.disabled')
      cy.get('#radioResult').should('be.empty')
    })
  })

  describe('Web Tables', () => {
    const rows = () => cy.get('#tableContainer tbody tr')

    beforeEach(() => openSection('web-tables'))

    it('loads 3 default rows with correct headers', () => {
      rows().should('have.length', 3)
      cy.get('#tableContainer th').then(($th) => {
        const headers = [...$th].map((el) => el.textContent)
        expect(headers).to.deep.eq([
          'First Name', 'Last Name', 'Age', 'Email', 'Salary', 'Department', 'Actions',
        ])
      })
      rows().first().should('contain', 'Cierra').and('contain', 'Insurance')
    })

    it('searches by text', () => {
      cy.get('#searchBox').type('Cierra')
      rows().should('have.length', 1)
      rows().first().should('contain', 'Cierra')
    })

    it('search is case-insensitive and matches any column', () => {
      cy.get('#searchBox').type('legal')
      rows().should('have.length', 1).and('contain', 'Kierra')
    })

    it('shows no rows when nothing matches', () => {
      cy.get('#searchBox').type('zzzzzz')
      rows().should('have.length', 0)
    })

    it('clearing the search restores all rows', () => {
      cy.get('#searchBox').type('Cierra')
      cy.get('#searchBox').clear()
      rows().should('have.length', 3)
    })

    it('Add button toggles the add form', () => {
      cy.get('#addRecordForm').should('not.be.visible')
      cy.get('#add').click()
      cy.get('#addRecordForm').should('be.visible')
      cy.get('#add').click()
      cy.get('#addRecordForm').should('not.be.visible')
    })

    it('adds a new record', () => {
      cy.get('#add').click()
      cy.get('#webtable-first-name').type('Nazmul')
      cy.get('#webtable-last-name').type('Hasan')
      cy.get('#webtable-email').type('nazmul@example.com')
      cy.get('#webtable-age').type('25')
      cy.get('#webtable-salary').type('5000')
      cy.get('#webtable-department').type('QA')
      cy.get('#webtable-submit').click()

      rows().should('have.length', 4)
      rows().last().should('contain', 'Nazmul').and('contain', 'QA')
      cy.get('#addRecordForm').should('not.be.visible')
    })

    it('does not add a record when fields are empty', () => {
      cy.get('#add').click()
      cy.get('#webtable-first-name').type('OnlyFirstName')
      cy.get('#webtable-submit').click()

      rows().should('have.length', 3)
      cy.get('#addRecordForm').should('be.visible')
    })

    it('edits a record', () => {
      rows().first().contains('button', 'Edit').click()

      cy.get('.modal-overlay').should('be.visible')
      cy.get('.modal-overlay h3').should('have.text', 'Edit Record')
      cy.get('.modal-overlay input[name="firstName"]').clear().type('Updated')
      cy.get('.modal-overlay').contains('button', 'Save').click()

      cy.get('.modal-overlay').should('not.exist')
      rows().first().should('contain', 'Updated')
      cy.contains('.alert', 'Record updated successfully!').should('be.visible')
    })

    it('cancel in the edit dialog changes nothing', () => {
      rows().first().contains('button', 'Edit').click()
      cy.get('.modal-overlay input[name="firstName"]').clear().type('Nope')
      cy.get('.modal-overlay').contains('button', 'Cancel').click()

      cy.get('.modal-overlay').should('not.exist')
      rows().first().should('contain', 'Cierra').and('not.contain', 'Nope')
    })

    it('deletes a record after confirmation', () => {
      rows().first().contains('button', 'Delete').click()

      cy.get('.modal-overlay').should('contain', 'Are you sure you want to delete Cierra Vega?')
      cy.get('.modal-overlay').contains('button', 'Delete').click()

      rows().should('have.length', 2)
      cy.contains('#tableContainer', 'Cierra').should('not.exist')
      cy.contains('.alert', 'Record deleted successfully!').should('be.visible')
    })

    it('cancel in the delete dialog keeps the record', () => {
      rows().first().contains('button', 'Delete').click()
      cy.get('.modal-overlay').contains('button', 'Cancel').click()

      rows().should('have.length', 3)
    })
  })

  describe('Buttons', () => {
    beforeEach(() => openSection('buttons'))

    it('double click', () => {
      cy.get('#doubleClickBtn').dblclick()
      cy.get('#doubleClickMessage').should('have.text', 'You have done a double click')
    })

    it('right click', () => {
      cy.get('#rightClickBtn').rightclick()
      cy.get('#rightClickMessage').should('have.text', 'You have done a right click')
    })

    it('single click', () => {
      cy.get('#clickMeBtn').click()
      cy.get('#dynamicClickMessage').should('have.text', 'You have done a dynamic click')
    })

    it('a normal click does not trigger double-click or right-click messages', () => {
      cy.get('#doubleClickBtn').click()
      cy.get('#doubleClickMessage').should('be.empty')
      cy.get('#rightClickMessage').should('be.empty')
    })
  })

  describe('Links', () => {
    beforeEach(() => openSection('links'))

    it('Home link opens a new tab (window.open is called)', () => {
      cy.window().then((win) => cy.stub(win, 'open').as('open'))
      cy.get('#simpleLink').click()
      cy.get('@open').should('have.been.calledOnceWith', 'http://localhost:8081/index.html', '_blank')
    })

    it('Home Dynamic Link opens a new tab (window.open is called)', () => {
      cy.window().then((win) => cy.stub(win, 'open').as('open'))
      cy.get('#dynamicLink').click()
      cy.get('@open').should('have.been.calledOnce')
    })

    const apiLinks = [
      { id: 'created', status: 201, text: 'Created' },
      { id: 'no-content', status: 204, text: 'No Content' },
      { id: 'moved', status: 301, text: 'Moved Permanently' },
      { id: 'bad-request', status: 400, text: 'Bad Request' },
      { id: 'unauthorized', status: 401, text: 'Unauthorized' },
      { id: 'forbidden', status: 403, text: 'Forbidden' },
      { id: 'not-found', status: 404, text: 'Not Found' },
    ]

    apiLinks.forEach(({ id, status, text }) => {
      it(`"${id}" link reports status ${status}`, () => {
        cy.get(`#${id}`).click()
        cy.get('#linkResponse').should('contain', 'Loading...')
        cy.get('#linkResponse').should(
          'contain',
          `Link has responded with staus ${status} and status text ${text}`
        )
      })
    })
  })


  describe('Broken Links - Images', () => {
    beforeEach(() => openSection('broken-links'))

    it('valid image loads', () => {
      cy.get('img[alt="Valid Image"]')
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .and('be.greaterThan', 0)
    })

    it('broken image does not load', () => {
      cy.get('img[alt="Broken Image"]').should('have.prop', 'naturalWidth', 0)
    })

    it('valid link returns 200', () => {
      cy.get('#validLink').then(($a) => {
        cy.request($a.prop('href')).its('status').should('eq', 200)
      })
    })

    it('broken link returns 404', () => {
      cy.get('#brokenLink').then(($a) => {
        cy.request({ url: $a.prop('href'), failOnStatusCode: false })
          .its('status')
          .should('eq', 404)
      })
    })
  })

  describe('Upload and Download', () => {
    beforeEach(() => openSection('upload-download'))

    it('uploads a file', () => {
      cy.get('#upload-file').selectFile({
        contents: Cypress.Buffer.from('hello cypress'),
        fileName: 'test-upload.txt',
        mimeType: 'text/plain',
      })
      cy.get('#uploaded-file-path').should('contain', 'test-upload.txt')
      cy.contains('.alert', 'File uploaded successfully!').should('be.visible')
    })

    it('downloads a file with the expected content', () => {
      cy.get('#downloadButton').click()
      cy.contains('.alert', 'File downloaded successfully!').should('be.visible')
      // Saved to cypress/downloads/ by default
      cy.readFile('cypress/downloads/sampleFile.txt').should('contain', 'This is a sample file')
    })
  })

  describe('Dynamic Properties', () => {
    beforeEach(() => openSection('dynamic-properties'))

    it('generates a random id', () => {
      cy.get('#randomIdValue').invoke('text').should('match', /^id_[a-z0-9]+$/)
    })

    it('generates a different id after reload', () => {
      cy.get('#randomIdValue')
        .invoke('text')
        .then((first) => {
          cy.reload()
          openSection('dynamic-properties')
          cy.get('#randomIdValue').invoke('text').should('not.eq', first)
        })
    })

    it('button is disabled first, enabled after 5 seconds', () => {
      cy.get('#enableAfter').should('be.disabled')
      // default timeout is 4s, so give it more room than the 5s delay
      cy.get('#enableAfter', { timeout: 7000 }).should('be.enabled').and('have.text', 'Now Enabled')
    })

    it('button appears after 5 seconds', () => {
      cy.get('#visibleAfter').should('not.be.visible')
      cy.get('#visibleAfter', { timeout: 7000 }).should('be.visible')
    })

    it('text color class is added after 5 seconds', () => {
      cy.get('#colorChange').should('not.have.class', 'text-danger')
      cy.get('#colorChange', { timeout: 7000 }).should('have.class', 'text-danger')
    })

    it('Color Change button cycles its color on click', () => {
      cy.get('#colorChange').should('have.class', 'btn-primary')
      cy.get('#colorChange').click()
      cy.get('#colorChange').should('have.class', 'btn-success').and('not.have.class', 'btn-primary')
      cy.get('#colorChange').click()
      cy.get('#colorChange').should('have.class', 'btn-danger')
    })
  })
})