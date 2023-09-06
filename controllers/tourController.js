const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

//GET TOUR 1️☝️
exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour) {
    return res.status(404).json({ status: 'Failed', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

//CREATE TOUR 🖖
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

//UPDATE TOUR 👌
exports.updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour) {
    return res.status(404).json({
      staus: 'Failed',
      message: 'Invalid ID',
    });
  }

  const otherTours = tours.filter((tour) => tour.id !== +id);
  const request = req.body;

  if (!request)
    res.status(500).json({
      status: 'Failed',
      message: 'Internal Server Error',
    });

  const modification = { ...tour, ...request };

  const newTourObject = [...otherTours, modification];

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTourObject),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: { tour: modification },
      });
    }
  );
};

//DELETE TOUR ✌️
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const tourIndex = tours.findIndex((tour) => tour.id === +id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  tours.splice(tourIndex, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};
