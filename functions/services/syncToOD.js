// Syncs user response to OD internal records.
const syncToOD = (userEmail, userRSVP) => {
  return new Promise((resolve, reject) => {
    // TODO: Implementation of sync user's response to OD internal records
    // via HTTP request (or another) 

    const reqOptions = {
      email: userEmail,
      rsvp: userRSVP,
    };

    // Mock call to external service
    try {
      console.log(reqOptions);
      resolve(true);
    } catch (error) {
      reject();
    }
  });
}

module.exports = syncToOD;
