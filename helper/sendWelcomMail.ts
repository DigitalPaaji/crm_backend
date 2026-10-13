
import "dotenv/config";
import nodemailer from "nodemailer";

// Configure Gmail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeMail = async (
  name: string,
  email: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"DigitalPaaji Team" <${process.env.EMAIL_USER}>`,
      to: email,
     subject: "Welcome to DigitalPaaji!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to DigitalPaaji</title>
          </head>

          <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial,Helvetica,sans-serif; color:#222222;">

            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
              style="background-color:#f4f4f4; padding:35px 12px;">
              <tr>
                <td align="center">

                  <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                    style="width:100%; max-width:600px; background-color:#ffffff; border:1px solid #e5e5e5;">

                    <!-- Header -->
                    <tr>
                      <td style="background-color:#171717; padding:30px 35px; text-align:center;">
                        <h1 style="margin:0; color:#ffffff; font-size:27px; letter-spacing:3px;">
                            DigitalPaaji

                        </h1>
                        <p style="margin:9px 0 0; color:#bdbdbd; font-size:12px; letter-spacing:1px;">
                          QUALITY · SERVICE · TRUST
                        </p>
                      </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                      <td style="padding:40px 35px 30px;">

                        <p style="margin:0 0 18px; font-size:16px; color:#333333;">
                          Hello ${escapeHtml(name)},
                        </p>

                        <h2 style="margin:0 0 18px; font-size:25px; line-height:1.4; color:#171717;">
                          Welcome to   DigitalPaaji
!
                        </h2>

                        <p style="margin:0 0 18px; font-size:15px; line-height:1.8; color:#555555;">
                          Thank you for your interest in   DigitalPaaji
. We're delighted to
                          connect with you and appreciate the opportunity to assist
                          you with your requirements.
                        </p>

                        <p style="margin:0 0 22px; font-size:15px; line-height:1.8; color:#555555;">
                          Our team has received your enquiry and will be in touch
                          to understand your needs and help you explore the right
                          solutions.
                        </p>

                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                          style="background-color:#f7f7f7; border-left:3px solid #222222;">
                          <tr>
                            <td style="padding:18px 20px;">
                              <p style="margin:0 0 7px; font-size:14px; font-weight:bold; color:#222222;">
                                What happens next?
                              </p>
                              <p style="margin:0; font-size:14px; line-height:1.8; color:#666666;">
                                Our team will review your enquiry and contact you
                                using the details you provided.
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin:25px 0 0; font-size:15px; line-height:1.8; color:#555555;">
                          If you have any additional questions, simply reply to
                          this email. We're happy to help.
                        </p>

                        <p style="margin:30px 0 0; font-size:15px; line-height:1.8; color:#333333;">
                          Best regards,<br />
                          <strong style="color:#171717;">The   DigitalPaaji
 Team</strong>
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:22px 30px; background-color:#f7f7f7; border-top:1px solid #e5e5e5; text-align:center;">
                        <p style="margin:0 0 8px; font-size:12px; color:#777777;">
                          Thank you for connecting with   DigitalPaaji
.
                        </p>
                        <p style="margin:0; font-size:11px; color:#999999;">
                          This email was sent because you submitted an enquiry to   DigitalPaaji
.
                        </p>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Welcome email sent successfully to ${email}`);

    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
};

// Escape user-provided text before inserting it into HTML.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

