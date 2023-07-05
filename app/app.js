import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'umla/config/environment';
import NavBar from '../umla/components/nav-bar';
import ControlBar from '../umla/components/control-bar';
/*import { inject as service } from '@ember/service';
import 'ember-router-service/instance-initializers/router-service';
*/
export default class App extends Application {
  //@service router;
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
