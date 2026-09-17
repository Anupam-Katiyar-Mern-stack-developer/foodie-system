const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};


export const emailLayout = ({
  title,
  greeting,
  message,
  status,
  details = [],
  buttonText,
  buttonUrl,
  footerMessage,
}) => {
  const detailsHtml = details
    .map(
      ({ label, value }) => `
        <tr>
          <td
            style="
              padding:10px 0;
              color:#6b7280;
              font-size:14px;
            "
          >
            ${escapeHtml(label)}
          </td>

          <td
            style="
              padding:10px 0;
              color:#111827;
              font-size:14px;
              font-weight:600;
              text-align:right;
            "
          >
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");


  return `
    <!DOCTYPE html>

    <html>

      <body
        style="
          margin:0;
          padding:0;
          background:#f3f4f6;
          font-family:Arial, Helvetica, sans-serif;
        "
      >

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            padding:35px 15px;
          "
        >

          <tr>

            <td align="center">


              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width:600px;
                  background:#ffffff;
                  border-radius:14px;
                  overflow:hidden;
                  border:1px solid #e5e7eb;
                "
              >


                <!-- HEADER -->

                <tr>

                  <td
                    style="
                      background:#111827;
                      padding:28px;
                      text-align:center;
                    "
                  >

                    <h1
                      style="
                        margin:0;
                        color:#ffffff;
                        font-size:30px;
                      "
                    >
                      Foodie
                    </h1>


                    <p
                      style="
                        margin:7px 0 0;
                        color:#d1d5db;
                        font-size:13px;
                      "
                    >
                      Food Delivery Platform
                    </p>

                  </td>

                </tr>



                <!-- CONTENT -->

                <tr>

                  <td
                    style="
                      padding:35px;
                    "
                  >

                    <h2
                      style="
                        margin:0 0 20px;
                        color:#111827;
                        font-size:23px;
                      "
                    >
                      ${escapeHtml(title)}
                    </h2>


                    <p
                      style="
                        color:#374151;
                        font-size:15px;
                      "
                    >
                      ${escapeHtml(greeting)}
                    </p>


                    <p
                      style="
                        color:#4b5563;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      ${message}
                    </p>


                    ${
                      status
                        ? `
                          <div
                            style="
                              margin:25px 0;
                              padding:13px;
                              background:#f3f4f6;
                              border-radius:8px;
                              text-align:center;
                              color:#111827;
                              font-weight:700;
                            "
                          >
                            Status: ${escapeHtml(status)}
                          </div>
                        `
                        : ""
                    }


                    ${
                      details.length
                        ? `
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              margin:25px 0;
                              border-top:1px solid #e5e7eb;
                              border-bottom:1px solid #e5e7eb;
                              padding:10px 0;
                            "
                          >

                            ${detailsHtml}

                          </table>
                        `
                        : ""
                    }


                    ${
                      buttonText && buttonUrl
                        ? `
                          <div
                            style="
                              text-align:center;
                              margin:30px 0 15px;
                            "
                          >

                            <a
                              href="${escapeHtml(buttonUrl)}"
                              style="
                                display:inline-block;
                                background:#111827;
                                color:#ffffff;
                                padding:13px 25px;
                                border-radius:8px;
                                text-decoration:none;
                                font-weight:600;
                              "
                            >
                              ${escapeHtml(buttonText)}
                            </a>

                          </div>
                        `
                        : ""
                    }


                    ${
                      footerMessage
                        ? `
                          <p
                            style="
                              margin-top:25px;
                              padding:15px;
                              background:#f9fafb;
                              border-radius:8px;
                              color:#6b7280;
                              font-size:13px;
                              line-height:1.6;
                            "
                          >
                            ${footerMessage}
                          </p>
                        `
                        : ""
                    }

                  </td>

                </tr>



                <!-- FOOTER -->

                <tr>

                  <td
                    style="
                      padding:22px;
                      background:#f9fafb;
                      text-align:center;
                      color:#9ca3af;
                      font-size:12px;
                    "
                  >

                    © ${new Date().getFullYear()} Foodie

                    <br/><br/>

                    This is an automated email.
                    Please do not reply.

                  </td>

                </tr>


              </table>

            </td>

          </tr>

        </table>

      </body>

    </html>
  `;
};