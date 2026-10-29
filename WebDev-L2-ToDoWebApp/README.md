# TaskFlow — OASIS INFOBYTE Web Development Level 2, Task 3

**Task:** To-Do Web App  
**Track:** Web Development & Designing  
**Level:** Level 2  
**Author:** Om Kalmegh

TaskFlow is a responsive browser-based task manager built with HTML5, CSS3, and vanilla JavaScript. It helps users create, edit, complete, and delete tasks while keeping pending and completed work in separate lists.

## Features

- Add a task using the input field or Enter key.
- Mark tasks complete; completed tasks appear in the Completed Tasks list.
- Move completed tasks back to pending.
- Edit task text and delete individual tasks.
- Separate Pending Tasks and Completed Tasks lists.
- Live counters for pending, completed, and total tasks.
- Friendly empty states when a list has no tasks.
- Timestamps for when tasks were added and completed.
- Saves tasks in browser `localStorage`, so they remain after refresh.
- Responsive layout for desktop, tablet, and mobile screens.
- Light/dark theme toggle, with the selected theme saved locally.
- Basic input validation and confirmation before deleting tasks.

## Technology stack

- HTML5 — semantic page structure
- CSS3 — responsive layout, CSS Grid/Flexbox, themes, and animations
- Vanilla JavaScript — DOM events, task state, validation, and rendering
- Browser `localStorage` — local persistence (no server or account required)

## Project structure

```text
OIBSIP/
└── WebDev-L2-ToDoWebApp/
    ├── index.html
    ├── style.css
    ├── script.js
    └── README.md
```

## Run locally

1. Download or clone this repository.
2. Open the `WebDev-L2-ToDoWebApp` folder.
3. Open `index.html` in a modern browser.

Recommended: In VS Code, install/use the **Live Server** extension and choose **Open with Live Server** on `index.html`.

No build step, package installation, API key, or backend is required.

## How to use

1. Enter a task in the input field.
2. Select **Add task** or press Enter.
3. Use the check control to mark a task complete or move it back to pending.
4. Select the pencil icon to edit a task.
5. Select the × icon to delete a task after confirming.
6. Use the sidebar to filter All tasks, Pending, or Completed.
7. Select **Clear completed** to remove all completed tasks after confirmation.
8. Use the sun/moon button to change the theme.

## Data and privacy

Tasks and theme preference are stored in this browser's local storage. This is a client-side learning project; it does not sync between devices or users. Clearing the browser's site data may remove saved tasks. Do not use this project to store sensitive information.

## Testing checklist

- [ ] Add a task using the button.
- [ ] Add a task by pressing Enter.
- [ ] Try adding whitespace only; it should not create a task.
- [ ] Confirm a new task appears in Pending Tasks.
- [ ] Mark a pending task complete; it should move to Completed Tasks.
- [ ] Mark a completed task pending again.
- [ ] Edit a task and verify the updated text.
- [ ] Cancel an edit and verify the task stays unchanged.
- [ ] Delete a task and confirm it disappears.
- [ ] Cancel a delete confirmation and verify the task remains.
- [ ] Check pending, completed, and total counters after each operation.
- [ ] Refresh the page and verify tasks persist.
- [ ] Test the All tasks, Pending, and Completed filters.
- [ ] Clear completed tasks and verify pending tasks remain.
- [ ] Switch between light and dark themes; refresh and verify the theme persists.
- [ ] Test at desktop, tablet, and mobile widths; check for horizontal overflow or overlapping controls.
- [ ] Test keyboard navigation and confirm focus outlines are visible.

## Known limitations

- Data is stored only in the current browser and device.
- There is no user login, cloud sync, or multi-device backup.
- Editing and deletion confirmations use the browser's native prompt/confirm dialogs.

## GitHub submission

The OASIS INFOBYTE task guide asks interns to use a single public repository named **`OIBSIP`**, with the folder name pattern `OIBSIP/[TrackName]-[Level/Task]-[ProjectName]/`. This project folder is named `WebDev-L2-ToDoWebApp`.

From the parent directory containing the `OIBSIP` folder:

```bash
git init
git add .
git commit -m "Add Web Development Level 2 To-Do Web App"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/OIBSIP.git
git push -u origin main
```

If the `OIBSIP` repository already exists, clone it first and copy this project folder inside it rather than creating a separate repository. Replace `YOUR-USERNAME` with your GitHub username. Do not commit unrelated secrets or personal data.

## Demo video requirements

Before recording, verify the app works from start to finish. The task guide requires the first 2 seconds to display:
- Full name: **Om Kalmegh**
- Assigned track: **Web Development & Designing**
- Task title: **To-Do Web App**

Then record a short walkthrough showing add, edit, complete, delete, counters, refresh persistence, and mobile responsiveness. Upload the video to LinkedIn, tag Oasis Infobyte, and include `#oasisinfobyte` plus relevant hashtags.

## Credits

Created as an internship learning project for the OASIS INFOBYTE SIP task. Design and source code are provided for learning and customization.
