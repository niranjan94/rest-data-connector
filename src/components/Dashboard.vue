<template>
  <div>
    <section class="jumbotron text-center" style="padding: 2rem 2rem;">
      <div class="container">
        <h2 class="jumbotron-heading" style="font-weight: 100">Authenticate. Connect. Explore.</h2>
        <p class="lead text-muted">
          Bring the data that you care about from any REST JSON API source into Tableau.<br>Makes working with APIs on tableau a breeze.
        </p>
      </div>
    </section>
    <div class="container">
      <b-card-group deck class="mb-3">
        <b-card header="Generic REST API" class="text-center clickable" @click="open('rest')">
          <p class="card-text">
            Connect to any REST API Service that provides a JSON (JavaScript Object Notation) response.
          </p>
        </b-card>
        <b-card header="Swagger 2.0" class="text-center clickable" @click="open('swagger_2')">
          <p class="card-text">
            Swagger&trade; is a project used to describe and document RESTful APIs.
            The Swagger specification defines a set of files required to describe such an API.
          </p>
        </b-card>
        <b-card header="Open API 3.0"  class="text-muted text-center not-clickable">
          <p class="card-text">The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to RESTful APIs </p>
          <p class="card-text">
            <small>~ Coming soon ~</small>
          </p>
        </b-card>
      </b-card-group>
      <b-card-group deck class="mb-3">
        <b-card header="API Blueprint" class="text-muted text-center not-clickable">
          <p class="card-text">
            API Blueprint is a powerful high-level API description language for web APIs. API Blueprint is simple and accessible to everybody involved in the API lifecycle.
          </p>
          <p class="card-text">
            <small>~ Coming soon ~</small>
          </p>
        </b-card>
        <b-card header="Swagger 1.0" class="text-muted text-center not-clickable">
          <p class="card-text">
            The initial release of the Swagger (currently known as the OpenAPI) specification.
          </p>
          <p class="card-text">
            <small>~ Coming soon ~</small>
          </p>
        </b-card>
        <b-card header="RAML"  class="text-muted text-center not-clickable">
          <p class="card-text">
            RESTful API Modeling Language is a YAML-based language for describing RESTful APIs. It provides all the information necessary to describe RESTful or practically RESTful APIs
          </p>
          <p class="card-text">
            <small>~ Coming soon ~</small>
          </p>
        </b-card>
      </b-card-group>

    </div>

  </div>
</template>

<script>
  import router from '../router';

  export default {
    name: 'Dashboard',
    data() {
      return {};
    },
    methods: {
      open(what) {
        switch (what) {
          case 'swagger_2':
            router.push('api-explorer');
            break;
        }
      }
    }
  };
</script>

<style scoped>
  .card.clickable {
    cursor: pointer;
    transition: background-color 100ms linear;
  }

  .card.clickable:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  .card.not-clickable {
    cursor: not-allowed;
  }

</style>
