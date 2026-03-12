<?php
require_once '../config/database.php';
require_once '../utils/Helper.php';

class OrderController {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function createOrder() {
        $data = Helper::getInput();
        Helper::validate($data, ['user_id', 'items', 'total_amount', 'payment_method']);

        $userId = (int) $data['user_id'];
        $items = $data['items'];
        $totalAmount = (float) $data['total_amount'];
        $method = $data['payment_method'];

        if (!is_array($items) || count($items) === 0) {
            Helper::sendResponse("error", "Items list is empty.", [], 400);
        }

        // 1. Check Balance if paying with Wallet
        if ($method === 'BALANCE') {
            $result = $this->db->updateOne(
                "users",
                ["id" => $userId, "balance" => ["\$gte" => $totalAmount]],
                ["\$inc" => ["balance" => -$totalAmount]]
            );

            if ($result['modified'] === 0) {
                Helper::sendResponse("error", "Balans kifayÉ™t deyil.", [], 400);
            }
        }

        // 2. Create Order
        $orderId = $this->db->getNextSequence("orders");
        $status = ($method === 'BALANCE') ? 'COMPLETED' : 'PENDING';

        $this->db->insertOne("orders", [
            "id" => $orderId,
            "user_id" => $userId,
            "total_amount" => $totalAmount,
            "status" => $status,
            "payment_method" => $method,
            "delivered_content" => "",
            "created_at" => new MongoDB\BSON\UTCDateTime()
        ]);

        // 3. Process Items & Deliver Stock if Auto
        $deliveredContent = "";

        foreach ($items as $item) {
            if (!isset($item['product_id'], $item['quantity'], $item['price'])) {
                Helper::sendResponse("error", "Item data incomplete.", [], 400);
            }

            $productId = (int) $item['product_id'];
            $quantity = (int) $item['quantity'];
            $price = (float) $item['price'];
            $title = $item['title'] ?? ("Product #" . $productId);

            $itemId = $this->db->getNextSequence("order_items");
            $this->db->insertOne("order_items", [
                "id" => $itemId,
                "order_id" => $orderId,
                "product_id" => $productId,
                "quantity" => $quantity,
                "price_at_purchase" => $price,
                "user_input" => $item['user_input'] ?? null
            ]);

            // Stock Logic for Auto Delivery
            if ($method === 'BALANCE') {
                $product = $this->db->findOne("products", ["id" => $productId]);
                $deliveryType = $product['delivery_type'] ?? null;

                if ($deliveryType === 'AUTO') {
                    $stocks = $this->db->find(
                        "stocks",
                        ["product_id" => $productId, "is_used" => false],
                        ["limit" => $quantity]
                    );

                    if (count($stocks) < $quantity) {
                        // Stok Ã§atÄ±ÅŸmazlÄ±ÄŸÄ± halÄ±nda statusu dÉ™yiÅŸ
                        $this->db->updateOne("orders", ["id" => $orderId], ["\$set" => ["status" => "PROCESSING"]]);
                        $deliveredContent .= $title . ": (Admin tÉ™rÉ™findÉ™n gÃ¶ndÉ™rilÉ™cÉ™k)\n";
                    } else {
                        foreach ($stocks as $stock) {
                            if (!isset($stock['id'])) {
                                continue;
                            }
                            $this->db->updateOne(
                                "stocks",
                                ["id" => (int) $stock['id']],
                                ["\$set" => ["is_used" => true, "used_by_order_id" => $orderId]]
                            );
                            $deliveredContent .= $title . ": " . ($stock['code_content'] ?? "") . "\n";
                        }

                        // Decrease product stock count
                        $this->db->updateOne("products", ["id" => $productId], ["\$inc" => ["stock_count" => -$quantity]]);
                    }
                }
            }
        }

        // Update Order with Content
        if (!empty($deliveredContent)) {
            $this->db->updateOne("orders", ["id" => $orderId], ["\$set" => ["delivered_content" => $deliveredContent]]);
        }

        Helper::sendResponse("success", "SifariÅŸ yaradÄ±ldÄ±", ["order_id" => $orderId, "status" => $status]);
    }
}
?>
