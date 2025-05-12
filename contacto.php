<?php
// contacto.php

// Configura tu destinatario y asunto
$destinatario = 'tucorreo@dominio.com';
$asunto = 'Nuevo mensaje desde formulario HYO Perfiles';

// Función para sanitizar
function sanitize($v) {
    $v = trim($v);
    $v = stripslashes($v);
    $v = htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
    return str_replace(["\r", "\n"], '', $v);
}

// Recogida de datos
$nombre   = sanitize($_POST['nombre']   ?? '');
$apellido = sanitize($_POST['apellido'] ?? '');
$metodo   = sanitize($_POST['contact_method'] ?? '');
$celular  = sanitize($_POST['celular']  ?? '');
$email    = sanitize($_POST['email']    ?? '');
$prov     = sanitize($_POST['provincia'] ?? '');
$ciudad   = sanitize($_POST['ciudad']    ?? '');

// Construcción del mensaje
$mensaje = "Nuevo mensaje desde formulario:\n\n";
$mensaje .= "Nombre: $nombre $apellido\n";
$mensaje .= "Contacto vía: $metodo\n";
$mensaje .= "Celular: $celular\n";
$mensaje .= "Email: $email\n";
$mensaje .= "Provincia: $prov\n";
$mensaje .= "Ciudad: $ciudad\n";

// Cabeceras
$headers  = "From: $nombre <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Intento de envío
if ( mail($destinatario, $asunto, $mensaje, $headers) ) {
    // Éxito: redirige a gracias.html
    header('Location: gracias.html');
    exit;
} else {
    // Error: redirige a error.html
    header('Location: error.html');
    exit;
}
?>
