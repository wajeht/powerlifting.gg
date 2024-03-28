import { sendMail } from '../../mailer.js';

function generateWelcomeHTML(props) {
	return `
    <div>
      <h1>Welcome to Gains City</h1>
      <p>Hello ${props.name},</p>
      <p>We're excited to have you as a member of our community.</p>
    </div>
  `;
}

export async function sendWelcomeEmail({ email, subject = 'Welcome to Subdomain' }) {
	try {
		const html = generateWelcomeHTML({ name: email });

		await sendMail({
			to: email,
			subject,
			html,
		});

		console.log(`***** Welcome email sent to ${email} *****`);
	} catch (error) {
		console.error('***** Error while sending welcome email: ', error, ' *****');
	}
}
