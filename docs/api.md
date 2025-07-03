# Trivial Compute API Reference

## POST /api/start-session/
**Description:** Starts a new game session.

**Request Body:** _none_

**Response:**
```json
{
  "session_id": 1
}
```

## GET /api/get-question/
**Description:** Fetch a random question from the database. If the optional query parameter category is provided, fetch a random question from that category. ex. "http://localhost:8000/api/get-question/?category=Countries"

**Request Body:** _none_

**Response:**
```json
{
  "id": 12,
  "question_text": "What is the capital of France?",
  "question_type": "MC",
  "category": "Geography",
  "options": [
    { "text": "Paris" },
    { "text": "Madrid" },
    { "text": "Berlin" },
    { "text": "Rome" }
  ]
}
```

## POST /api/roll-dice/<player_id>
**Description:** Simulates rolling a 6-sided dice. Calculates the possible moves based on the player's current location.


**Request Body:** _none_

**Response:**
```json
{
  "roll_result": 4,
  "possible_tiles": [6,13,20,30],
}
```

## POST /api/join-session/<session_id>/
**Description:** Adds a player to a session by ID.

**Request Body:**
```json
{
  "name": "Laura"
}
```

**Response:**
```json
{
  "name": "Laura",
  "color": "green"
}
```

## GET /api/session-state/<session_id>/
**Description:** Gets the current game state for a session.

**Request Body:** _none_

**Response:**
```json
{
  "session_id": 5,
  "current_turn": 2,
  "players": [
    {
      "name": "Laura",
      "color": "green",
      "chips": {
        "red": false,
        "blue": false,
        "green": true,
        "yellow": false
      },
      "position": 3
    }
  ]
}

```
## POST /api/award-chip/<player_id>/
**Description:** Awards a chip to a player.

**Request Body:** 
```json
{
  "color": "blue"
}
```

**Response:**
```json
{
  "message": "Laura awarded blue chip."
}

```
## POST /api/update-position/<player_id>/
**Description:** Updates the position of a player on the board.

**Request Body:** 
```json
{
  "position": 7
}
```

**Response:**
```json
{
  "message": "Laura's position updated to 7."
}

```
## 
**Description:** 

**Request Body:** _none_

**Response:**
```json

```
## 
**Description:** 

**Request Body:** _none_

**Response:**
```json

```
## 
**Description:** 

**Request Body:** _none_

**Response:**
```json

```
