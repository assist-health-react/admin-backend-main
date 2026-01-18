module.exports = ({ name, phone }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background:#F5F8FB; }
    .container {
      max-width:600px;
      margin:auto;
      background:#fff;
      padding:20px;
    }
    table { width:100%; }
    td { padding:6px; }
    .box {
      background:#F5F8FB;
      padding:10px;
      border-radius:6px;
      margin:10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Dear ${name},</p>

    <p>
      Welcome to <strong>AssisHealth</strong> 🎉  
      Your Navigator account has been created successfully.
    </p>

    <h3>Your Account Details</h3>

    <table>
      <tr>
        <td><strong>Registered Phone</strong></td>
        <td>${phone}</td>
      </tr>
    </table>

    <h3>Password Instructions</h3>

    <p>
      Your initial login password is generated using the following format:
    </p>

    <div class="box">
      <strong>FIRST 4 LETTERS OF YOUR NAME (CAPS) @ BIRTH YEAR</strong><br/>
      Example: <strong>SATH@1991</strong>
    </div>

    <p>If your Date of Birth is not available, use:</p>

    <div class="box">
      <strong>FIRST 4 LETTERS OF YOUR NAME (CAPS)@</strong><br/>
      Example: <strong>SATH@</strong>
    </div>

    <p>
      For security reasons, you must change your password after your first login.
    </p>

    <br/>
    <p>
      Regards,<br/>
      <strong>AssisHealth Team</strong>
    </p>
  </div>
</body>
</html>
`;
