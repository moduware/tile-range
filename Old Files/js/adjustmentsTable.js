var laserDistanceAdjustmentsTable = {
  batpaqSize: 0.088, // 0.088m = 8.8cm = 88mm
};
laserDistanceAdjustmentsTable.batpaqBack = {
  1: +0.033, // 0.033m = 3.3cm = 33mm
  2: +0.008, // 0.008m = 0.8cm = 8mm
  3: +0.008, // 0.008m = 0.8cm = 8mm
  4: +0.033  // 0.033m = 3.3cm = 33mm
};
laserDistanceAdjustmentsTable.batpaqFront = {
  1: +0.033 - laserDistanceAdjustmentsTable.batpaqSize, // 0.033m = 3.3cm = 33mm
  2: +0.008 - laserDistanceAdjustmentsTable.batpaqSize, // 0.008m = 0.8cm = 8mm
  3: +0.008 - laserDistanceAdjustmentsTable.batpaqSize, // 0.008m = 0.8cm = 8mm
  4: +0.033 - laserDistanceAdjustmentsTable.batpaqSize  // 0.033m = 3.3cm = 33mm
};