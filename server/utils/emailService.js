const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send event registration confirmation email
const sendEventRegistrationEmail = async (user, event) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `🎉 Event Registration Confirmed - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">CampusConnect</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Event Registration Confirmed!</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.firstName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Great news! You have successfully registered for the event:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin: 0 0 10px 0;">${event.title}</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Event Type:</strong> ${event.eventType}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Time:</strong> ${new Date(event.startDate).toLocaleTimeString()}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Venue:</strong> ${event.venue}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Organizer:</strong> ${event.organizer?.firstName} ${event.organizer?.lastName}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin: 0 0 10px 0;">📋 Event Details</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">${event.description}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/events/${event._id}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Event Details
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, please contact the event organizer or visit our website.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message from CampusConnect. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Event registration email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending event registration email:', error);
  }
};

// Send club membership confirmation email
const sendClubMembershipEmail = async (user, club, status) => {
  try {
    const transporter = createTransporter();
    
    const subject = status === 'approved' 
      ? `🎉 Welcome to ${club.name}!` 
      : `📝 Club Membership Update - ${club.name}`;
    
    const mailOptions = {
      from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">CampusConnect</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Club Membership Update</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.firstName}!</h2>
            
            ${status === 'approved' ? `
              <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="color: #155724; margin: 0 0 10px 0;">🎉 Congratulations!</h3>
                <p style="color: #155724; margin: 0;">Your membership request for <strong>${club.name}</strong> has been approved!</p>
              </div>
            ` : `
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin: 0 0 10px 0;">📝 Membership Update</h3>
                <p style="color: #856404; margin: 0;">Your membership request for <strong>${club.name}</strong> is now <strong>${status}</strong>.</p>
              </div>
            `}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin: 0 0 10px 0;">${club.name}</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Category:</strong> ${club.category}</p>
              <p style="color: #666; margin: 5px 0;"><strong>President:</strong> ${club.president?.firstName} ${club.president?.lastName}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Members:</strong> ${club.currentMembers}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> ${status}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin: 0 0 10px 0;">📋 About ${club.name}</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">${club.description}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/clubs/${club._id}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Club Details
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, please contact the club president or visit our website.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message from CampusConnect. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Club membership email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending club membership email:', error);
  }
};

// Send event creation notification email
const sendEventCreatedEmail = async (user, event) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `📅 Event Created Successfully - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">CampusConnect</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Event Created Successfully!</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.firstName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your event has been created successfully and is now pending admin approval:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin: 0 0 10px 0;">${event.title}</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Event Type:</strong> ${event.eventType}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Time:</strong> ${new Date(event.startDate).toLocaleTimeString()}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Venue:</strong> ${event.venue}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> Pending Approval</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">⏳ Next Steps</h4>
              <p style="color: #856404; margin: 0; font-size: 14px;">
                Your event is now under review by our admin team. You will receive an email notification once it's approved or if any changes are needed.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/events/${event._id}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Event Details
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Thank you for using CampusConnect to organize your event!
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message from CampusConnect. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Event creation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending event creation email:', error);
  }
};

module.exports = {
  sendEventRegistrationEmail,
  sendClubMembershipEmail,
  sendEventCreatedEmail
};
