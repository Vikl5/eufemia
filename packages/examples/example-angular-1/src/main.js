/**
 * To showcase the usage of the dnb-ui-lib in Angular
 *
 */

import angular from 'angular';
import './ng-angular-module';

// Custom Eufemia import, instead of effecting the body reset with 'dnb-ui-lib/style'
import 'dnb-ui-lib/style/basis';
import 'dnb-ui-lib/style/components';
import 'dnb-ui-lib/style/themes/ui';

angular.module('app', ['uiModule']);
