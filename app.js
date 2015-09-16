/*
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import debug from 'debug';
import app from './src/webserver';

global.__base = __dirname;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), () => {
  debug('sheltr')('Express server listening on port ' +
                  server.address().port);
});
