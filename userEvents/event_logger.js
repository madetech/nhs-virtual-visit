var AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
var dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

//When passing --data multiple times you'll just get event as an array
//We then map this to streamName, eventType, id, correlationId, dateTime, event
//We only need to specify streamName, eventType, correlationId, event
exports.lambda_entry = async function (event, context) {
  if (event.length !== 4) {
    console.log(
      "EVENT: This lambda requires 4 arguments: streamName, eventType, correlationId, event"
    );
  }
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  console.log("EVENT: \n" + JSON.stringify(context, null, 2));
  await log_event(dynamodb, event[0], event[1], event[2], event[3], event[4]);
  return "HELLO WORLD"; //context.logStreamName
};

async function log_event(db, stream_name, event_type, correlation_id, event) {
  var params = {
    TableName: "visitEvents1",
    Item: {
      stream_name: { S: stream_name },
      created_on: { N: Date.now().toString() },
      event_type: { S: event_type },
      correlation_id: { N: correlation_id },
      event: { S: event },
    },
  };

  // Call DynamoDB to add the item to the table
  try {
    let result = await db.putItem(params).promise();
    console.log("EVENT: Success", result);
  } catch (err) {
    console.log("EVENT: Error", err);
  }
}
