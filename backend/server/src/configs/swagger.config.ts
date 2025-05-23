import { DocumentBuilder } from '@nestjs/swagger';
import { setDescriptionDocumentBuilder } from '../shared/utils/swagger.util';
export const SwaggerConfig = {
  configDocumentBuilder: new DocumentBuilder()
    .setTitle('Manga API')
    .setDescription(setDescriptionDocumentBuilder())
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth(
      'client-id',
      {
        type: 'apiKey',
        description: `Specifies the Client ID used for API authentication. This Client ID will be applied globally across all API endpoints where authentication is required.
          If you do not provide a client id, the system will default you to a guest. `,
      },
      'client-id',
    )

    .addGlobalParameters({
      name: 'x-client-id',
      in: 'header',
      description: 'You can override client-id here',
    })
    .build(),

  SwaggerCustomOptions: {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true, // Ensures tokens persist after a page refresh
      requestInterceptor: (request) => {
        // Check if the user has entered an API key
        // const apiKey = document.cookie
        //   .split('; ')
        //   .find((row) => row.startsWith('client-id='))
        //   ?.split('=')[1];
        try {
          const authorized = localStorage.getItem('authorized')
            ? JSON.parse(localStorage.getItem('authorized'))
            : '';
          if (authorized && authorized['client-id']) {
            const clientId = authorized['client-id']['value'];
            request.headers['x-client-id'] =
              request.headers['x-client-id'] || clientId;
          }
        } catch (error) {
          console.log(error);
        }
        return request;
      },
      defaultModelsExpandDepth: 10, // Controls how models expand in the UI
      defaultModelExpandDepth: 10, // Expand schema properties by default
    },
  },
};
