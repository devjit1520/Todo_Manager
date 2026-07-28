# TaskBloom — Modern Todo Application

TaskBloom is a modern and responsive task-management application built with HTML, Tailwind CSS and Vanilla JavaScript.

The application allows users to create, organize, search, edit, reorder and complete daily tasks. Task data and theme preferences are saved in the browser using Local Storage.

## Features

- Add new tasks
- Edit complete task information
- Delete tasks with confirmation
- Mark tasks as completed
- Search by title, category or priority
- Filter all, active, completed and overdue tasks
- Add task categories
- Set low, medium or high priority
- Add optional due dates
- Highlight overdue tasks
- Display task statistics
- Drag-and-drop task sorting
- Dark and light theme
- Theme persistence
- Local Storage persistence
- Toast notifications
- Responsive mobile design
- Custom empty-state illustration
- Modern animated interface

## Technologies

- HTML5
- CSS3
- Tailwind CSS
- Vanilla JavaScript
- ES6 Modules
- Local Storage API
- SortableJS
- ToastifyJS
- Font Awesome
- Google Fonts

## Project Structure

```text
modern-todo-app/
│
├── index.html
├── README.md
│
└── src/
    ├── assets/
    │   ├── empty-state.svg
    │   └── favicon.svg
    │
    ├── css/
    │   └── style.css
    │
    └── js/
        ├── app.js
        ├── dragDrop.js
        ├── storage.js
        ├── theme.js
        ├── toast.js
        ├── ui.js
        └── utils.js
```

## Run Locally

Because this project uses JavaScript modules, run it using the VS Code Live Server extension.

1. Open the project folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

Do not open the HTML file only by double-clicking it because ES6 module imports may be blocked by the browser.

## Local Storage

Tasks are saved with this browser storage key:

```text
taskBloomTasks
```

The selected theme is saved with:

```text
taskBloomTheme
```

## Portfolio Description

TaskBloom is a feature-rich productivity application built with HTML, Tailwind CSS and Vanilla JavaScript. It includes task CRUD operations, priority management, categories, deadline tracking, drag-and-drop sorting, search, filtering, dark mode persistence and Local Storage integration.

## Author

**Devjit Mondal**

- Frontend Developer
- GitHub: devjit1520

## License

This project is available for personal learning and portfolio use.