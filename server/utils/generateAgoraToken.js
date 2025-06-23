// utils/generateAgoraToken.js
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;

export const generateAgoraToken = (channelName, uid = 0) => {
  const appID = 'dafa2f4acaab44b18a4715dd05735c7a';
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // 1 hour

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID, appCertificate, channelName, uid, role, privilegeExpiredTs
  );

  return token;
};
