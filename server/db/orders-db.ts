import pool from "./coffee-app-db";

/**
 * Single item in an order
 */
export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

/**
 * Full order data
 */
export interface OrderData {
  customer_name: string;
  customer_address: string;
  customer_city: string;
  customer_postalcode: string;
  customer_email: string;
  customer_phone: string;
  shipment_method: "standard" | "express";
  payment_method: "card" | "bank-transfer" | "cash";
  items: OrderItem[];
  total_amount: number;
  paid: boolean;
}

/**
 * Creates a new order and its items within a database transaction
 * @param order - Order data
 * @returns - Generated order ID
 * @throws Error if stock is insufficient or a database operation fails
 */
export async function createOrder(order: OrderData): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderResult = await client.query<{ id: number }>(
      `
      INSERT INTO orders 
        (customer_name, customer_address, customer_city, customer_postalcode, customer_email, customer_phone, shipment_method, payment_method, total_amount, paid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
      `,
      [
        order.customer_name,
        order.customer_address,
        order.customer_city,
        order.customer_postalcode,
        order.customer_email,
        order.customer_phone,
        order.shipment_method,
        order.payment_method,
        order.total_amount,
        order.paid,
      ],
    );

    const orderId = orderResult.rows[0].id;

    for (const item of order.items) {
      const stockResult = await client.query<{ stock: number }>(
        `
        UPDATE products 
        SET stock = stock - $1 
        WHERE id = $2 AND stock >= $1
        RETURNING stock
        `,
        [item.quantity, item.product_id],
      );

      if (stockResult.rowCount === 0) {
        throw new Error(`Not enough stock for product ${item.product_id}`);
      }

      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [orderId, item.product_id, item.quantity, item.price],
      );
    }

    await client.query("COMMIT");
    return orderId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
