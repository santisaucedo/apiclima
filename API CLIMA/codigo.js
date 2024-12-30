"use strict";

const latitud = document.getElementById("lat");
const longitud = document.getElementById("lon");
const ciudad = document.getElementById("ciudad");
const boton = document.getElementById("btn");
const tarjeta = document.querySelector(".contenedor-tarjeta");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(4);
      const lon = position.coords.longitude.toFixed(4);

      // Actualizar los valores de los inputs
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lon;

      console.log(`Latitud: ${lat}, Longitud: ${lon}`);
    },
    (error) => {
      console.error("Error al obtener la ubicación:", error.message);
      alert("No se pudo acceder a tu ubicación.");
    }
  );
} else {
  alert("Tu navegador no soporta la geolocalización.");
}


if (boton) {
  document.addEventListener("DOMContentLoaded", () => {
    boton.addEventListener("click", (e) => {
      let url = "https://api.openweathermap.org/data/2.5/weather?";
      let llave = "appid=9e122cd782b2d0333f5fe4e7fa192062";
      if (ciudad.value) {
        url += `q=${ciudad.value}&${llave}&lang=es`;
      } else if (latitud.value && longitud.value) {
        url += `lat=${latitud.value}&lon=${longitud.value}&${llave}&lang=es`;
      } else {
        alert("Por favor, ingresa una ciudad o coordenadas.");
        return;
      }

      axios
        .get(url)
        .then(function (response) {
          const fecha = new Date(response.data.dt * 1000);
          const temperaturaKelvin = response.data.main.temp;
          const temperaturaCelsius = temperaturaKelvin - 273.15;
          const fechaFormateada = fecha.toLocaleDateString("es-ES", {
            month: "long",
            day: "numeric",
          });


          const icono = response.data.weather[0].icon;
          const urlIcono = `https://openweathermap.org/img/wn/${icono}.png`;
          const clima = response.data.weather[0].main.toLowerCase();

          let imagenFondo;
          let colorBoton;
          let colorInput;
          let colorBack;
          let colorBorrar;
          let colorSonido;

          switch (clima) {
            case "clear":
              imagenFondo = "url('gif/sol.gif')";
              colorBoton = "btn-sol";
              colorBorrar = "btn-borrar";
              colorInput = "input-sol";
              colorBack = "card-sol";
              colorSonido = "btn-sonido-sol";
              break;
            case "clouds":
              imagenFondo = "url('gif/nubes3.gif')";
              colorBoton = "btn-nubes";
              colorInput = "input-nubes";
              colorBorrar = "btn-borrar";
              colorBack = "card-nubes";
              colorSonido = "btn-sonido-nubes";
              break;
            case "rain":
              imagenFondo = "url('gif/lluvia.gif')";
              colorBoton = "btn-lluvia";
              colorInput = "input-lluvia";
              colorBorrar = "btn-borrar";
              colorBack = "card-lluvia";
              colorSonido = "btn-lluvia-sol";
              break;
            case "snow":
              imagenFondo = "url('gif/nieve.gif')";
              colorBoton = "btn-nieve";
              colorInput = "input-nieve";
              colorBorrar = "btn-borrar";
              colorBack = "card-nieve";
              colorSonido = "btn-nieve-sol";
              break;
            case "wind":
            case "thunderstorm":
            case "mist":
            case "fog":
              imagenFondo = "url('gif/nubes.gif')";
              colorBoton = "btn-viento";
              colorInput = "input-viento";
              colorBack = "card-viento";
              colorBorrar = "btn-borrar";
              break;
            default:
              imagenFondo = "url('gif/sol.gif')";
              colorBoton = "btn-sol";
              colorInput = "input-sol";
              colorBorrar = "btn-borrar";
              colorBack = "card-sol";
              break;
          }



          // Aplicar clase al botón
          boton.className = `btn ${colorBoton}`;
          document.getElementById("btn-sonido").classList.remove('btn-sonido-sol', 'btn-sonido-nubes', 'btn-sonido-lluvia', 'btn-sonido-nieve', 'btn-sonido-viento');  // Elimina cualquier clase previa
          document.getElementById("btn-sonido").classList.add(colorSonido);  // Agrega la nueva clase

          // Aplicar clase a los inputs y textareas
          document.querySelectorAll("input, textarea").forEach((element) => {
            element.className = `input ${colorInput}`;
          });
          // Asegúrate de que solo seleccionas la tarjeta que quieres modificar
          const tarjeta = document.querySelector('.card');

          // Eliminar cualquier clase previa relacionada con el fondo
          tarjeta.classList.remove('card-sol', 'card-nubes', 'card-lluvia', 'card-nieve', 'card-viento');

          // Agregar la clase según el clima
          tarjeta.classList.add(colorBack);  // colorBack es la variable que contiene 'card-sol', 'card-nubes', etc.


          // Cambiar la clase del botón
          boton.className = `btn ${colorBoton}`;

          document.getElementById('btn-borrar').addEventListener('click', function () {
            // Obtener los campos del formulario
            const ciudad = document.getElementById('ciudad');
            const lat = document.getElementById('lat');
            const lon = document.getElementById('lon');
        
            // Limpiar los valores
            ciudad.value = '';
            lat.value = '';
            lon.value = '';
          });
          document.getElementById('btn-volumen').addEventListener('click', () => {
            const btnVolumen = document.getElementById('btn-volumen');
            const iconoVolumen = document.getElementById('btn-sonido'); 
            const isMuted = btnVolumen.classList.contains('muted');  
        
            // Si el sonido está apagado, lo activamos
            if (isMuted) {
                // Cambia el ícono a "encendido"
                iconoVolumen.src = "./icons/sonido.gif"; // Cambia por tu ícono de sonido encendido
                btnVolumen.classList.remove('muted');
                btnVolumen.classList.add('active');
        
                // Reproducir el sonido
                let tiempo = response.data.weather[0].description;
                let lugar = response.data.name;
                const message = new SpeechSynthesisUtterance(`Hoy es ${fechaFormateada}, ${lugar} el día de hoy el clima está con ${tiempo}, la temperatura es de ${temperaturaCelsius.toFixed(1)} grados Celsius`);
                speechSynthesis.speak(message);
        
            } else {
                // Si el sonido está activado, lo apagamos
                // Cambia el ícono a "apagado"
                iconoVolumen.src = "./icons/silencio.gif"; // Cambia por tu ícono de sonido apagado
                btnVolumen.classList.remove('active');
                btnVolumen.classList.add('muted');
        
                // Detener cualquier mensaje hablado (si hay alguno en progreso)
                speechSynthesis.cancel();
            }
        });
        
          
          // Aplicamos las propiedades de estilo adicionales al body
          document.body.style.display = "flex";
          document.body.style.alignItems = "center";
          document.body.style.justifyContent = "flex-start";
          document.body.style.backgroundColor = "#f0f4f8";
          document.body.style.fontFamily = "Arial, sans-serif";
          document.body.style.paddingRight = "30%";

          document.body.style.transition = "none";
          document.body.style.backgroundImage = "none";
          document.body.style.backgroundImage = imagenFondo;
          document.body.style.backgroundRepeat = "no-repeat";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundAttachment = "fixed";
          document.body.style.backgroundSize = "100hv 100hv";

          document.body.style.transition = "background-image 1s ease, background-size 1s ease";

          tarjeta.innerHTML = `
            <div class="card-header">
              <span>${response.data.name}<br>${response.data.sys.country}</span>
              <span>${fechaFormateada}</span>
            </div>
            <img src="gif/${clima}w.gif" alt="${clima}" class="weather-icon">
            <span class="temp">${temperaturaCelsius.toFixed(1)} °C</span>
            <div class="temp-scale">
              <span>Celsius</span>
            </div>`;




        })
        .catch(function (error) {
          console.log(error);
        });
    });
  });
}
