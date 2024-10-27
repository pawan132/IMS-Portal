exports.createPasswordResetTemplate = (link) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 10px 0;
            background-color: #e4880f;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            text-align: center;
            background-color: #e4880f;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Please click the button below to reset your password.</p>
            <a href="${link}" class="button">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 IMS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  