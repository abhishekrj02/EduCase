const School = require("../models/School");

exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (
      !name ||
      !address ||
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const existingSchool = await School.findOne({ name: name.trim() });
    if (existingSchool) {
      return res
        .status(409)
        .json({ error: "School with this name already exists" });
    }

    const school = new School({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    await school.save();
    res.status(201).json({ message: "School added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.listSchools = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }
    const schools = await School.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [userLon, userLat] },
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          location: 1,
          distance: 1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      message: "success",
      schools: schools,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
