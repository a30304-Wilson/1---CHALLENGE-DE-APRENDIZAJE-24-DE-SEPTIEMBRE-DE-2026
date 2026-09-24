# Agenda Tech

Web estática con una agenda de eventos tecnológicos (conferencias, talleres y meetups sobre IA, cloud, ciberseguridad, desarrollo web, datos y open source). Está alojada en Amazon S3 con la función de sitio web estático.

Los eventos que aparecen son ficticios y sirven como contenido de ejemplo.

## Qué puede hacer el usuario

- Ver los eventos en una cuadrícula de tarjetas que se adapta a escritorio y móvil.
- Consultar la cuenta atrás hasta el próximo evento.
- Filtrar los eventos por tema.
- Buscar por nombre de evento o ciudad.
- Marcar una plaza como reservada (solo cambia el botón en pantalla, no se guarda nada).

## Estructura del proyecto

| Archivo | Función |
|---|---|
| `index.html` | Estructura de la página |
| `styles.css` | Estilos y diseño responsive |
| `app.js` | Datos de los eventos, filtros, búsqueda y cuenta atrás |
| `main.tf` | Infraestructura en AWS con Terraform |
| `policy.json` | Política de bucket que permite la lectura pública de los archivos |
| `EVIDENCIA.md` | Evidencias del despliegue |

## Tecnologías

- HTML, CSS y JavaScript, sin frameworks ni dependencias.
- Amazon S3 (alojamiento de sitio web estático).
- Terraform y AWS CLI para crear y configurar la infraestructura.
- Git y GitHub para el control de versiones.

## Despliegue

Se usa el bucket `web-estatica-challenge1-wilson` en la región `us-east-1`.

1. Crear el bucket.
2. Desactivar el bloqueo de acceso público:
   ```bash
   aws s3api put-public-access-block \
     --bucket web-estatica-challenge1-wilson \
     --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
   ```
3. Aplicar la política de lectura pública:
   ```bash
   aws s3api put-bucket-policy \
     --bucket web-estatica-challenge1-wilson \
     --policy file://policy.json
   ```
4. Activar el sitio web estático:
   ```bash
   aws s3 website s3://web-estatica-challenge1-wilson/ --index-document index.html
   ```
5. Subir los archivos de la web:
   ```bash
   aws s3 sync . s3://web-estatica-challenge1-wilson/ \
     --exclude "*" --include "index.html" --include "styles.css" --include "app.js"
   ```

## Acceso

http://web-estatica-challenge1-wilson.s3-website-us-east-1.amazonaws.com

El endpoint de sitio web de S3 solo funciona con `http://`. Para usar HTTPS haría falta añadir CloudFront.

## Notas

- El archivo `terraform.tfstate` y la carpeta `.terraform/` no se suben al repositorio (ver `.gitignore`).
- El entorno de AWS Academy Learner Lab aplica restricciones que pueden bloquear algunas acciones de S3 desde Terraform.
