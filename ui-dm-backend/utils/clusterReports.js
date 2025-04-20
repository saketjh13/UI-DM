import Report from "../models/Report.js";

export const clusterReportsByLocation = async () => {
  try {
    const reports = await Report.find().populate("sender", "name email"); // or phone if you want that too


    if (!reports.length) return [];

    const clusters = [];

    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const toRad = (deg) => (deg * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    for (const report of reports) {
      let placed = false;

      for (const cluster of clusters) {
        const dist = haversine(
          cluster.center.latitude,
          cluster.center.longitude,
          report.latitude,
          report.longitude
        );

        if (dist < 2) {
          cluster.reports.push(report);
          cluster.center.latitude =
            (cluster.center.latitude * (cluster.reports.length - 1) + report.latitude) /
            cluster.reports.length;
          cluster.center.longitude =
            (cluster.center.longitude * (cluster.reports.length - 1) + report.longitude) /
            cluster.reports.length;
          placed = true;
          break;
        }
      }

      if (!placed) {
        clusters.push({
          groupName: `Group ${clusters.length + 1}`, // consistent naming
          center: {
            latitude: report.latitude,
            longitude: report.longitude,
          },
          reports: [report],
        });
      }
    }

    return clusters;
  } catch (err) {
    console.error("❌ Error in clusterReportsByLocation:", err);
    throw err;
  }
};
