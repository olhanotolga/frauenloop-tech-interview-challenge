# FrauenLoop Coding Challenge

A fullstack challenge for a mock tech interview @ FrauenLoop.

## Structure

### Branches

- `main`: the original code.
- `solution`: my solution with comments and suggestions

### Folders

- `backend` — Flask app
- `frontend` — React app

## The challenge

### Backend Task

A colleague of yours is working on a proof of concept for a chatbot which receives user messages in JSON format and then sends back a list of responses to these users.
Unfortunately your teammate went on vacation before they could finish their work. They asked you whether you could help them out and finish the prototype for them. As your colleague ran out in a rush they shouted "It's almost done - just the test `test_retrieve_history` is failing for some weird reason".

If you want to run the server use `python bot_prototype.py --port 3000`

- The code which they left: [bot_prototype.py](./backend/bot_prototype.py)
- A file which contains the tests: [test_bot_prototype.py](./backend/test_bot_prototype.py)
- A file which includes the library dependencies for the project: [requirements.txt](./backend/requirements.txt). You can install them via `pip install -r requirements.txt`. Please use Python 3.6 or higher.

#### Part 1: Fix the failing test

As you run `test_retrieve_history` you indeed run into an error 💥

You can either run the test from your IDE or use `pytest test_bot_prototype.py::test_retrieve_history` to run it in your terminal.

- Task 1: Please explain the reason for this error
- Task 2: Adapt the code so that the error no longer happens

#### Part 2: Code review

When working on the code you get the impression that your colleague got a bit sloppy when trying to finish their work in a rush. There are some pieces of code which don't comply with common software engineering best practices. In addition you also discover that `test_retrieve_history` doesn't [cover all branches](https://en.wikipedia.org/wiki/Code_coverage) of `retrieve_conversation_history`.

- Task 1: Please make a list of things which should be improved in the code before putting this project in production (**You don't need to implement these changes!**).
- Task 2: Which part of `retrieve_conversation_history` is not covered by a matching test? Please add the missing test.

### Frontend Task

Now you've created the backend component of your server, a frontend application to interact with it should allow your users to send messages and retrieve their messages.

The initial code is in [the scr directory of the frontend folder](./frontend/src/)

The original task can be found [on Codesandbox:](https://codesandbox.io/s/frauenloop-frontend-task-7vem1). Editing any file there will "fork" the sandbox. Codesandbox allows you to run Javascript code with dependencies directly in your browser without having to install anything locally. You do not have to rely on it if you're more comfortable running things locally.

You can start the Flask server for the backend task using the command `python bot_prototype.py --port 3000`. All HTTP requests to `localhost:3000` in your scripts on Codesandbox will hit this local server.

#### User interface

1. The application should fetch the messages from the backend at the `http://localhost:3000/${userName}/message` endpoint, check out the [fetch API docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for more information. However there are a number of errors in our get request, please ensure that the fetch request in the `[useEffect](https://reactjs.org/docs/hooks-effect.html)` on line 17 fetches the correct information from the backend and updates message history with the correct values.
2. Fix the application so that the input values update when changed, the react docs on [controlled components](https://reactjs.org/docs/forms.html#controlled-components) should help with this.
3. Fix the application so that the `sendMessage` [callback](https://reactjs.org/docs/hooks-reference.html#usecallback) takes the input values and pushes them to the backend at the `http://localhost:3000/${userName}/message` endpoint.
4. Bonus: what improvements to the styling or user experience of the application would you suggest? You do not have to implement these.
