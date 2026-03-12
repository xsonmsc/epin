<?php
class Helper {
    public static function sendResponse($status, $message, $data = [], $code = 200) {
        http_response_code($code);
        echo json_encode(array_merge([
            "status" => $status,
            "message" => $message
        ], $data));
        exit;
    }

    public static function getInput() {
        return json_decode(file_get_contents("php://input"), true) ?? [];
    }

    public static function validate($data, $fields) {
        foreach ($fields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                self::sendResponse("error", "Missing required field: $field", [], 400);
            }
        }
    }
}
?>