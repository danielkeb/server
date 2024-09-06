import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        // const clientId = process.env.CLIENT_ID;
        // const clientSecret = process.env.CLIENT_SECRET;
        // const refreshToken = process.env.REFRESH_TOKEN;
        // const redirectUri = process.env.REDIRECT_URI;
        const senderEmail = process.env.SENDER_EMAIL;

        // const oAuth2Client = new google.auth.OAuth2(
        //   clientId,
        //   clientSecret,
        //   redirectUri,
        // );

        // let accessToken;

        // await new Promise((resolve, reject) => {
        //   oAuth2Client.getAccessToken((err, token) => {
        //     if (err) {
        //       console.log(err);

        //       reject('Failed to create access token');
        //     }
        //     resolve(token);
        //   });
        // })
        //   .then((result) => {
        //     accessToken = result;
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        return {
          transport: {
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: senderEmail,
              // clientId: clientId,
              // clientSecret: clientSecret,
              // refreshToken: refreshToken,
              // accessToken: process.env.ACCESS_TOKEN,
            },
          },
          defaults: {
            from: `"No Reply" ${process.env.SENDER_EMAIL}`,
          },
          template: {
            dir: join(process.cwd(), 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
