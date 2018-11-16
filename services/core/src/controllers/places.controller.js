const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const Place = require('../models/place.model');
const codes = require('../assets/codes.asset');

exports.addPlace = (req, res, next) => {

  const input = req.body['input'];

  if (!input) return next(errorHelper.prepareError(codes.PLACE.MISSING));
  if (!input.name) return next(errorHelper.prepareError(codes.PLACE.NAME.MISSING));

  Place.findOne({ name: input.name }).exec()
      .then(place => {
        if (place) return next(errorHelper.prepareError(codes.PLACE.DUPLICATE));
        const newPlace = new Place({ name: input.name });

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

exports.getPlaces = (req, res, next) => {

  const id = req.params['id'];
  const query = !!id ? { _id: id } : {};

  Place.find(query).exec()
      .then(places => {

        if (places.length === 0 && id) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
        if (places.length === 0 && !id) return next(errorHelper.prepareError(codes.PLACE.NULL_FOUND));
        res.json({ response: sysCodes.RESOURCE.LOADED, output: places });

      })
      .catch(error => {
        return next(errorHelper.prepareError(error));
      });

};

exports.updatePlace = (req, res, next) => {

  const id = req.params['id'];
  const update = req.body['place'];

  if (!update) return next(errorHelper.prepareError(codes.PLACE.MISSING));
  if (!update.name) return next(errorHelper.prepareError(codes.PLACE.NAME.MISSING));

  Place.findOne({ _id: id }).exec()
      .then(place => {
          if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));

          Place.findOne({ name: update.name, _id: { $ne: place._id } }).exec()
              .then(duplicate => {
                  if (duplicate) return next(errorHelper.prepareError(codes.PLACE.DUPLICATE));

                  place.update(update).then(() => {
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

exports.deletePlace = (req, res, next) => {

    const id = req.params['id'];

    Place.findOne({ _id: id }).exec()
        .then(place => {

            // Find all occurrences of this place in matches
            if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
            const Match = require('../models/match.model');

            Match.find({ place: place._id }).exec()
                .then(matches => {
                    const promises = [];

                    // Replace it with default 'Unavailable Place' place
                    Place.findOne({ name: 'Unavailable Place' }).exec()
                        .then(defaultPlace => {
                        return new Promise((resolve, reject) => {

                          // If it doesn't exist yet, create it
                          if (!defaultPlace) {
                              new Place({ name: 'Unavailable Place' }).save().then(defPlace => {
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

exports.getAllPlaces = (req, res, next) => {
    Place.find({}).exec()
        .then(place => {
            res.json({ status: sysCodes.RESOURCE.LOADED, response: place })
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });
}