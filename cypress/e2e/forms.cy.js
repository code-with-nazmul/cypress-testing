const submit = () => cy.get('#submit').click()

const fillRequired = (o = {}) => {
  const d = {
    first: 'Nazmul',
    last: 'Hasan',
    email: 'nazmul@example.com',
    mobile: '0123456789',
    gender: '#maleRadio',
    ...o,
  }
  if (d.first) cy.get('#firstName').type(d.first)
  if (d.last) cy.get('#last-name').type(d.last)
  if (d.email) cy.get('#email').type(d.email)
  if (d.mobile) cy.get('#mobile-number').type(d.mobile)
  if (d.gender) cy.get(d.gender).check()
}

const pickDate = (month, year, day) => {
  cy.get('#dateOfBirthInput').click()
  cy.get('.react-datepicker').should('be.visible')
  cy.get('.react-datepicker__month-select').select(month)
  cy.get('.react-datepicker__year-select').select(year)
  cy.contains('.react-datepicker__day', new RegExp(`^${day}$`)).click()
}

const modalRow = (label) =>
  cy.contains('#submissionDetails td', new RegExp(`^${label}$`)).next()

const ignoreAppErrors = () => cy.on('uncaught:exception', () => false)

describe('Forms page - Student Registration', () => {
  beforeEach(() => {
    cy.viewport(1280, 900) 
    cy.visit('/pages/forms.html')
  })

  describe('Page basics', () => {
    it('shows the form with its main fields', () => {
      cy.get('h2').should('contain', 'Student Registration Form')
      cy.get('#firstName').should('have.attr', 'placeholder', 'First Name')
      cy.get('#last-name').should('be.visible')
      cy.get('#email').should('have.attr', 'type', 'email')
      cy.get('#mobile-number').should('have.attr', 'placeholder', '1234567890')
      cy.get('#submit').should('be.visible').and('have.text', 'Submit')
    })

    it('the success modal is hidden at first', () => {
      cy.get('#submissionModal').should('not.have.class', 'show')
    })
  })

  describe('Validation on submit', () => {
    it('empty form shows 3 required-field errors and no modal', () => {
      submit()
      cy.get('.error-message').should('have.length', 3)
      cy.get('#firstName').parent().should('contain', 'First name is required')
      cy.get('#last-name').parent().should('contain', 'Last name is required')
      cy.get('#mobile-number').parent().should('contain', 'Mobile number is required')
      cy.get('#submissionModal').should('not.have.class', 'show')
    })

    it('invalid fields get a red border', () => {
      submit()
      cy.get('#firstName').should('have.class', 'error')
        .and('have.css', 'border-color', 'rgb(220, 53, 69)')
    })

    it('missing last name only', () => {
      fillRequired({ last: '' })
      submit()
      cy.get('.error-message').should('have.length', 1)
      cy.get('#last-name').parent().should('contain', 'Last name is required')
      cy.get('#submissionModal').should('not.have.class', 'show')
    })

    it('missing gender blocks the submit', () => {
      fillRequired({ gender: '' })
      submit()
      cy.get('#submissionModal').should('not.have.class', 'show')
    })

    const badEmails = ['bad', 'a@b', '@example.com', 'name@', 'two words@mail.com']
    badEmails.forEach((email) => {
      it(`rejects invalid email "${email}"`, () => {
        fillRequired({ email })
        submit()
        cy.get('#email').parent().should('contain', 'Please enter a valid email')
        cy.get('#submissionModal').should('not.have.class', 'show')
      })
    })

    const badMobiles = ['123', 'abcdefghij', '12345678901', '12345 6789']
    badMobiles.forEach((mobile) => {
      it(`rejects invalid mobile "${mobile}"`, () => {
        fillRequired({ mobile })
        submit()
        cy.get('#mobile-number').parent()
          .should('contain', 'Please enter a valid 10-digit mobile number')
        cy.get('#submissionModal').should('not.have.class', 'show')
      })
    })

    it('error disappears once the field is corrected', () => {
      submit()
      cy.get('#firstName').parent().should('contain', 'First name is required')
      cy.get('#firstName').type('Nazmul')
      cy.get('#firstName').should('not.have.class', 'error')
      cy.get('#firstName').parent().find('.error-message').should('not.exist')
    })

    it('previous errors are cleared on the next submit', () => {
      submit()
      cy.get('.error-message').should('have.length', 3)
      fillRequired()
      submit()
      cy.get('.error-message').should('not.exist')
      cy.get('#submissionModal').should('have.class', 'show')
    })
  })

  describe('Validation on blur (leaving a field)', () => {
    ;['#firstName', '#last-name', '#mobile-number'].forEach((sel) => {
      it(`${sel} shows "required" after focus then blur`, () => {
        cy.get(sel).focus().blur()
        cy.get(sel).parent().should('contain', 'This field is required')
      })
    })

    it('filled field shows no error on blur', () => {
      cy.get('#firstName').type('Nazmul').blur()
      cy.get('#firstName').parent().find('.error-message').should('not.exist')
    })
  })

  describe('Successful submission', () => {
    it('opens the modal with the entered data (required fields only)', () => {
      fillRequired()
      submit()

      cy.get('#submissionModal').should('have.class', 'show').and('be.visible')
      cy.get('#example-modal-sizes-title-lg').should('have.text', 'Thanks for submitting the form')
      modalRow('Student Name').should('have.text', 'Nazmul Hasan')
      modalRow('Student Email').should('have.text', 'nazmul@example.com')
      modalRow('Gender').should('have.text', 'Male')
      modalRow('Mobile').should('have.text', '0123456789')
    })

    it('submits with every field filled and shows all of it in the modal', () => {
      fillRequired({ gender: '#femaleRadio' })
      pickDate('March', '1998', '15')
      cy.get('#dropdown').select('Option 2')

      cy.get('#subjectsInput').type('ma')
      cy.contains('.suggestion-item', 'Maths').click()
      cy.get('#subjectsInput').type('phy{enter}')

      cy.get('#hobbies-sports').check()
      cy.get('#hobbies-music').check()

      cy.get('#upload-picture').selectFile({
        contents: Cypress.Buffer.from('fake image'),
        fileName: 'pic.png',
        mimeType: 'image/png',
      })

      cy.get('#current-address').type('House 1, Comilla')
      cy.get('#state').select('NCR')
      cy.get('#city').select('Noida')
      cy.get('#termsandconditions').check()
      submit()

      cy.get('#submissionModal').should('have.class', 'show')
      modalRow('Student Name').should('have.text', 'Nazmul Hasan')
      modalRow('Gender').should('have.text', 'Female')
      // the field shows "15 Mar 1998", the modal formats it differently:
      modalRow('Date of Birth').should('have.text', 'March 15, 1998')
      modalRow('Subjects').should('have.text', 'Maths, Physics')
      modalRow('Hobbies').should('have.text', 'Sports, Music')
      modalRow('Picture').should('have.text', 'pic.png')
      modalRow('Address').should('have.text', 'House 1, Comilla')
      modalRow('State and City').should('have.text', 'NCR Noida')
    })

    it('optional fields left empty are not listed in the modal', () => {
      fillRequired()
      submit()
      cy.contains('#submissionDetails td', /^Hobbies$/).should('not.exist')
      cy.contains('#submissionDetails td', /^Subjects$/).should('not.exist')
      cy.contains('#submissionDetails td', /^Picture$/).should('not.exist')
    })

    it('Close hides the modal and resets the form', () => {
      ignoreAppErrors() 
      fillRequired()
      submit()
      cy.get('#closeModal').click()

      cy.get('#submissionModal').should('not.have.class', 'show')
      cy.get('#firstName').should('have.value', '')
      cy.get('#email').should('have.value', '')
      cy.get('#maleRadio').should('not.be.checked')
    })
  })

  describe('Gender radio buttons', () => {
    it('only one can be selected at a time', () => {
      cy.get('#maleRadio').check().should('be.checked')
      cy.get('#femaleRadio').check()
      cy.get('#femaleRadio').should('be.checked')
      cy.get('#maleRadio').should('not.be.checked')
      cy.get('#otherRadio').check()
      cy.get('input[name="gender"]:checked').should('have.length', 1).and('have.value', 'Other')
    })
  })

  describe('Date of birth picker', () => {
    it('the input is read-only', () => {
      cy.get('#dateOfBirthInput').should('have.attr', 'readonly')
    })

    it('opens on click and fills the selected date', () => {
      cy.get('.react-datepicker').should('not.be.visible')
      pickDate('March', '1998', '15')
      cy.get('#dateOfBirthInput').should('have.value', '15 Mar 1998')
      cy.get('.react-datepicker').should('not.be.visible')
    })

    it('picks another month and year', () => {
      pickDate('December', '2005', '1')
      cy.get('#dateOfBirthInput').should('have.value', '1 Dec 2005')
    })

    it('closes when clicking outside', () => {
      cy.get('#dateOfBirthInput').click()
      cy.get('.react-datepicker').should('be.visible')
      cy.get('h2').click()
      cy.get('.react-datepicker').should('not.be.visible')
    })
  })

  describe('Subjects autocomplete', () => {
    it('suggests matching subjects while typing', () => {
      cy.get('#subjectsInput').type('ma')
      cy.get('#subjectsSuggestions').should('be.visible')
      cy.get('.suggestion-item').should('contain', 'Maths')
    })

    it('suggestions are case-insensitive', () => {
      cy.get('#subjectsInput').type('PHYS')
      cy.contains('.suggestion-item', 'Physics').should('be.visible')
    })

    it('shows no suggestions when nothing matches', () => {
      cy.get('#subjectsInput').type('zzzz')
      cy.get('#subjectsSuggestions').should('not.be.visible')
    })

    it('selects a suggestion by click', () => {
      cy.get('#subjectsInput').type('chem')
      cy.contains('.suggestion-item', 'Chemistry').click()
      cy.get('.subject-tag').should('have.length', 1).and('contain', 'Chemistry')
      cy.get('#subjectsInput').should('have.value', '')
      cy.get('#subjectsSuggestions').should('not.be.visible')
    })

    it('selects the first suggestion with Enter', () => {
      cy.get('#subjectsInput').type('eng{enter}')
      cy.get('.subject-tag').should('have.length', 1).and('contain', 'English')
    })

    it('can select several subjects', () => {
      cy.get('#subjectsInput').type('maths{enter}')
      cy.get('#subjectsInput').type('hist{enter}')
      cy.get('.subject-tag').should('have.length', 2)
    })

    it('does not suggest an already selected subject', () => {
      cy.get('#subjectsInput').type('maths{enter}')
      cy.get('#subjectsInput').type('maths')
      cy.get('#subjectsSuggestions').should('not.be.visible')
    })

    it('removes a subject with the x button', () => {
      cy.get('#subjectsInput').type('maths{enter}')
      cy.get('.subject-tag').should('have.length', 1)
      cy.get('.subjects-auto-complete__multi-value__remove').click()
      cy.get('.subject-tag').should('not.exist')
    })

    it('hides suggestions when clicking elsewhere', () => {
      cy.get('#subjectsInput').type('ma')
      cy.get('#subjectsSuggestions').should('be.visible')
      cy.get('h2').click()
      cy.get('#subjectsSuggestions').should('not.be.visible')
    })
  })

  describe('Hobbies checkboxes', () => {
    it('can check and uncheck independently', () => {
      cy.get('#hobbies-sports').check().should('be.checked')
      cy.get('#hobbies-reading').check().should('be.checked')
      cy.get('#hobbies-sports').uncheck().should('not.be.checked')
      cy.get('#hobbies-reading').should('be.checked')
      cy.get('#hobbies-music').should('not.be.checked')
    })
  })

  describe('Dropdowns and state/city dependency', () => {
    const cityValues = () =>
      cy.get('#city option').then(($o) => [...$o].map((o) => o.value))

    it('sample dropdown selects by text and by value', () => {
      cy.get('#dropdown').select('Option 1').should('have.value', 'Option 1')
      cy.get('#dropdown').select('Option 3').should('have.value', 'Option 3')
    })

    it('state dropdown has the expected options', () => {
      cy.get('#state option').then(($o) => {
        expect([...$o].map((o) => o.value)).to.deep.eq(
          ['', 'NCR', 'Uttar Pradesh', 'Haryana', 'Rajasthan']
        )
      })
    })

    const mapping = {
      NCR: ['Delhi', 'Gurgaon', 'Noida'],
      'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
      Haryana: ['Karnal', 'Panipat'],
      Rajasthan: ['Jaipur', 'Jaiselmer'],
    }
    Object.entries(mapping).forEach(([state, cities]) => {
      it(`choosing ${state} lists only its cities`, () => {
        cy.get('#state').select(state)
        cityValues().should('deep.eq', ['', ...cities])
      })
    })

    it('changing the state replaces the city list', () => {
      cy.get('#state').select('NCR')
      cy.get('#city').select('Noida')
      cy.get('#state').select('Haryana')
      cy.get('#city').should('have.value', '')
      cityValues().should('deep.eq', ['', 'Karnal', 'Panipat'])
    })

    it('shows the state options menu when the dropdown gets focus', () => {
      cy.get('#state-options-menu').should('not.be.visible')
      cy.get('#state').focus()
      cy.get('#state-options-menu').should('be.visible').and('contain', 'NCR')
    })
  })

  describe('Add Field button (dynamic elements)', () => {
    it('adds a new text field each time', () => {
      cy.get('#dynamicFields input').should('not.exist')
      cy.get('#addField').click()
      cy.get('#dynamic1').should('be.visible')
      cy.get('#addField').click()
      cy.get('#dynamic2').should('be.visible')
      cy.get('#dynamicFields input').should('have.length', 2)
      cy.get('label[for="dynamic2"]').should('have.text', 'Dynamic Field 2:')
    })

    it('a new field accepts text', () => {
      cy.get('#addField').click()
      cy.get('#dynamic1').type('hello').should('have.value', 'hello')
    })

    it('reveals the hidden helper buttons', () => {
      cy.get('#enableAfter').should('not.be.visible')
      cy.get('#colorChange').should('not.be.visible')
      cy.get('#visibleAfter').should('not.be.visible')
      cy.get('#addField').click()
      cy.get('#enableAfter').should('be.visible')
      cy.get('#colorChange').should('be.visible')
      cy.get('#visibleAfter').should('be.visible')
    })
  })

  describe('Known bugs (expected to FAIL until the site is fixed)', () => {
    it('BUG: email is marked required (*) but an empty email is accepted', () => {
      fillRequired({ email: '' })
      submit()
      cy.get('#email').parent().find('.error-message').should('exist')
      cy.get('#submissionModal').should('not.have.class', 'show')
    })

    it('BUG: missing gender shows no error message to the user', () => {
      fillRequired({ gender: '' })
      submit()
      cy.get('.error-message').should('exist')
    })

    it('BUG: terms and conditions is marked required but never validated', () => {
      fillRequired()
      submit()
      cy.get('#submissionModal').should('not.have.class', 'show')
    })

    it('BUG: clicking Close on the modal throws "updateCityOptions is not defined"', () => {
      fillRequired()
      submit()
      cy.get('#closeModal').click()
    })

    it('BUG: selecting the empty state option throws "stateDuplicate is not defined"', () => {
      cy.get('#state').select('NCR')
      cy.get('#state').select('Select State') 
    })
  })
})