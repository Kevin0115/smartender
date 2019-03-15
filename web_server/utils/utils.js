exports.calcDistance = function(srcLat, srcLong, destLat, destLong) {
  if (!srcLat || !srcLong || !destLat || !destLong) {
    return 'unknown';
  }

  const R = 6371; // Radius of the earth in km
  const dLat = _deg2rad(destLat - srcLat);  // _deg2rad below
  const dLon = _deg2rad(destLong - srcLong); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(_deg2rad(srcLat)) * Math.cos(_deg2rad(destLat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km

  return Number.parseFloat(d).toPrecision(2);

  // return (d < 1) ?
  //   Number.parseFloat(d*1000).toPrecision(3) + 'm' :
  //   Number.parseFloat(d).toPrecision(2) + 'km';
}

_deg2rad = (deg) => {
  return deg * (Math.PI/180);
}

// Avg human walking speed - 5kmh