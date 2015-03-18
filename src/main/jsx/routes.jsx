var React = require('react');
var Router = require('react-router'); 
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Constants = require('./Constants');
var Main = require('./components/Main');

module.exports = (
  <Route name="radar-scope" path={Constants.ROOT_PATH}>
    <Route name="radarScope" path="radarScope" handler={Main}/>
    <Route name="radarScopeYM" path="radarScope/:yearMonth" handler={Main}/>
    <Route name="radarScopeCategory" path="radarScope/category/:categoryId/:yearMonth" handler={Main}/>
    <DefaultRoute handler={Main} />
  </Route>
);
