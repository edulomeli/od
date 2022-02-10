const functions = require("firebase-functions");
const sendInviteEmail = require("../services/sendInviteEmail");

// Name: onUserCreate
// Trigger: onCreate new document in 'users' collection
//
// Sends an invite via email to the new record email address
exports.onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snapshot) => {
    const docRef = snapshot.ref;
    const docData = snapshot.data();

    try {
      await sendInviteEmail(docData.email, docData.id);
      await docRef.set({ invite_sent: true }, { merge: true });
    } catch (error) {
      functions.logger.error("Error sending email", error);
      // TODO: Handle error when sending email.
      // Possible actions:
      // - log the error only
      // - retry immediatly
      // - retry after x seconds (2nd try)
      // - retry after x*2 seconds (3rd try)
    }

    return null;
  });
