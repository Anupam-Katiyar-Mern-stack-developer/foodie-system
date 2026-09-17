import { emailLayout } from "../common/emailLayout.js";


export const restaurantApprovedTemplate = ({
  ownerName,
  restaurantName,
  email,
}) => {
  return {
    subject:
      "Restaurant Approved | Foodie",

    text:
      `Congratulations ${ownerName}. ` +
      `${restaurantName} has been approved successfully.`,

    html: emailLayout({
      title:
        "Restaurant Approved 🎉",

      greeting:
        `Hello ${ownerName},`,

      message: `
        Great news!

        Your restaurant
        <strong>${restaurantName}</strong>
        has been approved by the Foodie team.

        You can now login to your restaurant dashboard
        and continue setting up your restaurant.
      `,

      status:
        "APPROVED",

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
          value: "Approved",
        },
      ],

      buttonText:
        "Login to Restaurant Dashboard",

      buttonUrl:
        `${process.env.FRONTEND_URL}/restaurant/login`,

      footerMessage: `
        You can now manage your profile,
        categories, menu items and restaurant availability.
      `,
    }),
  };
};