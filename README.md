# MappaCovid

Visualizzazione dei dati riguardanti il Covid-19 in Italia.

Tecnologie implementate:
Angular 9
RxJS 6
API Google Maps

Demo
http://www.mappacovid.it


## Installazione

Per installare, digitare `npm install`.

## Caricamento delle API

- Innanzitutto segui [questi step](https://developers.google.com/maps/gmp-get-started) per ottenere una API Key che può essere utilizzata per caricare Google Maps.
- Carica le [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API) nell' index.html.

## Esempio

```html
<!-- index.html -->
<!doctype html>
<head>
  ...
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY">
  </script>
</head>
```
