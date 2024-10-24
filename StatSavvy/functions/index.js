/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const SPORTSRADAR_API_KEY="E9LpwhQO2FU2Kv29jU5IwiV7p3G45YWzSdO5sj8K";

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Franks Cloud function!");
});

exports.assignTeamIDs = onRequest((request, response) => {
  const options = {method: "GET", headers: {accept: "application/json"}};

  const fetchTeamIDs = async () => {
    try {
      const response = await fetch(
          `https://api.sportradar.com/nfl/official/trial/v7/en/league/hierarchy.json?api_key=
        ${SPORTSRADAR_API_KEY}`
          , options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const conferences = data.conferences;
      conferences.forEach((conference) => {
        const divisions = conference.divisions;

        divisions.forEach((division) => {
          const teams = division.teams;

          teams.forEach(async (team) => {
            // Using Admin SDK to set Firestore data
            await db.collection("LeagueInfo")
                .doc(`${team.market} ${team.name}`)
                .set({
                  id: team.id,
                });

            console.log(team.id);
            console.log(team.market);
            console.log(team.name);
            console.log("\n");
          });
        });
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchTeamIDs();
  response.send("Teams' IDs assigned!");
});

exports.assignTeamNames = onRequest((request, response) => {
  const options = {method: "GET", headers: {accept: "application/json"}};

  const fetchTeamNames = async () => {
    try {
      const response = await fetch(`https://api.sportradar.com/nfl/official/trial/v7/en/league/hierarchy.json?api_key=${SPORTSRADAR_API_KEY}`, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const conferences = data.conferences;

      conferences.forEach((conference) => {
        const divisions = conference.divisions;

        divisions.forEach((division) => {
          const teams = division.teams;

          teams.forEach(async (team) => {
            // Using Admin SDK to set Firestore data
            await db.collection("TeamIDInfo").doc(team.id).set({
              name: `${team.market} ${team.name}`,
            });

            console.log(`Updated team: ${team.market} ${team.name}`);
          });
        });
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchTeamNames();
  response.send("Teams' names assigned!");
});

exports.assignPlayersToTeams = onRequest((request, response)=>{
  const fetchPlayers = async () =>{
    try {
      const snapshot = await db.collection("TeamIDInfo").get();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (snapshot.empty) {
        console.log("No matching documents.");
        return response.send("No documents found.");
      }
      snapshot.forEach((doc)=>{
        console.log(`${doc.id}=> `, doc.data());
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  fetchPlayers();
});

exports.loadCardinalsPlayers = onRequest((request, response)=>{
  const options = {method: "GET", headers: {accept: "application/json"}};
  const loadPlayers = async () => {
    try {
      const response = await fetch(
          `https://api.sportradar.com/nfl/official/trial/v7/en/seasons/2024/REG/teams/de760528-1dc0-416a-a978-b510d20692ff/statistics.json?api_key=
        ${SPORTSRADAR_API_KEY}`
          , options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const players = data.players;
      const playersAry = [];
      players.forEach((player)=>{
        playersAry.push(player.name);
      });

      await db.collection("LeagueInfo").doc("Arizona Cardinals").update({
        roster: playersAry,
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  loadPlayers();
});
