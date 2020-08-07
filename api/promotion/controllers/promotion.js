'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
   /**
   * Create a record.
   *
   * @return {Object}
   */

    async create(ctx) {
        let entity;
        //Busca la marca asociada al usuario autenticado
        const [brand] = await strapi.services.brands.find({
            'user.id': ctx.state.user.id,
        });
        //Si no se encontro una marca entonces retorna error
        if (!brand) {
            return ctx.unauthorized(`You can't create this entry`);
        }
        //Si existen archivos en el request
        if (ctx.is('multipart')) {
            //Obtiene la data y los archios desde el request
            const { data, files } = parseMultipartData(ctx);            
            //Establece por defecto que la marca de la promocion sea la asociada al usuario autenticado
            data.brand = brand.id;
            //Crea la entidad con los datos y archivos
            entity = await strapi.services.promotion.create(data, { files });
        } else {
            //Establece por defecto que la marca de la promocion sea la asociada al usuario autenticado
            ctx.request.body.brand = brand.id;
            //Crea la entidad con los datos
            entity = await strapi.services.promotion.create(ctx.request.body);
        }
        //Registra la entidad
        return sanitizeEntity(entity, { model: strapi.models.promotion });
    },

    /**
     * Update a record.
     *
     * @return {Object}
     */
    async update(ctx) {
        //Obtiene el id del registro que se esta intentando actualizar
        const { id } = ctx.params;

        let entity;
        //Obtiene la promocion que tenga el id y su marca pertenezca al usuario autenticado
        const [promotion] = await strapi.services.promotion.find({
            id: ctx.params.id,
            'brand.user.id': ctx.state.user.id,
        });
        //Si no se encontro la promocion entonces retorna error
        if (!promotion) {
            return ctx.unauthorized(`You can't update this entry`);
        }
        //Si existen archivos en el request
        if (ctx.is('multipart')) {
            //Obtiene la data y los archios desde el request
            const { data, files } = parseMultipartData(ctx);
            //Establece por defecto que la marca de la promocion sea siempre la misma
            data.brand = promotion.brand.id;
            //Crea la entidad con los datos y archivos
            entity = await strapi.services.promotion.update({ id }, data, {
                files,
            });
        } else {
            //Establece por defecto que la marca de la promocion sea siempre la misma
            ctx.request.body.brand = promotion.brand.id;
            //Crea la entidad con los datos
            entity = await strapi.services.promotion.update({ id }, ctx.request.body);
        }
        //Registra la entidad
        return sanitizeEntity(entity, { model: strapi.models.promotion });
    },

    /**
     * Destroy a record.
     *
     * @return {Object}
     */
    async delete(ctx) {
        //Obtiene la promocion que tenga el id y su marca pertenezca al usuario autenticado
        const [promotion] = await strapi.services.promotion.find({
            id: ctx.params.id,
            'brand.user.id': ctx.state.user.id,
        });
        //Si no se encontro la promocion entonces retorna error
        if (!promotion) {
            return ctx.unauthorized(`You can't update this entry`);
        }
        const entity = await strapi.services.promotion.delete({ id: ctx.params.id });
        return sanitizeEntity(entity, { model: strapi.models.promotion });
    },
};
