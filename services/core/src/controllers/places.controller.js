const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const Place = require('../models/place.model');
const service = require('../config/settings.config');
const codes = require('../assets/codes.asset');
const rp = require('request-promise');

/**
 * @description Creates a Place
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.create = (req, res, next) => {

  const input = req.body['input'];

  if (!input) return next(errorHelper.prepareError(codes.PLACE.MISSING));
  if (!input.name) return next(errorHelper.prepareError(codes.PLACE.NAME.MISSING));

  Place.findOne({ name: input.name }).exec()
      .then(place => {
        if (place) return next(errorHelper.prepareError(codes.PLACE.DUPLICATE));
        const newPlace = new Place({ name: input.name, createdBy: req.user._id, updatedBy: req.user._id });

        newPlace.save().then(() => {
          res.json({ response: codes.PLACE.CREATED });
        }).catch(error => {
          return next(errorHelper.prepareError(error));
        });
      })
      .catch(error => {
        return next(errorHelper.prepareError(error));
      });

};

/**
 * @description Lists Place(s)
 * @param req
 * @param res
 * @param next
 */
exports.get = (req, res, next) => {

  const id = req.params['id'];
  const query = !!id ? { _id: id } : {};

  Place.find(query).exec()
      .then(places => {

        if (places.length === 0 && id) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
        if (places.length === 0 && !id) return next(errorHelper.prepareError(codes.PLACE.NULL_FOUND));

        places = Boolean(req.query['show-all']) ? places : places.filter(place => place.name !== '(unavailable place)');

          // options
          delete req.headers['content-type'];
          delete req.headers['content-length'];
          req.headers['x-bypass'] = service.root.secret;
          const options = {
              uri: `http://${service.root.host}:${service.root.port}/api/users?show-all=true`,
              json: true,
              resolveWithFullResponse: true,
              method: 'GET',
              headers: req.headers
          };

          rp(options).then(response => {
              const users = response.body.output;
              if (users.length === 0) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID)); // this shouldn't happen

              const fin = [];

              // define deletedUserIndex (should always be in database)
              const deletedUserIndex = users.findIndex(obj => obj.username === 'deletedUser');
              if (deletedUserIndex === -1) console.error(`NO '(deleted user)' user defined!`);

              places.forEach(place => {
                  place = place.toObject();

                  // extend 'createdBy' field
                  const createdByIndex = users.findIndex(obj => obj._id.toString() === place.createdBy.toString());
                  place.createdBy = createdByIndex >= 0 ? users[createdByIndex] : users[deletedUserIndex];

                  // extend 'updatedBy' field
                  const updatedByIndex = users.findIndex(obj => obj._id.toString() === place.updatedBy.toString());
                  place.updatedBy = updatedByIndex >= 0 ? users[updatedByIndex] : users[deletedUserIndex];

                  fin.push(place);
              });

              res.json({ response: sysCodes.RESOURCE.LOADED, output: fin });

          }).catch(error => {
              return next(errorHelper.prepareError(error));
          });

      })
      .catch(error => {
        return next(errorHelper.prepareError(error));
      });

};

/**
 * @description Update a Place
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.update = (req, res, next) => {

  const id = req.params['id'];
  const update = req.body['input'];

  if (!update) return next(errorHelper.prepareError(codes.PLACE.MISSING));
  if (!update.name) return next(errorHelper.prepareError(codes.PLACE.NAME.MISSING));

  Place.findOne({ _id: id }).exec()
      .then(place => {
          if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));

          Place.findOne({ name: update.name, _id: { $ne: place._id } }).exec()
              .then(duplicate => {
                  if (duplicate) return next(errorHelper.prepareError(codes.PLACE.DUPLICATE));

                  place.update(update, { runValidators: true }).then(() => {
                      res.json({ response: codes.PLACE.UPDATED });
                  }).catch(error => {
                      return next(errorHelper.prepareError(error));
                  });
              }).catch(error => {
                  return next(errorHelper.prepareError(error));
              });
      })
      .catch(error => {
        return next(errorHelper.prepareError(error));
      });

};

/**
 * @description Deletes a Place
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const id = req.params['id'];

    Place.findOne({ _id: id }).exec()
        .then(place => {

            // Find all occurrences of this place in matches
            if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
            const Match = require('../models/match.model');

            Match.find({ place: place._id }).exec()
                .then(matches => {
                    const promises = [];

                    // Replace it with default '(unavailable place)' place
                    Place.findOne({ name: '(unavailable place)' }).exec()
                        .then(defaultPlace => {
                        return new Promise((resolve, reject) => {

                          // If it doesn't exist yet, create it
                          if (!defaultPlace) {
                              new Place({ name: '(unavailable place)' }).save().then(defPlace => {
                                resolve(defPlace);
                              }).catch(error => { reject(error) });
                          } else { resolve(defaultPlace) }

                        });
                        }).then(defaultPlace => {

                          matches.forEach(match => {
                              const promise = new Promise((resolve, reject) => {
                                  match.place = defaultPlace._id;
                                  match.save().then(() => resolve()).catch(error => reject(error));
                              });
                              promises.push(promise);
                          });

                        })
                        .catch(error => {
                          return next(errorHelper.prepareError(error));
                        });

                    Promise.all(promises).then(() => {
                        place.remove().then(() => {
                            res.json({ response: codes.PLACE.DELETED });
                        }).catch(error => {
                            return next(errorHelper.prepareError(error));
                        });
                    }).catch(error => {
                        return next(errorHelper.prepareError(error));
                    });
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};
