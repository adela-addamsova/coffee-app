import { SupportedLocale } from "../NodemailerService";

type Signature = (locale: SupportedLocale) => string;

export function subscriptionConfirmationEmail(
  userLocale: SupportedLocale,
  getSignatureHTML: Signature,
) {
  const newsletterTexts = {
    en: {
      subject: "Morning Mist Coffee Newsletter",
      heading: "Welcome to the Morning Mist Coffee Newsletter!",
      body: "Thank you for subscribing to our newsletter! We’ll be sending you updates, special offers, and the latest news.",
    },
    cs: {
      subject: "Morning Mist Coffee Newsletter",
      heading: "Vítejte v newsletteru Morning Mist Coffee!",
      body: "Děkujeme, že jste se přihlásili k odběru našeho newsletteru! Budeme vám zasílat novinky, speciální nabídky a aktuální informace.",
    },
  };

  const html = `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:white; margin:20px auto 40px auto;">
            <tr>
              <td align="center" style="padding:20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; padding: 24px;">
                  <tr>
                     <td>
                        <h4 style="font-size: 32px; font-family: Georgia, serif; margin:0 0 24px 0; line-height: 40px;">
                            ${newsletterTexts[userLocale].heading}
                        </h4>
                        <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0 0 24px 0;">
                            ${newsletterTexts[userLocale].body}
                        </p>
                        ${getSignatureHTML(userLocale)}
                      </td>
                  </tr>
                </table>
              </td>
            </tr>
        </table> 
      `;

  return {
    subject: newsletterTexts[userLocale].subject,
    html,
  };
}
