import { emailLayout } from "../common/emailLayout.js";


export const restaurantRejectedTemplate = ({
  ownerName,
  restaurantName,
  email,
  reason,
}) => {
  return {
    subject:
      "Restaurant Registration Update | Foodie",

    text:
      `${restaurantName} registration was rejected. ` +
      `Reason: ${reason}`,

    html: emailLayout({
      title:
        "Restaurant Registration Update",

      greeting:
        `Hello ${ownerName},`,

      message: `
        We have completed the review of
        <strong>${restaurantName}</strong>.

        Unfortunately, we are unable to approve
        your restaurant registration at this time.
      `,

      status:
        "REJECTED",

      details: [
        {
          label: "Restaurant",
          value: restaurantName,
        },
        {
          label: "Email",
          value: email,
        },
        {
          label: "Status",
          value: "Rejected",
        },
        {
          label: "Reason",
          value: reason,
        },
      ],

      footerMessage: `
        Please review the reason mentioned above.
        You can contact Foodie support if you need
        additional clarification.
      `,
    }),
  };
};