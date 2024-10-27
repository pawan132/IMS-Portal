require("dotenv").config();

const verified_mail = () => {
  return ` 
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Activated</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f3f3f3;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        text-align: center;
        padding: 20px;
        background-color: #f3f3f3;
      }
      .email-body img {
        max-width: 100px;
      }
      .email-body {
        padding: 20px;
        text-align: center;
      }
      .email-body h1 {
        font-size: 24px;
        margin-bottom: 20px;
      }
      .email-body p {
        font-size: 16px;
        color: #666666;
        margin-bottom: 20px;
      }
      .email-body a {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #e4880f;
        text-decoration: none;
        border-radius: 5px;
      }
      @media (max-width: 600px) {
        .email-body h1 {
          font-size: 20px;
        }
        .email-body p {
          font-size: 14px;
        }
        .email-body a {
          padding: 10px;
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-body">
        <img src="${process.env.API_URL}/images/ims-logo.jpg" alt="Logo" />
        <h1>Account Activated</h1>
        <img
          src="${process.env.API_URL}/images/email-verified.jpg"
          alt="Email Icon"
          style="min-width: 200px"
        />
        <p>
          Thank you, your email has been verified. Your account is now active.
          Please use the link below to login to your account.
        </p>
        <a href="${process.env.UI_URL}">LOGIN TO YOUR ACCOUNT</a>
      </div>
    </div>
  </body>
</html>`;
};

module.exports = verified_mail