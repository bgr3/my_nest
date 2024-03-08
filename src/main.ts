import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-settings';

const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);

  await app.listen(port);
}
bootstrap();

// const ngrok = require('ngrok');
// (async function () {
//   const url = await ngrok.connect({
//     //proto: 'http', // http|tcp|tls, defaults to http
//     addr: 3000, // port or network address, defaults to 80
//     //basic_auth: 'user:pwd', // http basic authentication for tunnel
//     //subdomain: 'alex', // reserved tunnel name https://alex.ngrok.io
//     authtoken: '2XNzHvZO39WOSPIWw0S82t8iGOh_6LqC2MqDsUT3dNUWkBnp6', // your authtoken from ngrok.com
//     //region: 'eu', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
//     //configPath: '~/git/project/ngrok.yml', // custom path for ngrok config file
//     //binPath: path => path.replace('app.asar', 'app.asar.unpacked'), // custom binary path, eg for prod in electron
//     //onStatusChange: status => {console.log(status)}, // 'closed' - connection is lost, 'connected' - reconnected
//     //onLogEvent: data => {}, // returns stdout messages from ngrok process
//   });
//   console.log(url);
// })();
