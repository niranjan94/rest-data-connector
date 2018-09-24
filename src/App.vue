<template>
  <div id="app">
    <notifications position="bottom right"/>
    <nav-bar/>
    <router-view class="router-view"/>
    <footer class="footer">
      <div class="container">
        <span class="text-muted">
          <font-awesome-icon :icon="['fas', 'globe']" />&nbsp;
          <a class="text-muted" href="https://niranjan.io" target="_blank">niranjan.io</a>
          <span class="separator">|</span>
          <font-awesome-icon :icon="['fab', 'github']" />&nbsp;
          <a class="text-muted" href="https://github.com/niranjan94/rest-data-connector" target="_blank">niranjan94/rest-data-connector</a>
          <span class="separator">|</span>
          Open sourced under the <a class="text-muted" href="https://www.gnu.org/licenses/gpl-3.0.txt" target="_blank">GNU General Public License v3.0</a>
        </span>
        <small class="text-muted" style="float: right; text-decoration: none; font-weight: 300;">
          Version: {{version}}
        </small>
      </div>
    </footer>
  </div>
</template>

<script>
    import NavBar from './components/NavBar';
    import packageJson from '../package';

    export default {
        components : { NavBar },
        name       : 'app',
        data() {
          return {
            version: packageJson.version
          }
        }
    };
</script>

<style>

  #app {

  }

  html {
    position: relative;
    min-height: 100%;
  }
  body {
    /* Margin bottom by footer height */
    margin-bottom: 60px;
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    /* Set the fixed height of the footer here */
    height: 60px;
    line-height: 60px; /* Vertically center the text there */
    background-color: #f5f5f5;
  }

  .router-view {
    margin-top: 56px;
    padding-bottom: 20px;
  }

  * {
    font-family: 'Lato', sans-serif;
  }

  .form-group {
    margin-bottom: 4px;
  }

  label:not(.custom-control-label) {
    font-weight: 600 !important;
  }

  label span {
    font-weight: 400 !important;
  }

  .separator {
    padding: 0 6px;
  }

</style>
