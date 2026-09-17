import { emailLayout } from "../common/emailLayout.js";


export const restaurantRegisteredTemplate = ({
  ownerName,
  restaurantName,
  email,
}) => {
  return {
    subject:
      "Restaurant Registration Received | Foodie",

    text:
      `Hello ${ownerName}, your restaurant ${restaurantName} ` +
      `has been registered successfully and is pending approval.`,

    html: emailLayout({
      title:
        "Restaurant Registration Received",

      greeting:
        `Hello ${ownerName},`,

      message: `
        Thank you for registering
        <strong>${restaurantName}</strong>
        with Foodie.

        Your registration has been received successfully
        and is currently under review by our team.
      `,

      status:
        "PENDING",

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
          value: "Pending Approval",
        },
      ],

      footerMessage: `
        You don't need to take any action right now.
        We will notify you by email once your
        restaurant has been reviewed.
      `,
    }),
  };
};