const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase services
admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// Name: rsvp
// Trigger: HTTP Request
// Path: /rsvp
//
// Querystring params:
// userId - [String] user ID who received the invite
// response - [String] user's response, one of {accepted, declined}
//
// Handles the user's response of the invite (click on the email links),
// updates the DB record with the given response
exports.rsvp = functions.https.onRequest(async (req, res) => {
  const { userId, response } = req.query;

  if (!userId || userId === "") {
    return res.status(400).send("userId not present");
  }

  if (!response || (response !== "accepted" && response !== "declined")) {
    return res.status(400).send("Invalid response");
  }

  const userRef = firestore.doc(`users/${userId}`);

  try {
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      throw new Error("User does not exists");
    }

    const userData = userSnapshot.data();

    if (userData.rsvp === "accepted" || userData.rsvp === "declined") {
      return res.status(200).send(`Your have already responded to the invite (${userData.rsvp})`);
    }

    await userRef.set({
      rsvp: response,
      rsvp_at: admin.firestore.Timestamp.now(),
    }, {
      merge: true,
    });
  } catch (error) {
    functions.logger.error(error);
    return res.status(400).send("An error has ocurred, please try again.");
  }

  res.status(200).send(`Your response: ${response} was recorded successfully.`);
});
