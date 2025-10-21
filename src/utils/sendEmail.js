const  { SendEmailCommand } =require("@aws-sdk/client-ses");
const  { sesClient } =require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress,data) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: data.htmlBody ,
        },
        Text: {
          Charset: "UTF-8",
          Data: data.textBody ,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: data.subject ,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};



const run = async (data) => {
  const sendEmailCommand = createSendEmailCommand(
    "ashishar050488@gmail.com",
    "ashishar050488@gmail.com",
    data
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports= { run };