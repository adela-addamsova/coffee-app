import { OrderData } from "../../db/orders-db";
import { SupportedLocale } from "../NodemailerService";

type Signature = (locale: SupportedLocale) => string;

export function orderConfirmationEmail(
  orderData: OrderData,
  orderId: number,
  userLocale: SupportedLocale,
  getSignatureHTML: Signature,
): { subject: string; html: string } {
  const texts = {
    en: {
      subject: "Order Confirmation",
      text: "Thank you for your order.",
      orderSummaryText1: "Total price of your order is",
      orderSummaryText2: "and has id",
      summary: "Order Summary",
      summaryShipment: "Shipment Method:",
      summaryPayment: "Payment Method:",
      shipmentMethods: {
        standard: "Standard shipping",
        express: "Express shipping",
      },
      paymentMethods: {
        card: "Card payment",
        "bank-transfer": "Bank transfer",
        cash: "Cash on delivery",
      },
      bankTransferNote:
        "Please make the payment to account 000000000/0000 and use the order ID as the variable symbol.",
    },
    cs: {
      subject: "Potvrzení objednávky",
      text: "Děkujeme za vaši objednávku.",
      orderSummaryText1: "Celková cena vaší objednávky je",
      orderSummaryText2: "a dostala ID",
      summary: "Shrnutí objednávky",
      summaryShipment: "Způsob dopravy:",
      summaryPayment: "Způsob platby:",
      shipmentMethods: {
        standard: "Standardní doručení",
        express: "Expresní doručení",
      },
      paymentMethods: {
        card: "Platba kartou",
        "bank-transfer": "Bankovní převod",
        cash: "Hotově při převzetí",
      },
      bankTransferNote:
        "Platbu prosím proveďte na účet 000000000/0000 a uveďte jako variabilní symbol ID objednávky.",
    },
  }[userLocale];

  const itemsHtml = orderData.items
    .map(
      (item) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; font-family:Georgia, serif; font-size:16px; border-collapse:collapse;">
          <tr>
            <td style="width:15%; padding:12px; border-bottom:1px solid #ddd;" align="left">
              <img src="https://coffee-app-frontend-5i2ric94e-perniceks-projects.vercel.app/product-packages/package-${item.product_id}.png"
                alt="${item.product_title}" height="44" style="display:block; border:none; outline:none;">
            </td>
            <td style="width:40%; padding:12px; border-bottom:1px solid #ddd;" align="left">
              ${item.product_title}
            </td>
            <td style="width:20%; padding:12px; border-bottom:1px solid #ddd;" align="center">
              ${item.quantity}x
            </td>
            <td style="width:25%; padding:12px; border-bottom:1px solid #ddd;" align="right">
              $${item.price.toFixed(2)}
            </td>
          </tr>
        </table>
      `,
    )
    .join("");

  const html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:white; margin:20px auto 40px auto;">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
            <tr>
              <td>
                <p style="font-size:16px; font-family:Georgia, serif; line-height:32px; margin:0 0 12px 0;">
                  ${texts.text}
                </p>
                <p style="font-size:16px; font-family:Georgia, serif; line-height:32px; margin:0 0 32px 0;">
                  ${texts.orderSummaryText1} <strong>$${orderData.total_amount.toFixed(2)}</strong>
                  ${texts.orderSummaryText2} <strong>${orderId}</strong>.
                </p>
                <h4 style="font-size:20px; font-family:Georgia, serif; line-height:32px; margin:0 0 24px 0;">
                  ${texts.summary}
                </h4>

                ${itemsHtml}

                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:28px auto 20px auto; font-family:Georgia, serif; font-size:16px; border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;">
                      <strong>${texts.summaryShipment}</strong> ${texts.shipmentMethods[orderData.shipment_method]}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">
                      <strong>${texts.summaryPayment}</strong> ${texts.paymentMethods[orderData.payment_method]}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; line-height:32px;">
                      ${orderData.payment_method === "bank-transfer" ? texts.bankTransferNote : ""}
                    </td>
                  </tr>
                </table>

                ${getSignatureHTML(userLocale)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return { subject: texts.subject, html };
}
