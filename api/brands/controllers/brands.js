'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    async update(ctx) {
        const { id } = ctx.params;
    
        let entity;
    
        const [brand] = await strapi.services.brands.find({
          id: ctx.params.id,
          'user.id': ctx.state.user.id,
        });
    
        if (!brand) {
          return ctx.unauthorized(`You can't update this entry`);
        }
    
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          entity = await strapi.services.brands.update({ id }, data, {
            files,
          });
        } else {
          entity = await strapi.services.brands.update({ id }, ctx.request.body);
        }
    
        return sanitizeEntity(entity, { model: strapi.models.brands });
    },
};
