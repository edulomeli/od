const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sendInviteEmail = require("../services/sendInviteEmail");

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// Name: resend
// Trigger: HTTP Request
// Path: /resend
//
// Querystring params:
// userId - [String] user ID who received the invite
//
// Re-send the email invite for the given user
exports.resend = functions.https.onRequest(async (req, res) => {
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

    await sendInviteEmail(userData.email, userData.id);
    await userRef.set({ invite_sent: true }, { merge: true });
  } catch (error) {
    functions.logger.error("Error sending email", error);
    // TODO: Handle error when sending email.
    // Possible actions:
    // - log the error only
    // - retry immediatly
    // - retry after x seconds (2nd try)
    // - retry after x*2 seconds (3rd try)
    return res.status(400).send("An error has ocurred, please try again.");
  }

  res.status(200).send("Invite sent successfully");
});
