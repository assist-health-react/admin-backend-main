module.exports = ({ name, email, phone, memberId }) => `
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
    <p>Dear Admin,</p>

    <p>A new member has been created.</p>

    <h3>Member Details</h3>

    <table>
      <tr><td><strong>Name</strong></td><td>${name}</td></tr>
      <tr><td><strong>Member ID</strong></td><td>${memberId}</td></tr>
      <tr><td><strong>Email</strong></td><td>${email || '-'}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
    </table>

    <br/>
    <p><strong>AssisHealth System</strong></p>
  </div>
</body>
</html>
`;
