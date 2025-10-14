import type { Database as DBType } from "better-sqlite3";

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

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
 * @param dbInstance - The SQLite database instance
 * @returns - Generated order ID
 * @throws Error if stock is insufficient or a database operation fails
 */
export function createOrder(order: OrderData, dbInstance: DBType): number {
  const insertOrderStmt = dbInstance.prepare(`
    INSERT INTO orders
      (customer_name, customer_address, customer_city, customer_postalcode, customer_email, customer_phone, shipment_method, payment_method, total_amount, paid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItemStmt = dbInstance.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `);

  const updateStockStmt = dbInstance.prepare(`
    UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?
  `);

  return dbInstance.transaction(() => {
    const result = insertOrderStmt.run(
      order.customer_name,
      order.customer_address,
      order.customer_city,
      order.customer_postalcode,
      order.customer_email,
      order.customer_phone,
      order.shipment_method,
      order.payment_method,
      order.total_amount,
      order.paid ? 1 : 0,
    );

    const orderId = result.lastInsertRowid as number;

    for (const item of order.items) {
      const updated = updateStockStmt.run(
        item.quantity,
        item.product_id,
        item.quantity,
      );
      if (updated.changes === 0) {
        throw new Error(`Not enough stock for product ${item.product_id}`);
      }

      insertItemStmt.run(orderId, item.product_id, item.quantity, item.price);
    }

    return orderId;
  })();
}
