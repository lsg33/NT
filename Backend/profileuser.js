const express = require('express');
const mongoose = require('mongoose');
const PlayFab = require('playfab-sdk/Scripts/PlayFab/PlayFabClient');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://forcesspecial801:oCqg7zZg0MA95I5b@cluster777.atoevuq.mongodb.net/NT', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  oculusId: String,
  playFabId: String,
  displayName: String,
});

const User = mongoose.model('User', userSchema);

app.get('/api/auth/oculus', (req, res) => {
  const { oculusId, accessToken } = req.query;

  PlayFabClient.LoginWithOculus({
    CreateAccount: true,
    OculusId: oculusId,
    AccessToken: accessToken,
    TitleId: "FDFD1"
  }, async (error, result) => {
    if (error) {
      console.error("PlayFab login failed:", error);
      return res.status(500).json({ success: false, message: "PlayFab login failed" });
    } else {
      console.log("PlayFab login successful:", result);
      const { PlayFabId, InfoResultPayload } = result.data;
      const { AccountInfo } = InfoResultPayload;
      const { TitleInfo } = AccountInfo;
      const { DisplayName } = TitleInfo;

      const user = new User({
        oculusId: oculusId,
        playFabId: PlayFabId,
        displayName: DisplayName,
      });

      await user.save();
      console.log("User data logged in MongoDB:", user);
      return res.json({ success: true, user });
    }
  });
});
