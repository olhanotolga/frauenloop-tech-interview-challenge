# Backend task

## Part 2: Code review

### Task 1

Improvements before putting in production:

- [ ] 

### Task 2

In `retrieve_conversation_history`, the case with zero-length history is not covered. That is, when the user sends the GET request to the message route before they create a message (send a POST request to the same route).

Test added at the end of the [bot_prototype.py](./bot_prototype.py) file.
