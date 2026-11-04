import users from './users.json'

const login = (username, password) => {
  cy.get('#loginBtn').click()
  if (username) cy.get('#userName').type(username)
  if (password) cy.get('#password').type(password)
  cy.get('#loginSubmit').click()
}

const loginAsTestUser = () => login(users[0].username, users[0].password)

const column = (i) =>
  cy.get('#booksTableBody tr').then(($rows) => [...$rows].map((r) => r.cells[i].textContent))

const rows = () => cy.get('#booksTableBody tr')

const alertShown = (msg) => cy.get('@alert').should('have.been.calledWith', msg)

const titlesAsc = [
  'Designing Evolvable Web APIs with ASP.NET',
  'Eloquent JavaScript',
  'Git Pocket Guide',
  'Learning JavaScript Design Patterns',
  'Programming JavaScript Applications',
  'Speaking JavaScript',
  'Understanding ECMAScript 6',
  "You Don't Know JS",
]

describe('Bookstore app', () => {
  beforeEach(() => {
    cy.visit('/pages/bookstore.html')
    cy.on('window:alert', cy.stub().as('alert'))
  })

  describe('Initial state and navigation', () => {
    it('opens on the Book Store section', () => {
      cy.get('#bookStoreSection').should('be.visible')
      cy.get('#loginSection').should('not.be.visible')
      cy.get('#profileSection').should('not.be.visible')
      cy.get('#apiSection').should('not.be.visible')
    })

    it('shows only Login, Book Store and API buttons when logged out', () => {
      cy.get('#loginBtn').should('be.visible')
      cy.get('#bookStoreBtn').should('be.visible')
      cy.get('#apiBtn').should('be.visible')
      cy.get('#profileBtn').should('not.be.visible')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('Login button opens the login form', () => {
      cy.get('#loginBtn').click()
      cy.get('#loginSection').should('be.visible')
      cy.get('#bookStoreSection').should('not.be.visible')
      cy.get('#userName').should('have.attr', 'placeholder', 'UserName')
      cy.get('#password').should('have.attr', 'type', 'password')
    })

    it('Book Store button returns to the table', () => {
      cy.get('#loginBtn').click()
      cy.get('#bookStoreBtn').click()
      cy.get('#bookStoreSection').should('be.visible')
      cy.get('#loginSection').should('not.be.visible')
    })

    it('API section lists 9 endpoints', () => {
      cy.get('#apiBtn').click()
      cy.get('#apiSection').should('be.visible')
      cy.get('#apiSection li').should('have.length', 9)
      cy.get('#apiSection').should('contain', 'POST /Account/v1/GenerateToken')
    })

    it('Test API button shows an alert', () => {
      cy.get('#apiBtn').click()
      cy.get('#testApiBtn').click()
      cy.get('@alert').should('have.been.calledWithMatch', /API test functionality/)
    })

    it('New User button shows an alert', () => {
      cy.get('#loginBtn').click()
      cy.get('#newUserBtn').click()
      alertShown('New user registration functionality')
    })
  })

  describe('Login', () => {
    users.forEach(({ username, password }) => {
      it(`logs in as "${username}"`, () => {
        login(username, password)
        alertShown('Login successful!')
        cy.get('#bookStoreSection').should('be.visible')
        cy.get('#logoutBtn').should('be.visible')
        cy.get('#profileBtn').should('be.visible')
        cy.get('#loginBtn').should('not.be.visible')
      })
    })

    it('empty username and password shows a message and stays logged out', () => {
      login('', '')
      alertShown('Please enter username and password')
      cy.get('#loginSection').should('be.visible')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('username without password is rejected', () => {
      login('testuser', '')
      alertShown('Please enter username and password')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('password without username is rejected', () => {
      login('', 'password123')
      alertShown('Please enter username and password')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('Log Out returns to the login form and clears the fields', () => {
      loginAsTestUser()
      cy.get('#logoutBtn').click()
      alertShown('Logged out successfully!')
      cy.get('#loginSection').should('be.visible')
      cy.get('#userName').should('have.value', '')
      cy.get('#password').should('have.value', '')
      cy.get('#loginBtn').should('be.visible')
      cy.get('#logoutBtn').should('not.be.visible')
      cy.get('#profileBtn').should('not.be.visible')
    })
  })

  describe('Book table', () => {
    it('shows all 8 books with the right headers', () => {
      rows().should('have.length', 8)
      cy.get('#booksTable th').then(($th) => {
        expect([...$th].map((th) => th.textContent.replace(/[↑↓]/g, '').trim()))
          .to.deep.eq(['Title', 'Author', 'Publisher', 'Pages'])
      })
    })

    it('first row has the expected data', () => {
      rows().first().within(() => {
        cy.get('td').eq(0).should('have.text', 'Git Pocket Guide')
        cy.get('td').eq(1).should('have.text', 'Richard E. Silverman')
        cy.get('td').eq(2).should('have.text', "O'Reilly Media")
        cy.get('td').eq(3).should('have.text', '234')
      })
    })

    it('shows "Page 1 of 1" with Previous and Next disabled by default', () => {
      cy.get('#pageInfo').should('have.text', 'Page 1 of 1')
      cy.get('#prevPage').should('be.disabled')
      cy.get('#nextPage').should('be.disabled')
    })
  })

  describe('Pagination', () => {
    it('5 rows per page gives 2 pages', () => {
      cy.get('#pageSize').select('5 rows')
      rows().should('have.length', 5)
      cy.get('#pageInfo').should('have.text', 'Page 1 of 2')
      cy.get('#prevPage').should('be.disabled')
      cy.get('#nextPage').should('be.enabled')
    })

    it('Next shows the remaining 3 books on page 2', () => {
      cy.get('#pageSize').select('5 rows')
      cy.get('#nextPage').click()
      rows().should('have.length', 3)
      cy.get('#pageInfo').should('have.text', 'Page 2 of 2')
      cy.get('#nextPage').should('be.disabled')
      cy.get('#prevPage').should('be.enabled')
      cy.get('#booksTableBody').should('contain', 'Eloquent JavaScript')
    })

    it('Previous goes back to page 1', () => {
      cy.get('#pageSize').select('5 rows')
      cy.get('#nextPage').click()
      cy.get('#prevPage').click()
      cy.get('#pageInfo').should('have.text', 'Page 1 of 2')
      rows().should('have.length', 5)
    })

    it('changing rows per page resets to page 1', () => {
      cy.get('#pageSize').select('5 rows')
      cy.get('#nextPage').click()
      cy.get('#pageInfo').should('have.text', 'Page 2 of 2')
      cy.get('#pageSize').select('10 rows')
      cy.get('#pageInfo').should('have.text', 'Page 1 of 1')
      rows().should('have.length', 8)
    })

    it('20 rows per page still shows all 8 books', () => {
      cy.get('#pageSize').select('20 rows')
      rows().should('have.length', 8)
      cy.get('#pageInfo').should('have.text', 'Page 1 of 1')
    })
  })

  describe('Search', () => {
    it('filters by title', () => {
      cy.get('#searchBox').type('javascript')
      rows().should('have.length', 4)
      column(0).should('deep.eq', [
        'Learning JavaScript Design Patterns',
        'Speaking JavaScript',
        'Programming JavaScript Applications',
        'Eloquent JavaScript',
      ])
    })

    it('filters by author', () => {
      cy.get('#searchBox').type('kyle')
      rows().should('have.length', 1).and('contain', "You Don't Know JS")
    })

    it('filters by publisher', () => {
      cy.get('#searchBox').type('no starch')
      rows().should('have.length', 2)
    })

    it('is case-insensitive', () => {
      cy.get('#searchBox').type('GIT')
      rows().should('have.length', 1).and('contain', 'Git Pocket Guide')
    })

    it('handles an apostrophe', () => {
      cy.get('#searchBox').type("o'reilly")
      rows().should('have.length', 6)
    })

    it('shows no rows when nothing matches', () => {
      cy.get('#searchBox').type('zzzz')
      rows().should('have.length', 0)
    })

    it('clearing the search restores every book', () => {
      cy.get('#searchBox').type('kyle')
      cy.get('#searchBox').clear()
      rows().should('have.length', 8)
    })

    it('a new search goes back to page 1', () => {
      cy.get('#pageSize').select('5 rows')
      cy.get('#nextPage').click()
      cy.get('#searchBox').type('javascript')
      cy.get('#pageInfo').should('have.text', 'Page 1 of 1')
      rows().should('have.length', 4)
    })
  })

  describe('Sorting', () => {
    it('Title: ascending on first click', () => {
      cy.get('th[data-column="title"]').click()
      column(0).should('deep.eq', titlesAsc)
      cy.get('th[data-column="title"] .sort-indicator').should('have.text', '↑')
    })

    it('Title: descending on second click', () => {
      cy.get('th[data-column="title"]').click().click()
      column(0).should('deep.eq', [...titlesAsc].reverse())
      cy.get('th[data-column="title"] .sort-indicator').should('have.text', '↓')
    })

    it('Title: third click goes back to ascending', () => {
      cy.get('th[data-column="title"]').click().click().click()
      column(0).should('deep.eq', titlesAsc)
    })

    it('Author: ascending', () => {
      cy.get('th[data-column="author"]').click()
      column(1).should('deep.eq', [
        'Addy Osmani',
        'Axel Rauschmayer',
        'Eric Elliott',
        'Glenn Block, et al.',
        'Kyle Simpson',
        'Marijn Haverbeke',
        'Nicholas C. Zakas',
        'Richard E. Silverman',
      ])
    })

    it('Publisher: No Starch Press comes before the O\'Reilly books', () => {
      cy.get('th[data-column="publisher"]').click()
      rows().eq(0).find('td').eq(2).should('have.text', 'No Starch Press')
      rows().eq(1).find('td').eq(2).should('have.text', 'No Starch Press')
      rows().eq(2).find('td').eq(2).should('have.text', "O'Reilly Media")
    })

    it('only one column shows a sort arrow at a time', () => {
      cy.get('th[data-column="title"]').click()
      cy.get('th[data-column="author"]').click()
      cy.get('th[data-column="title"] .sort-indicator').should('have.text', '')
      cy.get('th[data-column="author"] .sort-indicator').should('have.text', '↑')
    })

    it('Pages column is not sortable', () => {
      cy.contains('th', 'Pages').should('not.have.class', 'sortable').click()
      column(0).should('have.length', 8).and('have.ordered.members', [
        'Git Pocket Guide',
        'Learning JavaScript Design Patterns',
        'Designing Evolvable Web APIs with ASP.NET',
        'Speaking JavaScript',
        "You Don't Know JS",
        'Programming JavaScript Applications',
        'Understanding ECMAScript 6',
        'Eloquent JavaScript',
      ])
    })

    it('sorting returns to page 1', () => {
      cy.get('#pageSize').select('5 rows')
      cy.get('#nextPage').click()
      cy.get('th[data-column="title"]').click()
      cy.get('#pageInfo').should('have.text', 'Page 1 of 2')
    })
  })

  describe('Book collection (adding books)', () => {
    it('anonymous user cannot add a book', () => {
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      alertShown('Please login to add books to your collection')
    })

    it('logged-in user adds a book', () => {
      loginAsTestUser()
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      alertShown('Book added to your collection!')
    })

    it('adding the same book twice is rejected', () => {
      loginAsTestUser()
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      alertShown('Book already in your collection!')
    })
  })

  describe('Profile', () => {
    beforeEach(() => loginAsTestUser())

    it('shows the username and a generated user id', () => {
      cy.get('#profileBtn').click()
      cy.get('#profileSection').should('be.visible')
      cy.get('#usernameDisplay').should('have.text', 'testuser')
      cy.get('#userIdDisplay').invoke('text').should('match', /^user-[a-z0-9]+$/)
    })

    it('starts with an empty collection', () => {
      cy.get('#profileBtn').click()
      cy.get('#userBooks').should('contain', 'No books added to your collection.')
      cy.get('#userBooks .book-item').should('not.exist')
    })

    it('lists the books that were added', () => {
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      cy.contains('.book-title-cell', 'Speaking JavaScript').click()
      cy.get('#profileBtn').click()
      cy.get('#userBooks .book-item').should('have.length', 2)
      cy.get('#userBooks').should('contain', 'Git Pocket Guide').and('contain', 'Speaking JavaScript')
    })

    it('removes one book', () => {
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      cy.contains('.book-title-cell', 'Speaking JavaScript').click()
      cy.get('#profileBtn').click()
      cy.contains('.book-item', 'Git Pocket Guide').contains('button', 'Remove').click()
      alertShown('Book removed from your collection!')
      cy.get('#userBooks .book-item').should('have.length', 1)
      cy.get('#userBooks').should('not.contain', 'Git Pocket Guide')
    })

    it('Delete All Books: cancel keeps the collection', () => {
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      cy.get('#profileBtn').click()
      const confirmStub = cy.stub().returns(false).as('confirm')
      cy.on('window:confirm', confirmStub)
      cy.get('#deleteAllBooks').click()
      cy.get('@confirm').should('have.been.calledWith', 'Are you sure you want to delete all books?')
      cy.get('#userBooks .book-item').should('have.length', 1)
    })

    it('Delete All Books: confirm empties the collection', () => {
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      cy.get('#profileBtn').click()
      cy.on('window:confirm', cy.stub().returns(true))
      cy.get('#deleteAllBooks').click()
      alertShown('All books deleted!')
      cy.get('#userBooks').should('contain', 'No books added to your collection.')
    })

    it('Delete Account: cancel keeps the user logged in', () => {
      cy.get('#profileBtn').click()
      const confirmStub = cy.stub().returns(false).as('confirm')
      cy.on('window:confirm', confirmStub)
      cy.get('#deleteAccount').click()
      cy.get('@confirm').should('have.been.calledWith', 'Are you sure you want to delete your account?')
      cy.get('#profileSection').should('be.visible')
      cy.get('#logoutBtn').should('be.visible')
    })

    it('Delete Account: confirm logs the user out', () => {
      cy.get('#profileBtn').click()
      cy.on('window:confirm', cy.stub().returns(true))
      cy.get('#deleteAccount').click()
      alertShown('Account deleted!')
      cy.get('#loginSection').should('be.visible')
      cy.get('#loginBtn').should('be.visible')
      cy.get('#profileBtn').should('not.be.visible')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('logging out clears the collection', () => {
      cy.contains('.book-title-cell', 'Git Pocket Guide').click()
      cy.get('#logoutBtn').click()
      loginAsTestUser()
      cy.get('#profileBtn').click()
      cy.get('#userBooks').should('contain', 'No books added to your collection.')
    })
  })

  describe('Known bugs (expected to FAIL until the site is fixed)', () => {
    it('BUG: login accepts a WRONG password for a valid user', () => {
      login('testuser', 'wrong-password')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('BUG: login accepts a user that does not exist', () => {
      login('nobody', 'whatever')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('BUG: login accepts a username made only of spaces', () => {
      login('   ', 'password123')
      cy.get('#logoutBtn').should('not.be.visible')
    })

    it('BUG: pressing Enter in the password field does not log in', () => {
      cy.get('#loginBtn').click()
      cy.get('#userName').type('testuser')
      cy.get('#password').type('password123{enter}')
      cy.get('#logoutBtn').should('be.visible')
    })

    it('BUG: a search with no results says "Page 1 of 0"', () => {
      cy.get('#searchBox').type('zzzz')
      cy.get('#pageInfo').should('not.contain', 'of 0')
    })

    it('BUG: search drops the sort order while the arrow is still shown', () => {
      cy.get('th[data-column="title"]').click() // sorted ascending, arrow shown
      cy.get('#searchBox').type('javascript')
      cy.get('th[data-column="title"] .sort-indicator').should('have.text', '↑')
      column(0).should('deep.eq', [
        'Eloquent JavaScript',
        'Learning JavaScript Design Patterns',
        'Programming JavaScript Applications',
        'Speaking JavaScript',
      ])
    })
  })
})