import Report from "../models/Report.js";

const EARTH_RADIUS_KM = 6371;

// Optional: Haversine function if manual distance needed
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

// Group logic: find and relate nearby reports
export const groupNearbyReports = async (report) => {
  try {
    if (
      !report.location ||
      !report.location.coordinates ||
      report.location.coordinates.length !== 2
    ) {
      console.error("Missing or invalid coordinates in report:", report._id);
      return;
    }

    const [lng, lat] = report.location.coordinates;
    const radiusInMeters = 500; // You can adjust this radius

    const nearbyReports = await Report.find({
      _id: { $ne: report._id },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radiusInMeters,
        },
      },
    });

    console.log(`Found ${nearbyReports.length} nearby reports for report ${report._id}`);

    // Example: Assign a groupId (you could generate a hash, cluster ID, or assign the earliest report's ID as groupId)
    // This part is optional and based on whether you want to persist the group.
    const groupId = report._id; // Or generate a shared groupId
    await Promise.all(
      nearbyReports.map(r =>
        Report.findByIdAndUpdate(r._id, { groupId }, { new: true })
      )
    );

  } catch (error) {
    console.error("Error in groupNearbyReports:", error);
  }
};
