<?php
require_once '../config/database.php';
require_once '../utils/Helper.php';

class OrderController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function createOrder() {
        $data = Helper::getInput();
        Helper::validate($data, ['user_id', 'items', 'total_amount', 'payment_method']);

        try {
            $this->db->beginTransaction();

            $userId = $data['user_id'];
            $items = $data['items'];
            $totalAmount = $data['total_amount'];
            $method = $data['payment_method'];

            // 1. Check Balance if paying with Wallet
            if ($method === 'BALANCE') {
                $stmt = $this->db->prepare("SELECT balance FROM users WHERE id = ? FOR UPDATE");
                $stmt->execute([$userId]);
                $balance = $stmt->fetchColumn();

                if ($balance < $totalAmount) {
                    throw new Exception("Balans kifayət deyil.");
                }

                // Deduct Balance
                $stmt = $this->db->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
                $stmt->execute([$totalAmount, $userId]);
            }

            // 2. Create Order
            $stmt = $this->db->prepare("INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, ?, ?)");
            $status = ($method === 'BALANCE') ? 'COMPLETED' : 'PENDING';
            $stmt->execute([$userId, $totalAmount, $status, $method]);
            $orderId = $this->db->lastInsertId();

            // 3. Process Items & Deliver Stock if Auto
            $deliveredContent = "";
            
            foreach ($items as $item) {
                // Insert Order Item
                $stmt = $this->db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, user_input) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['price'], $item['user_input'] ?? null]);

                // Stock Logic for Auto Delivery
                if ($method === 'BALANCE') {
                    $stmt = $this->db->prepare("SELECT delivery_type FROM products WHERE id = ?");
                    $stmt->execute([$item['product_id']]);
                    $prodType = $stmt->fetchColumn();

                    if ($prodType === 'AUTO') {
                        $stmt = $this->db->prepare("SELECT id, code_content FROM stocks WHERE product_id = ? AND is_used = 0 LIMIT ? FOR UPDATE");
                        $stmt->execute([$item['product_id'], $item['quantity']]);
                        $stocks = $stmt->fetchAll();

                        if (count($stocks) < $item['quantity']) {
                             // Stok çatışmazlığı halında statusu dəyiş
                             $this->db->exec("UPDATE orders SET status = 'PROCESSING' WHERE id = $orderId");
                             $deliveredContent .= $item['title'] . ": (Admin tərəfindən göndəriləcək)\n";
                        } else {
                            foreach ($stocks as $stock) {
                                $this->db->prepare("UPDATE stocks SET is_used = 1, used_by_order_id = ? WHERE id = ?")->execute([$orderId, $stock['id']]);
                                $deliveredContent .= $item['title'] . ": " . $stock['code_content'] . "\n";
                                
                                // Decrease product stock count
                                $this->db->prepare("UPDATE products SET stock_count = stock_count - 1 WHERE id = ?")->execute([$item['product_id']]);
                            }
                        }
                    }
                }
            }

            // Update Order with Content
            if (!empty($deliveredContent)) {
                $stmt = $this->db->prepare("UPDATE orders SET delivered_content = ? WHERE id = ?");
                $stmt->execute([$deliveredContent, $orderId]);
            }

            $this->db->commit();
            Helper::sendResponse("success", "Sifariş yaradıldı", ["order_id" => $orderId, "status" => $status]);

        } catch (Exception $e) {
            $this->db->rollBack();
            Helper::sendResponse("error", $e->getMessage(), [], 400);
        }
    }
}
?>