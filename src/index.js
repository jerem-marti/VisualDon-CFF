import { importGtfs } from 'gtfs';

/*
fetch("./data/config.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.error("Error loading JSON file", error));
*/

const rawConfig = '{"agencies":[{"url":"https://opentransportdata.swiss/en/dataset/timetable-2024-gtfs2020/resource_permalink/gtfs_fp2024_2024-04-22_08-54.zip","realtimeUrls":["https://api.opentransportdata.swiss/gtfsrt2020"],"realtimeHeaders":{"Authorization":"57c5dbbbf1fe4d000100001842c323fa9ff44fbba0b9b925f0c052d1"}}]}'

try {
  const config = JSON.parse(rawConfig);
  console.log(config)
}
catch (error) {
  console.log('Error parsing JSON:', error, config);
}

await importGtfs(config);
//console.log(config);

/*
try {
  console.warn("START IMPORT");
  await importGtfs(config);
  console.warn("END IMPORT");
} catch (error) {
  console.error(error);
}
*/
