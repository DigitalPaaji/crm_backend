
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

export const sendLeadMail = async (
  email: string,
  sendingdate: string,
  note: string | null,
  followUpcommingDate: string | null,
  lead: any
): Promise<boolean> => {
  try {
    const formatDate = (date: string | Date | null | undefined) => {
      if (!date) return "Not scheduled";

      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return String(date);
      }

      return parsedDate.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      });
    };

    const escapeHtml = (value: unknown): string =>
      String(value ?? "").replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };

        return entities[char];
      });

    const leadName = escapeHtml(lead?.name || "Valued Client");
    const leadEmail = escapeHtml(lead?.email || email);
    const leadFor = escapeHtml(lead?.leadfor || "General Enquiry");

    const currentFollowUp = formatDate(
      lead?.lastFollowup?.date || sendingdate
    );

    const upcomingFollowUp = formatDate(followUpcommingDate);
    const safeNote = escapeHtml(note || "No additional notes provided.");

    const mailOptions = {
      from: `"DigitalPaaji Team" <${process.env.EMAIL_USER}>`,
      to: [email, "rishi@digitalpaaji.com"],
      subject: `Follow-up Update | ${leadName} - DigitalPaaji`,

      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Lead Follow-up Update</title>
        </head>

        <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#262626;">

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
            style="padding:30px 12px;background:#f3f4f6;">
            <tr>
              <td align="center">

                <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                  style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e5e7eb;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:28px 30px;background:#171717;color:#ffffff;">
                      <h1 style="margin:0;font-size:25px;letter-spacing:1px;">
                        DigitalPaaji
                      </h1>
                      <p style="margin:8px 0 0;font-size:12px;color:#d4d4d4;">
                        LEAD FOLLOW-UP UPDATE
                      </p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding:30px;">

                      <h2 style="margin:0 0 12px;font-size:22px;color:#171717;">
                        Follow-up Summary
                      </h2>

                      <p style="margin:0 0 24px;font-size:14px;line-height:1.8;color:#525252;">
                        A follow-up has been recorded for the following lead.
                        Please review the details below.
                      </p>

                      <!-- Lead Details -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                        style="border-collapse:collapse;border:1px solid #e5e7eb;">

                        <tr>
                          <td colspan="2"
                            style="padding:14px 16px;background:#f5f5f5;font-size:14px;font-weight:bold;color:#171717;">
                            Lead Information
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;color:#737373;font-size:13px;width:38%;">
                            Name
                          </td>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font-size:13px;font-weight:bold;color:#262626;">
                            ${leadName}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;color:#737373;font-size:13px;">
                            Email
                          </td>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font-size:13px;color:#262626;">
                            ${leadEmail}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;color:#737373;font-size:13px;">
                            Lead For
                          </td>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font-size:13px;color:#262626;">
                            ${leadFor}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;color:#737373;font-size:13px;">
                            Follow-up Date
                          </td>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font-size:13px;color:#262626;">
                            ${escapeHtml(currentFollowUp)}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;color:#737373;font-size:13px;">
                            Next Follow-up
                          </td>
                          <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font-size:13px;font-weight:bold;color:#171717;">
                            ${escapeHtml(upcomingFollowUp)}
                          </td>
                        </tr>

                      </table>

                      <!-- Notes -->
                      <div style="margin-top:24px;padding:18px;background:#f9fafb;border-left:3px solid #404040;">
                        <h3 style="margin:0 0 10px;font-size:14px;color:#171717;">
                          Follow-up Notes
                        </h3>
                        <p style="margin:0;font-size:13px;line-height:1.8;color:#525252;white-space:pre-wrap;">
                          ${safeNote}
                        </p>
                      </div>

                      <p style="margin:25px 0 0;font-size:13px;line-height:1.8;color:#737373;">
                        This email is an update from the DigitalPaaji lead management system.
                      </p>

                      <p style="margin:20px 0 0;font-size:14px;line-height:1.8;color:#262626;">
                        Regards,<br />
                        <strong>DigitalPaaji Team</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:18px 25px;background:#f5f5f5;border-top:1px solid #e5e7eb;text-align:center;">
                      <p style="margin:0;font-size:11px;color:#737373;">
                        © ${new Date().getFullYear()} DigitalPaaji. All rights reserved.
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

    console.log(`Follow-up email sent for lead: ${lead?.name || email}`);

    return true;
  } catch (error) {
    console.error("Failed to send follow-up email:", error);
    return false;
  }
};
