<?php
require_once '../config/database.php';
require_once '../utils/Helper.php';

class AuthController {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function register() {
        $data = Helper::getInput();
        Helper::validate($data, ['name', 'email', 'password']);

        // Check if email exists
        $existing = $this->db->findOne("users", ["email" => $data['email']]);
        if ($existing) {
            Helper::sendResponse("error", "Bu email artÄ±q qeydiyyatdan keÃ§ib.", [], 409);
        }

        // Hash Password
        $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);

        $userId = $this->db->getNextSequence("users");
        $this->db->insertOne("users", [
            "id" => $userId,
            "name" => $data['name'],
            "email" => $data['email'],
            "phone" => $data['phone'] ?? null,
            "password_hash" => $password_hash,
            "balance" => 0,
            "is_banned" => false,
            "created_at" => new MongoDB\BSON\UTCDateTime()
        ]);

        Helper::sendResponse("success", "Qeydiyyat uÄŸurla tamamlandÄ±.");
    }

    public function login() {
        $data = Helper::getInput();
        Helper::validate($data, ['email', 'password']);

        $user = $this->db->findOne("users", ["email" => $data['email']]);

        if ($user && isset($user['password_hash']) && password_verify($data['password'], $user['password_hash'])) {
            if (!empty($user['is_banned'])) {
                Helper::sendResponse("error", "HesabÄ±nÄ±z bloklanÄ±b.", [], 403);
            }

            // Real tÉ™tbiqdÉ™ burada JWT Token yaradÄ±n
            $token = bin2hex(random_bytes(32));

            unset($user['password_hash']); // ÅžifrÉ™ni cavabdan silin
            unset($user['_id']);

            Helper::sendResponse("success", "GiriÅŸ uÄŸurlu.", [
                "token" => $token,
                "user" => $user
            ]);
        } else {
            Helper::sendResponse("error", "Email vÉ™ ya ÅŸifrÉ™ yanlÄ±ÅŸdÄ±r.", [], 401);
        }
    }
}
?>
