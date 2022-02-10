# od

VIP invitation management

## Links

- [Demo (Loom)](https://www.loom.com/share/ac1d276dec5d4b43bb675dae00195566)
- [Technical walkthrough 1 (Loom)](https://www.loom.com/share/a243d1349d4245cdb5e2418e29bb966e)
- [Technical walkthrough 2 (Loom)](https://www.loom.com/share/16c3fd2671d04b898e86c615107b2514)
- [App (Retool)](https://odtest.retool.com/embedded/public/3c86258d-e100-41b7-b748-fa908a743a6b)
- [Spec (Notion)](https://odteam.notion.site/odteam/No-Code-Infrastructure-Engineer-Take-Home-Test-0987b15357f941ab80ca79c16b23c9cd)

## Tech Stack

- **No-code:** Retool
  - **Datasource:** Firebase Cloud Firestore
- **Serverless Functions:** Firebase Cloud Functions
  - **Language:** JavaScript

## Firebase Cloud Functions

**Cloud Firestore Triggered**

- `onUserCreate`: Sends an invite via email to the new record email address.
  - Trigger: `onCreate` new document in `users` collection.
- `onUserRSVPUpdate`: Syncs user response to OD internal records.
  - Trigger: `onUpdate` document in `users` collection.

**HTTP Request triggered**

- `rsvp`: Handles the user's response of the invite (click on the email links),
          updates the DB record with the given response.
  - Trigger: HTTP Request
  - Path: `/rsvp`
- `resend`: Re-send the email invite for the given user.
  - Trigger: HTTP Request
  - Path: `/resend`
- `resync`: Retry sync user response to OD internal records.
  - Trigger: HTTP Request
  - Path: `/resync`

## Database Schema

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `string` | User's name |
| `email` | `string` | User's email |
| `invite_sent` | `boolean` | Whether or not the email invite was sent ok |
| `rsvp` | `string` | User's response to the invite. Values: `pending, accepted, declined` |
| `rsvp_at` | `timestamp` | When the user responded to the invite |
| `rsvp_syncd` | `boolean` | Whether or not the user's invite response has been successfully sync'd with OD systems |
| `created_at` | `timestamp` | asWhen the user was created |


## FAQ

**Why did you choose Retool?**

*It's focused on internal tools, it has the necessary components to build a nice UI and
its native integrations can connect directly to datasources and REST/GrahQL APIs.*

**Why did you choose Firebase Cloud Firestore as main database?**

*Because it is a managed database that can auto-scale and requires almost zero setup,
it is NoSQL, so it allows to iterate quickly while developing the solution and the most important
is that it's integrated with Cloud Functions, it can trigger functions based on database events,
such as `onCreate` or `onUpdate`. Another reason is that it has a good web GUI to easy debug/develop.*

**Why did you choose Firebase Cloud Functions as serverless env?**

*The main reason is because its integration with Firestore and also allows to create HTTP-based
functions. The deployment is easy.*

**Is there any trade-off using Firebase Cloud Firestore?**

*The lack of wildcards on the querys forced me to create multiple querys based on the given params.*

## Setup & Config

Setup local firebase environment
```
$ npm install -g firebase-tools
$ firebase login
```

## Deployment

```
$ firebase deploy --only functions
```
