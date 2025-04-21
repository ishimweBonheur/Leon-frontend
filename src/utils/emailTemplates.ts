export const emailTemplates = {
  applicationStatusUpdate: (
    status: string,
    jobTitle: string,
    firstName: string,
    getApplicationById: string
  ) => ({
    subject: "Your Application Status Has Been Updated",
    text: `Hi ${firstName},

Good news! The status of your application for the position of "${jobTitle}" has been updated to: ${status}.

You can view your full application details here: ${getApplicationById}

Thank you for your interest in joining our team!

Best regards,  
The Recruitment Team`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <p>Hi ${firstName }</p>

        <p>We wanted to let you know that the status of your application for the position of 
        <strong>${jobTitle}</strong> has been 
        <strong style="color: #1a73e8;">${status}</strong>.</p>

        <p>Thank you for applying and taking the time to go through our recruitment process.</p>

        <p>Best regards,<br/>The Recruitment Team</p>
      </div>
    `,
  }),
};
