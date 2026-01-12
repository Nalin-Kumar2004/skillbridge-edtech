const mailSender = require('../utils/mailSender');

exports.contactUsController = async (req, res) => {
  const { firstname, lastname, email, message, phoneNo } = req.body;

  try {
    // Validate required fields
    if (!firstname || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (first name, email, message)"
      });
    }

    // Create contact message
    const contactMessage = {
      firstName: firstname,
      lastName: lastname || "N/A",
      email,
      phoneNumber: phoneNo || "N/A",
      message,
      receivedAt: new Date().toISOString()
    };

    // Send email to admin (your email)
    const adminEmailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactMessage.firstName} ${contactMessage.lastName}</p>
      <p><strong>Email:</strong> ${contactMessage.email}</p>
      <p><strong>Phone:</strong> ${contactMessage.phoneNumber}</p>
      <p><strong>Message:</strong></p>
      <p>${contactMessage.message}</p>
      <p><strong>Received at:</strong> ${contactMessage.receivedAt}</p>
    `;

    await mailSender(
      process.env.CONTACT_US_EMAIL || "nalinnow@gmail.com",
      `New Contact Form Submission from ${firstname}`,
      adminEmailBody
    );

    // Send confirmation email to user
    const userEmailBody = `
      <h2>Thank you for reaching out!</h2>
      <p>Hello ${firstname},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your message:</strong></p>
      <p>${message}</p>
      <p>Best regards,<br>SkillBridge Team</p>
    `;

    await mailSender(
      email,
      "SkillBridge - We received your message",
      userEmailBody
    );

    return res.status(200).json({
      success: true,
      message: "Message sent successfully. We will get back to you soon."
    });

  } catch (error) {
    console.log("ERROR IN CONTACT US CONTROLLER:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message. Please try again later.",
      error: error.message
    });
  }
};
