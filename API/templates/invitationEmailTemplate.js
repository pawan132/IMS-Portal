exports.invitationEmailTemplate = (firstName, invitationLink) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .email-container {
                  background-color: #ffffff;
                  margin: 20px auto;
                  padding: 20px;
                  max-width: 600px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
              }
              .email-header {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 20px;
              }
              .email-body {
                  font-size: 16px;
                  color: #333;
                  line-height: 1.5;
              }
              .email-footer {
                  margin-top: 30px;
                  font-size: 14px;
                  color: #888;
              }
              .btn {
                  display: inline-block;
                  background-color: #e4880f;
                  color: #ffffff;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="email-header">Registration Invitation</div>
              <div class="email-body">
                  <p>Hello ${firstName},</p>
                  <p>We are excited to invite you to complete your registration. Please click the button below:</p>
                  <a href="${invitationLink}" class="btn">Register Here</a>
                  <p>If you didn't request this email, please ignore it.</p>
              </div>
              <div class="email-footer">
                  <p>Best regards,<br>IMS</p>
              </div>
          </div>
      </body>
      </html>
      
      `;
  };
  