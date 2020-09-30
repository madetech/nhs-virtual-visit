var AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
var dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.lambda_entry = async function (event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  console.log("EVENT: \n" + JSON.stringify(context, null, 2));
  await log_event(dynamodb);
  return "HELLO WORLD"; //context.logStreamName
};

async function log_event(db) {
  var params = {
    TableName: "visitEvents",
    Item: {
      id: { N: "001" },
      event: { S: "Some event" },
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
