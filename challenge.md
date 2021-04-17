# FrauenLoop — Coding Challenge

## Backend Task

A colleague of yours is working on a proof of concept for a chatbot which receives user messages in JSON format and then sends back a list of responses to these users.
Unfortunately your teammate went on vacation before they could finish their work. They asked you whether you could help them out and finish the prototype for them. As your colleague ran out in a rush they shouted "It's almost done - just the test `test_retrieve_history` is failing for some weird reason".

If you want to run the server use `python bot_prototype.py --port 3000`

This is the code which they left:

```python
import argparse
from collections import defaultdict
from contextlib import contextmanager
from typing import Text, Dict, List, Generator
import math
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

inmemory_storage = defaultdict(list)

class Conversation(object):
    def __init__(
        self, conversation_id: Text, old_conversation_events: List[Dict]
    ) -> None:
        """Creates a conversation.

        Args:
            old_conversation_events: Events which happened earlier in this conversation.
        """
        self.conversation_id = conversation_id
        self.conversation_events = old_conversation_events
        self.number_old_events = len(old_conversation_events)

    def addd_user_message(self, message: Text) -> None:
        self.conversation_events.append({"type": "user", "message": message})

    def add_bot_message(self, bot_messages: Text) -> None:
        self.conversation_events.append({"type": "bot", "message": bot_messages})

    def new_events_dict(self) -> List[Dict]:
        return self.conversation_events[self.number_old_events :]

@contextmanager
def conversationPersistence(
    conversation_id: Text,
) -> Generator[Conversation, None, None]:
    """Provides conversation history for a certain conversation.

    Saves any new events to the conversation storage when the context manager is exited.

    Args:
        conversation_id: The ID of the conversation. This is usually the same as the
            username.

    Returns:
        Conversation from the conversation storage.
    """
    old_conversation_events = inmemory_storage[conversation_id]
    # if old_conversation_events is None:
    #     old_conversation_events = []
    conversation = Conversation(conversation_id, old_conversation_events)

    yield conversation

    inmemory_storage[conversation_id] += conversation.new_events_dict()

class ChuckNorrisBot:
    def handle_message(self, message_text: Text, conversation: Conversation) -> None:
        conversation.addd_user_message(message_text)

        if len(conversation.conversation_events) <= 1:
            conversation.add_bot_message(f"Welcome! Let me tell you a joke.")

        joke = self.retrieve_joke()
        conversation.add_bot_message(joke)

    def retrieve_joke(self) -> Text:
        response = requests.get("https://api.chucknorris.io/jokes/random")

        return response.json()["value"]

@app.route("/user/<username>/message", methods=["POST"])
def handle_user_message(username: Text) -> Text:
    """Returns a bot response for an incoming user message.

    Args:
        username: The username which serves as unique conversation ID.

    Returns:
        The bot's responses.
    """
    message_text = request.json["text"]

    f = ChuckNorrisBot()

    with conversationPersistence(username) as conversation:
        f.handle_message(message_text, conversation)

        bot_responses = [
            x["message"] for x in conversation.new_events_dict() if x["type"] == "bot"
        ]

        return jsonify(bot_responses)

@app.route("/user/<username>/message", methods=["GET"])
def retrieve_conversation_history(username: Text) -> Text:
    """Returns all conversation events for a user's conversation.

    Args:
        username: The username which serves as unique conversation ID.

    Returns:
        All events in this conversation, which includes user and bot messages.
    """
    history = inmemory_storage[username]
    if history:
        return jsonify(history)
    else:
        return jsonify(history), 404

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run model server.")
    parser.add_argument(
        "--port",
        default=3000,
        type=int,
        help="The port which the server is running on.",
    )
    args = parser.parse_args()

    print("Serveris running")
    app.run(debug=True)
```

Together with a file which contains the tests:

```python
import pytest
from flask.testing import FlaskClient

import bot_prototype

@pytest.fixture
def client() -> FlaskClient:
    """Returns a client which can be used to test the HTTP API."""
    bot_prototype.app.config["TESTING"] = True

    with bot_prototype.app.test_client() as client:
        yield client

def test_send_message(client: FlaskClient):
    response = client.post("/user/test/message", json={"text": "Hello"})

    assert response.status_code == 200
    response_body = response.json

    assert len(response_body) == 2
    assert response_body[0] == "Welcome! Let me tell you a joke."

def test_retrieve_history(client: FlaskClient):
    client.post("/user/test_retrieve/message", json={"text": "Hello"})

    response = client.get("/user/test_retrieve/message")
    assert response.status_code == 200
    history = response.json

    assert len(history) == 3

    assert history[0] == {"message": "Hello", "type": "user"}
    assert history[1] == {"message": "Welcome! Let me tell you a joke.", "type": "bot"}
    assert history[2]["type"] == "bot"
```

The third and last file includes the library dependencies for the project. You can install them via `pip install -r requirements.txt` . Please use Python 3.6 or higher.

```python
flask==1.1.2
requests==2.25.1
pytest==5.4.3
```

### Part 1: Fix the failing test

As you run `test_retrieve_history` you indeed run into an error 💥

You can either run the test from your IDE or use `pytest test_bot_prototype.py::test_retrieve_history` to run it in your terminal.

- Task 1: Please explain the reason for this error
- Task 2: Adapt the code so that the error no longer happens

### Part 2: Code review

When working on the code you get the impression that your colleague got a bit sloppy when trying to finish their work in a rush. There are some pieces of code which don't comply with common software engineering best practices. In addition you also discover that `test_retrieve_history` doesn't [cover all branches](https://en.wikipedia.org/wiki/Code_coverage) of `retrieve_conversation_history`. 

- Task 1: Please make a list of things which should be improved in the code before putting this project in production (**You don't need to implement these changes!**).
- Task 2: Which part of `retrieve_conversation_history` is not covered by a matching test? Please add the missing test.

## Frontend Task

Now you've created the backend component of your server, a frontend application to interact with it should allow your users to send messages and retrieve their messages.

For this part, you can implement your solution directly in Codesandbox here: [https://codesandbox.io/s/frauenloop-frontend-task-7vem1](https://codesandbox.io/s/frauenloop-frontend-task-7vem1). Editing any file there will "fork" the sandbox. Codesandbox allows you to run Javascript code with dependencies directly in your browser without having to install anything locally. You do not have to rely on it if you're more comfortable running things locally.

You can start the Flask server for the backend task using the command `python bot_prototype.py --port 3000`. All HTTP requests to `localhost:3000` in your scripts on Codesandbox will hit this local server.

### User interface

1. The application should fetch the messages from the backend at the `http://localhost:3000/${userName}/message` endpoint, check out the [fetch API docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for more information. However there are a number of errors in our get request, please ensure that the fetch request in the `[useEffect](https://reactjs.org/docs/hooks-effect.html)` on line 17 fetches the correct information from the backend and updates message history with the correct values.
2. Fix the application so that the input values update when changed, the react docs on [controlled components](https://reactjs.org/docs/forms.html#controlled-components) should help with this.[https://codesandbox.io/s/frauenloop-frontend-task-7vem1](https://codesandbox.io/s/frauenloop-frontend-task-7vem1)
3. Fix the application so that the `sendMessage` [callback](https://reactjs.org/docs/hooks-reference.html#usecallback) takes the input values and pushes them to the backend at the `http://localhost:3000/${userName}/message` endpoint.
4. Bonus: what improvements to the styling or user experience of the application would you suggest? You do not have to implement these.