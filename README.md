# Agenda Tech

Web estática con una agenda de eventos tecnológicos (conferencias, talleres y meetups sobre IA, cloud, ciberseguridad, desarrollo web, datos y open source). Está alojada en Amazon S3 con la función de sitio web estático y su infraestructura se define con Terraform.

Los eventos que aparecen son ficticios y sirven como contenido de ejemplo.

- **URL de la web:** http://web-estatica-challenge1-wilson.s3-website-us-east-1.amazonaws.com
- **Bucket:** `web-estatica-challenge1-wilson`
- **Región:** `us-east-1`

El endpoint de sitio web de S3 solo funciona con `http://`. Para usar HTTPS haría falta añadir CloudFront.

## Estructura del repositorio

```
.
├── index.html              # Web
├── styles.css              # Web
├── app.js                  # Web
├── main.tf                 # Terraform
├── .terraform.lock.hcl     # Terraform
├── policy.json             # Política de bucket (AWS)
├── EVIDENCIA.md            # Evidencia de consola
├── README.md
└── .gitignore
```

## 1. Archivos de la web

Son los tres archivos mínimos de la página. Se suben al bucket de S3.

| Archivo | Función |
|---|---|
| `index.html` | Estructura de la página: cabecera, bloque del próximo evento, filtros, listado de eventos y pie |
| `styles.css` | Estilos y diseño responsive (cuadrícula de columnas que se adapta a escritorio y móvil) |
| `app.js` | Datos de los eventos, filtro por tema, búsqueda por nombre o ciudad, reserva de plaza y cuenta atrás |

Qué puede hacer el usuario en la web:

- Ver los eventos en una cuadrícula de tarjetas.
- Consultar la cuenta atrás hasta el próximo evento.
- Filtrar por tema y buscar por nombre de evento o ciudad.
- Marcar una plaza como reservada (solo cambia el botón en pantalla, no se guarda nada).

Tecnologías: HTML, CSS y JavaScript, sin frameworks ni dependencias.

## 2. Archivos de Terraform e infraestructura

Definen y configuran los recursos de AWS. **No** se sirven como parte de la web.

| Archivo | Función |
|---|---|
| `main.tf` | Proveedor de AWS (`us-east-1`) y recurso `aws_s3_bucket` que crea el bucket |
| `.terraform.lock.hcl` | Fija la versión del provider de AWS para que el despliegue sea reproducible |
| `policy.json` | Política de bucket que da lectura pública (`s3:GetObject`) a los objetos del bucket |

Comandos de Terraform:

```bash
terraform init
terraform plan
terraform apply
```

No se suben al repositorio (ver `.gitignore`): la carpeta `.terraform/` y los archivos `terraform.tfstate*`, porque pesan mucho y pueden contener datos sensibles.

## 3. Evidencia de consola

| Archivo | Contenido |
|---|---|
| `EVIDENCIA.md` | Comandos ejecutados en la consola y su resultado, que demuestran el despliegue |

Los comandos que se documentan como evidencia:

[Ver evidencia de consola](evidencia.md)

## Despliegue

1. Crear el bucket (con `terraform apply` o con `aws s3api create-bucket`).
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
5. Subir solo los archivos de la web:
   ```bash
   aws s3 sync . s3://web-estatica-challenge1-wilson/ \
     --exclude "*" --include "index.html" --include "styles.css" --include "app.js"
   ```

## Notas

- El entorno de AWS Academy Learner Lab aplica restricciones (service control policies) que pueden bloquear algunas acciones de S3 desde Terraform, como la lectura de la configuración de object lock.
- Los pasos 2 a 5 deben ejecutarse en ese orden: la política pública se rechaza si el bloqueo de acceso público sigue activo.
