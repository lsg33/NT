const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const PlayFabClient = require('playfab-sdk/Scripts/PlayFab/PlayFabClient');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://forcesspecial801:oCqg7zZg0MA95I5b@cluster777.atoevuq.mongodb.net/NT', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  oculusId: String,
  playFabId: String,
  displayName: String,
});

const User = mongoose.model('User', userSchema);

// Step 1: Handle OAuth callback
app.get('/api/auth/oculus', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Authorization code is required' });
  }

  try {
    // Step 2: Exchange code for access token
    const tokenResponse = await axios.post('https://api.oculus.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://novatag.lol/Login',
        client_id: '7238920182799088',
        client_secret: '8e3cd98c2f0cd62dd2af8dc57fb229ac'
      }
    });

    const { access_token } = tokenResponse.data;

    // Step 3: Retrieve Oculus ID using the access token
    const userResponse = await axios.get('https://graph.oculus.com/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const oculusId = userResponse.data.id;

    // Step 4: Log in with PlayFab
    PlayFabClient.LoginWithOculus({
      CreateAccount: true,
      OculusId: oculusId,
      AccessToken: access_token,
      TitleId: "FDFD1"
    }, async (error, result) => {
      if (error) {
        console.error('PlayFab login failed:', error);
        return res.status(500).json({ success: false, message: 'PlayFab login failed' });
      } else {
        console.log('PlayFab login successful:', result);
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
        console.log('User data logged in MongoDB:', user);
        return res.json({ success: true, user });
      }
    });
  } catch (error) {
    console.error('Error during OAuth flow:', error);
    return res.status(500).json({ success: false, message: 'Error during OAuth flow' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
