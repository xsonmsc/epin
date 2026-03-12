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
            if (!array_key_exists($field, $data)) {
                self::sendResponse("error", "Missing required field: $field", [], 400);
            }
            $value = $data[$field];
            if (is_string($value) && trim($value) === "") {
                self::sendResponse("error", "Missing required field: $field", [], 400);
            }
            if (is_array($value) && count($value) === 0) {
                self::sendResponse("error", "Missing required field: $field", [], 400);
            }
            if (is_null($value)) {
                self::sendResponse("error", "Missing required field: $field", [], 400);
            }
        }
    }
}
?>
