<h1><img src="https://res.cloudinary.com/niranjan94/image/upload/rdc_logo_dark.png" width="37" />&nbsp;REST Data Connector</h1>

> A REST API Data Connector for Tableau with Swagger 2.0 support

<img src="https://res.cloudinary.com/niranjan94/image/upload/bo_1px_solid_rgb:d0d0d0/rdc_without_browser.png"/>

### Prerequisites

- Node.js (8.x LTS recommended) - [Download](https://nodejs.org/en/download/).
- _(For production)_ - [Tableau Server](https://www.tableau.com/products/server) / [Tableau Desktop](https://www.tableau.com/products/desktop) / [Tableau Online](https://www.tableau.com/products/cloud-bi)
- _(For development)_ - [Tableau Web Data Connector SDK](https://tableau.github.io/webdataconnector/)

### Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build
```

### To-Do

- Move network request for the data to the data gathering phase of the WDC.
- Add authentication support via WDC Auth flow for supported authentication types.
- Support all REST methods in API Explorer too.
- Support sending requests via a CORS proxy (Eg. cors.io, cors-anywhere).
- Support file upload i/o URL for API specifications.

### Further Reading / Useful Links

* [Vue.js](https://vuejs.org)
* [Vue.js webpack](http://vuejs-templates.github.io/webpack/)
* [Vue loader](http://vuejs.github.io/vue-loader/)
* Development Browser Extensions
  * [Vue.js devtools for chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  * [Vue.js devtools for firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### License

```
REST API Data Connector for Tableau
Copyright (C) 2017 Niranjan Rajendran

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

> To obtain the software under a different license, Please contact the developer at [me@niranjan.io](mailto:me@niranjan.io).
 
