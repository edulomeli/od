const functions = require("firebase-functions");
const syncToOD = require("../services/syncToOD");

// Name: onUserRSVPUpdate
// Trigger: onUpdate document in 'users' collection
//
// Syncs user response to OD internal records.
exports.onUserRSVPUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change) => {
    const newRSVP = change.after.data().rsvp;
    const prevRSVP = change.before.data().rsvp;
    const syncdRSVP = change.before.data().rsvp_syncd;
    const userEmail = change.before.data().email;
    const docRef = change.after.ref;

    if (newRSVP === prevRSVP || syncdRSVP === true) {
      return null;
    }

    try {
      await syncToOD(userEmail, newRSVP);
      await docRef.set({ rsvp_syncd: true }, { merge: true });
    } catch (error) {
      functions.logger.error("Error sync user's response with OD", error);
      // TODO: Handle error
      // Possible actions:
      // - log the error
      // - retry immediatly
      // - retry after x seconds (2nd try)
      // - retry after x*2 seconds (3rd try)
    }

    return null;
  });
