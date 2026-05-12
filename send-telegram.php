<?php
// === Настройки ===
$bot_token = 'ВАШ_ТОКЕН_БОТА';
$chat_id = 'ВАШ_CHAT_ID';

// Получаем данные формы
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo 'Нет данных';
    exit;
}

// Формируем текст сообщения
$message = "\xF0\x9F\x93\x9D Новая заявка с брифа\n";
$message .= "\n<b>ФИО:</b> " . htmlspecialchars($data['fullName'] ?? '') .
    "\n<b>Email:</b> " . htmlspecialchars($data['email'] ?? '') .
    "\n<b>Телефон/мессенджер:</b> " . htmlspecialchars($data['phoneOrMessenger'] ?? '') .
    "\n<b>Компания/проект:</b> " . htmlspecialchars($data['company'] ?? '') .
    "\n\n<b>О компании:</b> " . htmlspecialchars($data['aboutCompany'] ?? '') .
    "\n<b>Цели и задачи:</b> " . htmlspecialchars($data['goals'] ?? '') .
    "\n<b>Тип сайта:</b> " . htmlspecialchars($data['siteType'] ?? '') .
    ($data['siteType'] === 'Другое' ? ' (' . htmlspecialchars($data['siteTypeOther'] ?? '') . ')' : '') .
    "\n<b>Функционал:</b> " . implode(', ', $data['features'] ?? []) .
    ($data['featuresOther'] ? ' (' . htmlspecialchars($data['featuresOther']) . ')' : '') .
    "\n<b>Дизайн:</b> " . htmlspecialchars($data['designPreferences'] ?? '') .
    "\n<b>Референсы:</b> " . htmlspecialchars($data['references'] ?? '') .
    "\n<b>Страницы:</b> " . implode(', ', $data['pages'] ?? []) .
    ($data['pagesOther'] ? ' (' . htmlspecialchars($data['pagesOther']) . ')' : '') .
    "\n<b>Контент:</b> " . implode(', ', $data['content'] ?? []) .
    "\n<b>Целевая аудитория:</b> " . htmlspecialchars($data['audience'] ?? '') .
    "\n<b>Технические требования:</b> " . htmlspecialchars($data['tech'] ?? '') .
    "\n<b>Бюджет:</b> " . htmlspecialchars($data['budget'] ?? '') .
    "\n<b>Сроки:</b> " . htmlspecialchars($data['deadline'] ?? '') .
    "\n<b>Дата старта:</b> " . htmlspecialchars($data['startDate'] ?? '') .
    "\n<b>Поддержка:</b> " . htmlspecialchars($data['support'] ?? '') .
    ($data['support'] === 'Другое' ? ' (' . htmlspecialchars($data['supportOther'] ?? '') . ')' : '') .
    "\n<b>Комментарии:</b> " . htmlspecialchars($data['comments'] ?? '');

// Отправляем в Telegram
$url = "https://api.telegram.org/bot$bot_token/sendMessage";
$params = [
    'chat_id' => $chat_id,
    'text' => $message,
    'parse_mode' => 'HTML',
];

$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($params),
        'timeout' => 10,
    ],
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result) {
    echo 'OK';
} else {
    http_response_code(500);
    echo 'Ошибка отправки';
}
