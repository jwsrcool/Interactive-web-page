# SalaryApp

SalaryApp is an interactive data visualization based on developer salary data from the **JetBrains Developer Ecosystem Survey 2024**. This app replicates the functionality of the [JetBrains IT Salary Calculator](https://www.jetbrains.com/lp/devecosystem-it-salary-calculator/).

This version was developed in **IntelliJ IDEA**, with help from ChatGPT.

---

## 📌 About this project

SalaryApp allows users to select their primary programming language and country. As soon as both fields are filled, the app immediately displays an estimated salary range. The entire application is built client-side using Angular.

---

## 🚀 Installation & Development

1. Install the dependencies:
   ```bash
   npm install
2. Start the developement server:
    ```bash
   ng serve
3. Open your browser at http://localhost:4200/.
The app will automatically reload when you change any of the source files.

## ✨ Key Features 

✅ Dynamic form with automatic submission as soon as both fields are filled
✅ Overlapping layout of the form and results section
✅ Interactive salary range visualization (chart)
✅ Logic and data closely modeled on the original JetBrains salary calculator

## 🛠️ Building

To build the project for production:

```bash

ng build
```

The build artifacts will be stored in the `dist/` directory.

---

## ✅ Unit Tests

No unit tests have been implemented yet.

---

## ⚡ End-to-End Tests

No end-to-end (e2e) tests have been implemented yet.

---


## 📄 License

This project does not yet include a license.

---

## 📚 Additional Information

- Built with [Angular CLI](https://angular.dev/tools/cli) version 19.2.11
- Inspired by the original [JetBrains Salary Calculator](https://www.jetbrains.com/lp/devecosystem-it-salary-calculator/)
