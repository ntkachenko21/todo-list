# Todo List

A powerful and user-friendly task manager to help you organize, prioritize, and track your tasks efficiently.

## Features

- **Dashboard Overview**: See statistics for total, completed, pending, and overdue tasks.
- **Task Management**: Create, edit, delete, duplicate, and share tasks.
- **Task Status & Priority**: Visual indicators for task status (completed, overdue, in progress) and priority levels.
- **Progress Tracking**: Animated progress bars to visualize task completion.
- **Task Filtering**: Instantly filter tasks by status (all, pending, completed, overdue).
- **Search Functionality**: Quickly search for tasks using keywords.
- **Tagging System**: Organize tasks with custom tags and view tasks by tag.
- **Activity Timeline**: View the history of actions taken on each task.
- **Responsive Design**: Fully usable on desktop and mobile screens.
- **Accessibility**: Keyboard navigation, high contrast mode, and focus styles for improved usability.

## Technologies Used

- **HTML** & **CSS**: Structured layouts and modern styles, including responsive and accessible design.
- **JavaScript**: Interactive features (task filtering, progress bar animation, quick actions, modals).
- **Font Awesome**: Iconography.
- **Google Fonts (Inter)**: Modern typography.

## Project Structure

```
templates/
  base.html                 # Main layout
  task/
    index.html              # Dashboard
    task-detail.html        # Task details & progress
    tag_list.html           # Tag management
    tasks_by_tag.html       # Tasks filtered by tag

static/
  css/
    task-detail.css         # Styles for task detail page
    styles.css              # General styles
    sidebar.css             # Sidebar styles
  js/
    main.js                 # Main interactions (search, filter, alerts)
    task-detail.js          # Task detail page logic
```

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ntkachenko21/todo-list.git
   ```
2. **Open `index.html` in your browser** or follow your backend setup if integrating with a server.

## Usage

- **Add a new task**: Click the "Add New Task" button on the dashboard.
- **View details**: Click on a task to see detailed progress and actions.
- **Filter & search**: Use filter tabs or the search bar to locate tasks.
- **Manage tags**: Go to the Tag Management page to add or edit tags.

## Accessibility

- Keyboard navigation is supported throughout.
- High contrast mode is available for users with visual impairments.
- Focus styles are implemented for clarity.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project currently does not specify a license.

## Author

Developed by [ntkachenko21](https://github.com/ntkachenko21)
