# C4C Message Board

This project is a message board application built using SvelteKit, a full-stack framework for building web applications. The application allows users to post messages and view messages posted by others.

## High Level Tech-stack Overview:

-   **SvelteKit**: Core framework used for building the application
-   **Vite**: Build tool
-   **Tailwind CSS**: Used for styling the web-app
-   **leo-profanity**: Used for message sanitization
-   **lowdb**: Used for the local database
-   **sveltekit-sse**: Used for server-sent events

## Feature Implementation

-   Users can type messages to the public board.
-   Users can see other users' messages.
-   **Data Persistence**: Messages are persisted to disk and survive server restart.
-   **Real-time updates**: The message board updates in real-time for all users when a new message is posted.
-   **Profanity censorship**: Messages are filtered for profanity.
-   **Lazy-loading**: Only the 10 most recent messages are loaded initially, older messages are loaded as the user scrolls.

## Component Architecture

### Frontend

-   `routes/+page.svelte`: This is the main Message Board component and contains the majority of logic and methods used in the application. It utilizes the `MessageBox` and `MessageList` components for rendering of components. This file handles sending messages, loading messages, and server-sent events.
-   `routes/components/MessageBox.svelte`: This component is responsible for sending and reloading messages. It dispatches custom events to its parent (`+page.svelte`) when a message is sent or when messages need to be reloaded.
-   `routes/components/MessageList.svelte`: This component displays the list of messages. It uses an IntersectionObserver to load more messages (using custom events dispatched to the parent) when the user scrolls to the end of the list.
-   `routes/components/Message.svelte`: This component renders a single message on the message board with its timestamp in readable format.

### Backend

-   `routes/api/send-message/+server.ts`: This server route handles the POST request for sending a message. It sanitizes the message content, checks the length, and then stores the message in the database. It also sends the new message to all connected clients except the sender using server-sent events.
-   `routes/+page.server.ts`: This server route loads the initial set of messages from the database when the page is loaded. It sorts the messages by timestamp and takes the latest 10 messages.
-   `routes/events/+server.ts`: This server route handles the GET request for SSE. It generates a unique user ID for each connection and stores the corresponding emit function in an object.
-   `lib/db.ts`: This file sets up the local database using lowdb.
-   `lib/stores/posts.ts`: This file sets up a Svelte writable store for the posts. The store is updated whenever a new message is sent or received.
-   `db.json`: This file is the local database where the messages are stored. Each message has an ID, content, and timestamp.

## Meeting the Project Requirements

-   **Users can type a message and post it to the message board**: This is implemented in the `MessageBox` component. The `sendMessage` function in `+page.svelte` is triggered when a user submits a message, which is then sent to the server.
-   **The message must be non-empty, and at most 128 characters long**: This is enforced on the front-end in the `MessageBox.svelte` component and in the backend within the `send-message/+server.ts` server route.
-   **Users should be able to see messages on the message board from most to least recent**: This is implemented in the `MessageList` component. The `loadMessages` function in `+page.svelte` loads the messages from the server in descending order of timestamp.
-   **Users on different computers should be able to post to the same board and view each other’s messages**: This is achieved through the backend storage which loads the same data for all users. The `loadMessages` function in `+page.svelte` retrieves the messages from the server, ensuring all users see the same content.

## How to start the application

> NodeJS and npm are required for this project. If not already installed, they can be downloaded and installed from the [official NodeJS website](https://nodejs.org/).

1. **Clone the repository**: Use the following command to clone the repository to your local machine:

```bash
git clone https://github.com/NeagDolph/C4C-Message-Board
```

2. **Install the project dependencies**: Navigate to the project directory and run the following command to install the project dependencies:

```bash
npm install
```

3. **Starting the development server**: Start the development server with the following command:

```bash
npm run dev
```

4. **Building the application**: Build the application with the following command:

```bash
npm run build
```
