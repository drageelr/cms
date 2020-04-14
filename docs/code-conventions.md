# CCA Management System - Code Conventions

### General JavaScript:
* No semicolons for consistency
* Lower camel case for variables and functions e.g. `dataStore` and uppercase with _ for constants e.g. `FUEL_COST`
* Spaces around binary operators e.g. `x = y + z` and after commas e.g. `values = ['A', 'B', 'C']`
* Tabs for indenting code blocks {}, will not cause issues as VS Code will be used as default.
* General object declaration format (trailing commas are now appropriate so recommended):
    
        var person = {
          firstName: "Bill",
          lastName: "Gates",
          age: 50,
          eyeColor: "blue",
        };
* All file names should be lower case with - instead of spaces e.g. `cms-logo.png`. Don't start or end your file name with a space, period, hyphen, or underline.

### React / Redux:
* Functional Components only with the default function keyword (not anonymous). Only helper functions / functional expressions can be anonymous.
* Should be named in the upper camel case (pascal case) e.g. `App`
* Each component should have a separate .js file and if it has multiple alternatives, all alternatives inside a folder grouping them.
* Use .connect for mapping state to props and dispatching props to connect with the Redux store as high priority, but React hooks can be used as well where convenient.
* Export default the core functional component in that js file e.g. `export default function App() {...}` inside `App.js`
* All action creator JS files must be inside the `actions` folder and all reducer JS files inside the `reducers` folder with the **same names**.
* The component JS file name must match the default functional component's name inside it, and be placed inside the `components` folder.
