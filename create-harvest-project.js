const axios = require('axios');

const harvestToken = process.env.HARVEST_TOKEN
const harvestAccountId = process.env.HARVEST_ACCOUNT_ID
const harvestAplusClientId = process.env.HARVEST_APLUS_CLIENT_ID

exports.main = async (event, callback) => {

  const projectNumber = event.inputFields['no_de_projet'];
  const projectNameWithNumber = event.inputFields['nom_du_projet'];
  const projectNameComponents = projectNameWithNumber.split("|");
  let projectName;

  if (projectNameComponents.length > 1) {
    projectName = projectNameComponents[1].trim();
  } else {
    projectName = projectNameWithNumber
    console.log("Project name does not follow HubSpot's naming convention 'Number | Name' and does not contain '|' so we can't remove the number from the name to follow Harvest's naming convetion");
  }

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://api.harvestapp.com/v2/projects?client_id=${harvestAplusClientId}&code=${projectNumber}&name=${projectName}&is_billable=true&bill_by=People&budget_by=none`,
    headers: { 
      'Harvest-Account-Id': harvestAccountId, 
      'Authorization': `Bearer ${harvestToken}`
    }
  };

  axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data.id));
    
      callback({
    outputFields: {
      harvestProjectId: response.data.id,
      harvestProjectUrl: `https://YOURSUBDOMAIN.harvestapp.com/projects/${response.data.id}`
    }
  });
  })
    .catch((error) => {
    throw new Error(error)
  });



}