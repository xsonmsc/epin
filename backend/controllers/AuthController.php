<?php
require_once '../config/database.php';
require_once '../utils/Helper.php';

class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function register() {
        $data = Helper::getInput();
        Helper::validate($data, ['name', 'email', 'password']);

        // Check if email exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->rowCount() > 0) {
            Helper::sendResponse("error", "Bu email artıq qeydiyyatdan keçib.", [], 409);
        }

        // Hash Password
        $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);
        
        $stmt = $this->db->prepare("INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)");
        if ($stmt->execute([$data['name'], $data['email'], $data['phone'] ?? null, $password_hash])) {
            Helper::sendResponse("success", "Qeydiyyat uğurla tamamlandı.");
        } else {
            Helper::sendResponse("error", "Sistem xətası.", [], 500);
        }
    }

    public function login() {
        $data = Helper::getInput();
        Helper::validate($data, ['email', 'password']);

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if ($user && password_verify($data['password'], $user['password_hash'])) {
            if ($user['is_banned']) {
                Helper::sendResponse("error", "Hesabınız bloklanıb.", [], 403);
            }

            // Real tətbiqdə burada JWT Token yaradın
            $token = bin2hex(random_bytes(32)); 
            
            unset($user['password_hash']); // Şifrəni cavabdan silin
            
            Helper::sendResponse("success", "Giriş uğurlu.", [
                "token" => $token,
                "user" => $user
            ]);
        } else {
            Helper::sendResponse("error", "Email və ya şifrə yanlışdır.", [], 401);
        }
    }
}
?>