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
      <not-tableau-alert/>
      <b-card-group v-for="(supportedSpecs, index) in chunkedSupportedSpecs" deck :key="index" class="mb-3">
        <b-card v-for="spec in supportedSpecs"
                :key="spec.identifier"
                :header="spec.title"
                class="text-center"
                :class="{clickable: spec.enabled, 'text-muted': !spec.enabled, 'not-clickable': !spec.enabled}"
                @click="spec.enabled ? open(spec.link) : open()">
          <p class="card-text">
            {{spec.description}}
          </p>
          <p class="card-text" v-if="!spec.enabled">
            <small>~ Coming soon ~</small>
          </p>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
  import router from '../router';
  import NotTableauAlert from './NotTableauAlert';
  import { supportedSpecs } from '../utils/specs';
  import { chunk } from 'lodash-es';

  export default {
    components : { NotTableauAlert },
    name       : 'Dashboard',
    data() {
      return {
        chunkedSupportedSpecs: chunk(supportedSpecs, 3)
      };
    },
    methods: {
      open(link) {
        if (!link) {
          return;
        }
        router.push(link);
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
