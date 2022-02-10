const functions = require("firebase-functions");
const admin = require("firebase-admin");
const syncToOD = require("../services/syncToOD");

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// Name: resync
// Trigger: HTTP Request
// Path: /resync
//
// Querystring params:
// userId - [String] user ID who received the invite
//
// Retry sync user response to OD internal records.
exports.resync = functions.https.onRequest(async (req, res) => {
  const { userId } = req.query;

  if (!userId || userId === "") {
    return res.status(400).send("userId not present");
  }

  const userRef = firestore.doc(`users/${userId}`);

  try {
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      throw new Error("User does not exists");
    }

    const userData = userSnapshot.data();

    await syncToOD(userData.email, userData.rsvp);
    await userRef.set({ rsvp_syncd: true }, { merge: true });
  } catch (error) {
    functions.logger.error("Error sync user's response with OD", error);
    // TODO: Handle error
    // Possible actions:
    // - log the error
    // - retry immediatly
    // - retry after x seconds (2nd try)
    // - retry after x*2 seconds (3rd try)
    return res.status(400).send("An error has ocurred, please try again.");
  }

  res.status(200).send("User's response sync'd successfully to OD");
});
