async function handleFeatureA(event, client) {
  const replyMessage = { type: 'text', text: 'This feature is arriving soon.' };
  return client.replyMessage(event.replyToken, replyMessage);
}

module.exports = { handleFeatureA };
