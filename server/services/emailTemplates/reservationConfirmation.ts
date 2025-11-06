import { SupportedLocale } from "../NodemailerService";

type Signature = (locale: SupportedLocale) => string;

interface ReservationData {
  name: string;
  email: string;
  datetime: string;
  guests: number;
}

export function reservationConfirmationEmail(
  reservationData: ReservationData,
  userLocale: SupportedLocale,
  getSignatureHTML: Signature,
) {
  const reservationTexts = {
    en: {
      subject: "Reservation Confirmation",
      text: "Your reservation is confirmed. Thank you for choosing us – we're looking forward to your visit.",
      summary: "Reservation Summary",
      summaryTime: "Date and time:",
      summarySeats: "Guests:",
    },
    cs: {
      subject: "Potvrzení rezervace",
      text: "Potvrzujeme Vaši rezervaci. Děkujeme, že jste si nás vybrali – těšíme se na Vaši návštěvu.",
      summary: "Shrnutí rezervace",
      summaryTime: "Datum a čas:",
      summarySeats: "Počet hostů:",
    },
  };

  const formattedDate = new Intl.DateTimeFormat(
    userLocale === "cs" ? "cs-CZ" : "en-GB",
    {
      dateStyle: "long",
      timeStyle: "short",
    },
  ).format(new Date(reservationData.datetime));

  const html = `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:white; margin:20px auto 40px auto;">
            <tr>
              <td align="center" style="padding:20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
                    <tr>
                        <td>
                        <p style="font-size: 16px; font-family: Georgia, serif; margin:0 0 32px 0; line-height: 32px;">
                            ${reservationTexts[userLocale].text}
                        </p>
                        <h4 style="font-size: 20px; font-family: Georgia, serif; margin:0 0 4px 0; line-height: 32px;">
                            ${reservationTexts[userLocale].summary}
                        </h4>
                        <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0 0 0 20px;">
                            <strong>${reservationTexts[userLocale].summaryTime}</strong> ${formattedDate}
                        </p>
                        <p style="font-size: 16px; line-height: 32px; font-family: Georgia, serif; margin: 0 0 24px 20px;">
                            <strong>${reservationTexts[userLocale].summarySeats}</strong> ${reservationData.guests}
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
    subject: reservationTexts[userLocale].subject,
    html,
  };
}
