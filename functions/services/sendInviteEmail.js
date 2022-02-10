const BASE_URL = "https://us-central1-odtest-719a3.cloudfunctions.net/rsvp";

// Sends an invite via email using external service, creates email body text
// with links to ACCEPT_URL and DECLINE_URL.
const sendInviteEmail = (emailTo, userId) => {
  return new Promise((resolve, reject) => {
    const accept_url = `${BASE_URL}?userId=${userId}&response=accepted`;
    const decline_url = `${BASE_URL}?userId=${userId}&response=declined`;

    // TODO: Implementation for sending email (via 3rd-party service)

    const mailOptions = {
      to: emailTo,
      subject: "Your invite to ODTest",
      text: `Accept: ${accept_url} \n Decline: ${decline_url}`,
    };

    // Mock call to external service
    try {
      console.log(mailOptions);
      resolve(true);
    } catch (error) {
      reject();
    }
  });
}

module.exports = sendInviteEmail;
