let NOMBRE_DE_ELLA = "";
let TU_NOMBRE = "";
let TEXTO_PERSONALIZADO = "";
let GENERO_ELEGIDO = "mujer";

const pantallaConfig = document.getElementById('pantalla-config');
const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaTituloGrande = document.getElementById('pantalla-titulo-grande');
const pantallaResultado = document.getElementById('pantalla-resultado');
const flecha = document.getElementById('flecha');
const contenedorArco = document.getElementById('contenedor-arco-horizontal');
const cuerdaDinamica = document.getElementById('cuerda-dinamica');
const corazonObjetivo = document.getElementById('corazon-objetivo');
const elementoTexto = document.getElementById('texto-dedicatoria');
const elementoFirma = document.getElementById('firma-att');
const audioTrack = document.getElementById('musica-fondo');

let arrastrando = false;
let startY = 0;
const LIMITE_TENSION = 45;

const coloresHojas = {
    "mujer": ['#ff758f', '#ff8fa3', '#ffb3c1', '#ffccd5', '#ff4d6d'],
    "hombre": ['#3a86c8', '#5bb0ff', '#93cdff', '#cbe5ff', '#1d639b']
};

const coloresConfeti = {
    "mujer": ['#ff758f', '#ffd166', '#06d6a0', '#118ab2'],
    "hombre": ['#3a86c8', '#4cc9f0', '#4895ef', '#72efdd']
};

window.onload = function() {
    const parametros = new URLSearchParams(window.location.search);
    const para = parametros.get('para');
    const de = parametros.get('de');
    const msg = parametros.get('msg');
    const gen = parametros.get('gen');

    if (para && de) {
        pantallaConfig.classList.add('oculto');
        pantallaJuego.classList.remove('oculto');
        
        NOMBRE_DE_ELLA = decodeURIComponent(para);
        TU_NOMBRE = decodeURIComponent(de);
        TEXTO_PERSONALIZADO = msg ? decodeURIComponent(msg) : "";
        GENERO_ELEGIDO = gen ? gen : "mujer";

        document.body.className = `tema-${GENERO_ELEGIDO}`;
        prepararTextosGenerales();
        cargarControladoresArco();
    }
};

function crearEnlaceCompartir() {
    const para = encodeURIComponent(document.getElementById('input-destino').value.trim());
    const de = encodeURIComponent(document.getElementById('input-remitente').value.trim());
    const msgInput = document.getElementById('input-dedicatoria').value.trim();
    const msg = msgInput ? encodeURIComponent(msgInput) : "";
    const gen = document.getElementById('select-genero').value;

    if (!para || !de) {
        alert("Por favor, llena los nombres para armar el link.");
        return;
    }

    const urlBase = window.location.href.split('?');
    let urlResultado = `${urlBase}?para=${para}&de=${de}&gen=${gen}`;
    if (msg) { urlResultado += `&msg=${msg}`; }

    const inputLink = document.getElementById('input-enlace-resultado');
    inputLink.value = urlResultado;
    document.getElementById('contenedor-enlace').classList.remove('oculto');
}

function prepararTextosGenerales() {
    textoAtt = `Att: ${TU_NOMBRE}`;
    if (TEXTO_PERSONALIZADO) {
        textoDedicatoria = TEXTO_PERSONALIZADO;
    } else {
        textoDedicatoria = `Te comparto este pequeño detalle interactivo para desearte un excelente día. Que Dios te derrame muchas bendiciones, salud y éxitos en la vida hoy y siempre.\n\nEspero que este nuevo año que empiezas llegue cargado de grandes oportunidades y aprendizajes en cada paso que des. No quería dejar pasar esta fecha especial sin enviarte un cordial saludo.\n\nQue la pases genial, que disfrutes al máximo cada momento de este día y que cada uno de tus proyectos, planes y metas se sigan cumpliendo con éxito. ¡Que vengan cosas grandiosas para ti! 🎉✨`;
    }
    audioTrack.src = "musica.mp3";
}

// --- ARCO HORIZONTAL CON TENSIÓN REAL (CORREGIDO) ---
function cargarControladoresArco() {
    contenedorArco.addEventListener('mousedown', (e) => {
        arrastrando = true;
        startY = e.clientY;
        flecha.style.transition = "none";
    });

    window.addEventListener('mousemove', (e) => {
        if (!arrastrando) return;
        let diffY = e.clientY - startY;
        if (diffY > 0) {
            if (diffY > LIMITE_TENSION) diffY = LIMITE_TENSION;
            // Tensa la flecha hacia abajo de manera horizontal lógica
            flecha.style.transform = `translateY(${diffY}px)`;
            cuerdaDinamica.setAttribute('d', `M 20,10 L 50,${10 + diffY * 0.8} L 80,10`);
        }
    });

    window.addEventListener('mouseup', () => {
        if (!arrastrando) return;
        arrastrando = false;
        
        cuerdaDinamica.setAttribute('d', "M 20,10 L 50,10 L 80,10");
        flecha.style.transition = "transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)";
        // Dispara la flecha hacia arriba al corazón en vertical limpio
        flecha.style.transform = "translateY(-300px)";

        setTimeout(() => {
            audioTrack.play().catch(() => console.log("Audio activo"));
            corazonObjetivo.style.transform = "scale(0) rotate(-45deg)";
            
            setTimeout(() => {
                pantallaJuego.classList.add('oculto');
                pantallaTituloGrande.classList.remove('oculto');
                
                // Ejecuta el título palabra por palabra
                animarTextoPalabraPorPalabra();
            }, 300);
        }, 100);
    });
}

// --- EFECTO PALABRA POR PALABRA (CORREGIDO) ---
function animarTextoPalabraPorPalabra() {
    const contenedor = document.getElementById('animacion-palabras');
    const fraseCompleta = `Happy Birthday ${NOMBRE_DE_ELLA}`;
    const palabras = fraseCompleta.split(' ');
    contenedor.innerHTML = "";

    palabras.forEach((palabra, index) => {
        const span = document.createElement('span');
        span.classList.add('palabra-animada');
        span.textContent = palabra;
        span.style.animationDelay = `${index * 0.4}s`; // Desfase temporal entre palabras
        contenedor.appendChild(span);
    });

    // Duración total de la pantalla roja y pase al árbol final
    setTimeout(() => {
        pantallaTituloGrande.classList.add('oculto');
        pantallaResultado.classList.remove('oculto');
        
        document.getElementById('titulo-cumple-mini').textContent = fraseCompleta;
        dibujarArbolCorazones();
        lanzarConfeti();
    }, palabras.length * 500 + 1200);
}

// --- MÁQUINA DE ESCRIBIR ---
function iniciarEfectoEscritura() {
    let i = 0;
    elementoTexto.innerHTML = "";
    
    function escribir() {
        if (i < textoDedicatoria.length) {
            if (textoDedicatoria.charAt(i) === '\n') {
                elementoTexto.innerHTML += "<br>";
            } else {
                elementoTexto.innerHTML += textoDedicatoria.charAt(i);
            }
            i++;
            setTimeout(escribir, 35);
        } else {
            elementoFirma.textContent = textoAtt;
            elementoFirma.style.opacity = "0";
            elementoFirma.classList.remove('oculto');
            setTimeout(() => { elementoFirma.style.opacity = "1"; }, 150);
        }
    }
    setTimeout(escribir, 100);
}

// --- ÁRBOL DE CORAZÓN ESTABLE (CORREGIDO) ---
function dibujarArbolCorazones() {
    const canvas = document.getElementById('arbol-canvas');
    const tronco = document.createElement('div');
    tronco.style.position = 'absolute';
    tronco.style.bottom = '0';
    tronco.style.left = '50%';
    tronco.style.width = '6px';
    tronco.style.height = '0px';
    tronco.style.backgroundColor = '#4a3b32';
    tronco.style.transition = 'height 1.4s ease-out';
    tronco.style.transform = 'translateX(-50%)';
    canvas.appendChild(tronco);

    setTimeout(() => {
        tronco.style.height = '140px';
        
        setTimeout(() => {
            for (let i = 0; i < 50; i++) {
                crearHojaCorazon(canvas);
            }
            setTimeout(iniciarEfectoEscritura, 1200);
        }, 1200);
    }, 150);
}

function crearHojaCorazon(contenedor) {
    const hoja = document.createElement('div');
    hoja.classList.add('hoja-arbol');
    
    const listaColores = coloresHojas[GENERO_ELEGIDO] || coloresHojas["mujer"];
    hoja.style.backgroundColor = listaColores[Math.floor(Math.random() * listaColores.length)];
    
    const angulo = Math.random() * Math.PI * 2;
    const radio = Math.random() * 45; 
    
    // Ecuación matemática exacta para formar la copa de un corazón fijo
    const x = 50 + (Math.cos(angulo) * radio * 1.2);
    const y = 100 - (Math.sin(angulo) * radio) - 55; 
    
    hoja.style.left = `${x}%`;
    hoja.style.bottom = `${y}px`;
    
    contenedor.appendChild(hoja);
    
    setTimeout(() => { 
        hoja.style.transform = `rotate(${Math.random() * 45}deg) scale(1)`; 
    }, Math.random() * 600);
}

function lanzarConfeti() {
    const contenedor = document.getElementById('contenedor-confeti');
    const listaConfeti = coloresConfeti[GENERO_ELEGIDO] || coloresConfeti["mujer"];
    
    for (let i = 0; i < 60; i++) {
        const pieza = document.createElement('div');
        pieza.classList.add('confeti-pieza');
        pieza.style.left = `${Math.random() * 100}vw`;
        pieza.style.backgroundColor = listaConfeti[Math.floor(Math.random() * listaConfeti.length)];
        pieza.style.animationDelay = `${Math.random() * 3.5}s`;
        contenedor.appendChild(pieza);
    }
}
