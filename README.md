# Readme Kanban Board

## An example of how the application works

In your **README.md**, simply have a commented section like this, in the format:

    <!---KANBAN
    # Backlog
    - Implement adding and removing users

    # Ready
    - Link tickets to a specific user

    # In progress
    -

    # Finished
    - Add users and implement their roles, display a kanban board with tasks
    - Implement the layout according to the layout
    - Drag and drop from column to column using the drop-down list
    - Drag and drop from column to column using the drag&drop function
    KANBAN--->

Which generates:

![created by readme-kanban-board](./img/ExampleCanbanBoard.png)

<p align="center"><img src="./img/ScreenityCanban.gif" width="80%"></p>

## Usage

Add it to package.json scripts, similar to:

     "scripts": {
        "start": "webpack serve --mode development --open",
        "build": "webpack --mode production"
     }

Then fire it up by running:

    npm run build
    npm run start

## Data for logging into your personal account

User:
    login: 'Vasya',
    password: 'qwerty123'

Admin:
    login: 'admin',
    password: '123'



