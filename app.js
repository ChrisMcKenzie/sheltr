import 'source-map-support/register';
import debug from 'debug';
import app from './src/webserver';

global.__base = __dirname;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), () => {
  debug('sheltr')('Express server listening on port ' +
                  server.address().port);
});
