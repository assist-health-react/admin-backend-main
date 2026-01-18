// module.exports = ({ name, memberId, phone, tempPassword }) => `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <style>
//     body { font-family: Arial, sans-serif; background:#F5F8FB; }
//     .container {
//       max-width:600px;
//       margin:auto;
//       background:#fff;
//       padding:20px;
//     }
//     table { width:100%; }
//     td { padding:6px; }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <p>Dear ${name},</p>

//     <p>Welcome to <strong>AssisHealth</strong> 🎉</p>

//     <h3>Your Account Details</h3>

//     <table>
//       <tr>
//         <td><strong>Member ID</strong></td>
//         <td>${memberId}</td>
//       </tr>
//       <tr>
//         <td><strong>Phone</strong></td>
//         <td>${phone}</td>
//       </tr>
//       <tr>
//         <td><strong>Temporary Password</strong></td>
//         <td>${tempPassword}</td>
//       </tr>
//     </table>

//     <p>
//       Please login and change your password immediately.
//     </p>

//     <br/>
//     <p>
//       Thank you,<br/>
//       <strong>AssisHealth Team</strong>
//     </p>
//   </div>
// </body>
// </html>
// `;
module.exports = ({ name, memberId, phone }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #F5F8FB;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
    }
    table {
      width: 100%;
    }
    td {
      padding: 6px;
    }
    .box {
      background: #F5F8FB;
      padding: 10px;
      border-radius: 6px;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Dear ${name},</p>

    <p>
      Welcome to <strong>AssisHealth</strong> 🎉  
      Your account has been created successfully.
    </p>

    <h3>Your Account Details</h3>

    <table>
      <tr>
        <td><strong>Member ID</strong></td>
        <td>${memberId}</td>
      </tr>
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
      <strong>MemberID@BirthYear</strong><br/>
      Example: <strong>${memberId}@2000</strong>
    </div>

    <p>
      If your <strong>Date of Birth</strong> is not available in our system,  
      please use the following format:
    </p>

    <div class="box">
      <strong>${memberId}</strong>
    </div>

    <p>
      For security reasons, you will be required to
      <strong>change your password after first login</strong>.
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
