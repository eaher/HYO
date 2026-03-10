<?php
$destinatario = 'administracion@hyoperfiles.com.ar';
$asunto = 'Nuevo mensaje desde formulario HYO Perfiles';
$secretKey = '6LcQgJQrAAAAAF0KtMtdANIMqawJ_d_SsIi_p1nz'; 

function sanitize($v) {
    return str_replace(["\r", "\n"], '', htmlspecialchars(trim($v), ENT_QUOTES, 'UTF-8'));
}

// Validación reCAPTCHA
if (!isset($_POST['g-recaptcha-response'])) {
    header('Location: error.html');
    exit;
}

$captcha = $_POST['g-recaptcha-response'];
$remoteip = $_SERVER['REMOTE_ADDR'];

$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha&remoteip=$remoteip");
$response = json_decode($verify);

if (!$response->success) {
    header('Location: error.html');
    exit;
}

// Recolección y validación de campos
$nombre     = sanitize($_POST['nombre'] ?? '');
$apellido   = sanitize($_POST['apellido'] ?? '');
$metodo     = sanitize($_POST['contact_method'] ?? '');
$celular    = sanitize($_POST['celular'] ?? '');
$email      = sanitize($_POST['email'] ?? '');
$provincia  = sanitize($_POST['provincia'] ?? '');
$ciudad     = sanitize($_POST['ciudad'] ?? '');

if (!$nombre || !$apellido || !$metodo || !$celular || !$email || !$provincia || !$ciudad) {
    header('Location: error.html');
    exit;
}

// Armado del mensaje
$mensaje = "Nuevo mensaje desde formulario:\n\n";
$mensaje .= "Nombre: $nombre $apellido\n";
$mensaje .= "Contacto vía: $metodo\n";
$mensaje .= "Celular: $celular\n";
$mensaje .= "Email: $email\n";
$mensaje .= "Provincia: $provincia\n";
$mensaje .= "Ciudad: $ciudad\n";

$headers  = "From: $nombre <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($destinatario, $asunto, $mensaje, $headers)) {
    header('Location: gracias.html');
    exit;
} else {
    header('Location: error.html');
    exit;
}
?>
