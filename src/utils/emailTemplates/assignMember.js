module.exports = ({ receiverName, name, email, phone }) => `
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
  </style>
</head>
<body>
  <div class="container">
    <p>Dear ${receiverName},</p>

    <p>
      I hope this message finds you well.
      A member has been assigned to you.
    </p>

    <h3>Assigned Member Details:</h3>

    <table>
      <tr>
        <td><strong>Name</strong></td>
        <td>${name}</td>
      </tr>

      ${email ? `
      <tr>
        <td><strong>Email</strong></td>
        <td>${email}</td>
      </tr>` : ``}

      ${phone ? `
      <tr>
        <td><strong>Phone</strong></td>
        <td>${phone}</td>
      </tr>` : ``}
    </table>

    <br/>

    <p>
      Thank you,<br/>
      <strong>AssisHealth</strong><br/>
      #850, 3rd Floor,<br/>
      Sahakar Nagar,<br/>
      Bengaluru, Karnataka 560092
    </p>
  </div>
</body>
</html>
`;
