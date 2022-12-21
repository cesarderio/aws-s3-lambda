

// After repeatedly working with the demo code and the demo Julian shared, I am still unable to get it to run properly. I have gotten to a point where I may have made it worse


console.log('choose an image');

const { S3,
  GetObjectCommand,
  PutObjectCommand,
} = require('aws-sdk');

const s3 = new S3();


exports.handler = async (event, context) => {
  // const bucketName = event.Records[0].s3.bucket.name;
  // const filename = event.Records[0].s3.object.key;

  const bucket = 'rcimages';
  const key = event.Records[0].s3.object.key.replace(/\+/g, ' ');
  const params = {
    Bucket: bucket,
    Key: key,
  };
  let json;
  try {
    const data = await json.send(new GetObjectCommand({
      Bucket: bucket,
      Key: 'images.json',
    }));
    const dataString = await data.Body.transformToString();
    json = JSON.parse(dataString);
    console.log('JSON array', json);
  } catch(e) {
    json = [];
  }
  try {
    const response = await json.send(new GetObjectCommand(params));
    const imageData = {
      name: key,
      size: response.ContentLength,
      type: response.ContentType,
    };
    const idx = json.findIndex(v => v.name === key);
    if(idx !== -1) {
      json[idx] = imageData;
    } else {
      json.push(imageData);

    }
    await json.send(new PutObjectCommand({
      Bucket: bucket,
      Key: 'images.json',
      Body: JSON.stringify(json),
    }));
    console.log('Image Data', imageData);
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};
