# 🚀 Free Test Automation Practice Site

A comprehensive **free test automation practice platform** designed for QA engineers, automation testers, and anyone learning web testing with Selenium, Cypress, Playwright, and other automation tools.

## 🌟 Features

### 📝 Elements Practice
- Text boxes and input fields
- Checkboxes and radio buttons
- Web tables with sorting and pagination
- Buttons and links
- Broken links detection
- File upload and download functionality

### 📋 Forms Testing
- Practice forms with various input types
- Form validation scenarios
- Multi-step form workflows

### 🪟 Alerts, Frames & Windows
- Browser window handling
- JavaScript alerts (simple, confirm, prompt)
- iFrames and nested frames
- Modal dialogs
- Window switching scenarios

### 🎛️ Widgets
- Accordions and collapsible content
- Auto-complete functionality
- Date pickers and calendars
- Sliders and progress bars
- Tabs and navigation
- Tooltips and menus

### 🤝 Interactions
- Drag and drop operations
- Sortable lists
- Selectable elements
- Resizable components
- Interactive UI elements

### 📚 Book Store Application
- User authentication system
- Book catalog with search and filtering
- User profile management
- API testing endpoints
- **Test Credentials:**
  - Username: `testuser` | Password: `password123`
  - Username: `admin` | Password: `admin123`

## 🚀 Quick Start

### Prerequisites
- Python 3.x (for local server)
- Web browser
- Your favorite automation testing tool (Selenium, Cypress, Playwright, etc.)

### Running Locally

1. **Clone or download** this repository
2. **Navigate** to the project directory
3. **Start a local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have it installed)
   npx serve .
   
   # Using PHP (if you have it installed)
   php -S localhost:8000
   ```
4. **Open your browser** and go to `http://localhost:8000`

## 📁 Project Structure

```
qa-mockup/
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript functionality
│   ├── alerts.js          # Alert handling scripts
│   ├── elements.js        # Element interaction scripts
│   └── forms.js           # Form handling scripts
├── pages/
│   ├── elements.html      # Elements practice page
│   ├── forms.html         # Forms practice page
│   ├── alerts.html        # Alerts and windows page
│   ├── widgets.html       # Widgets practice page
│   ├── interactions.html  # Interactions practice page
│   ├── bookstore.html     # Book store application
│   └── ...               # Additional practice pages
├── images/                # Image assets
├── index.html            # Main homepage
├── sitemap.xml           # SEO sitemap
├── robots.txt            # Search engine guidance
└── README.md             # This file
```

## 🎯 Perfect for Testing

### Selenium WebDriver
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("http://localhost:8000")

# Example: Click on Elements card
elements_card = driver.find_element(By.ID, "elements")
elements_card.click()
```

### Cypress
```javascript
describe('QA Practice Site', () => {
  it('should navigate to elements page', () => {
    cy.visit('http://localhost:8000')
    cy.get('#elements').click()
    cy.url().should('include', '/elements.html')
  })
})
```

### Playwright
```javascript
const { test, expect } = require('@playwright/test');

test('navigate to forms page', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await page.click('#forms');
  await expect(page).toHaveURL(/.*forms.html/);
});
```

## 🎨 Features & UI Elements

### Interactive Components
- **Responsive Grid Layout**: Cards automatically adjust to screen size
- **Hover Effects**: Smooth animations and visual feedback
- **Modern Design**: Clean, professional interface
- **Accessibility**: Proper ARIA labels and semantic HTML

### Testing Scenarios
- **Form Validation**: Test various input validation scenarios
- **Dynamic Content**: Practice with dynamically loaded elements
- **Error Handling**: Test error states and edge cases
- **User Workflows**: Complete user journey testing

## 🛠️ Customization

### Adding New Test Pages
1. Create a new HTML file in the `pages/` directory
2. Follow the existing page structure
3. Add navigation links in `index.html`

### Styling
- Main styles are in `css/style.css`
- Uses CSS Grid and Flexbox for responsive layout
- CSS custom properties for easy theming

## 🤝 Contributing

This is a practice site for the testing community! Feel free to:
- Add new testing scenarios
- Improve existing functionality
- Enhance the UI/UX
- Add more complex test cases
- Submit bug reports or feature requests

## 📚 Learning Resources

### Recommended for Beginners
- **Selenium Documentation**: [selenium.dev](https://selenium.dev)
- **Cypress Guides**: [cypress.io](https://cypress.io)
- **Playwright Docs**: [playwright.dev](https://playwright.dev)

### Advanced Testing Concepts
- Page Object Model (POM)
- Data-driven testing
- Cross-browser testing
- API testing integration
- CI/CD pipeline integration

## 🔧 Troubleshooting

### Common Issues

**Server not starting?**
- Ensure Python is installed: `python --version`
- Try a different port: `python -m http.server 3000`
- Check if port 8000 is already in use

**Elements not loading?**
- Clear browser cache
- Check browser console for JavaScript errors
- Ensure all files are in the correct directory structure

**Automation scripts failing?**
- Verify the correct URL (http://localhost:8000)
- Check element selectors and IDs
- Ensure proper wait conditions

## 📄 License

This project is open source and available for educational and testing purposes. Feel free to use, modify, and distribute.

## 👨‍💻 Developer

**Developed by [Rahul Kar](https://www.rahulkar.com/)**

---

### 🌟 Star this repository if it helps you with your automation testing journey!

**Keywords**: test automation, selenium practice, free testing site, qa automation, cypress testing, playwright practice, automation training, selenium tutorial, web testing, ui automation