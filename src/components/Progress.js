import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import "./Progress.css";
import Invite from "./Invite.js";

export default function Progress() {
  const data = {
    challengeEndTimestamp: new Date().setFullYear(2021, 9, 3),
    // Would container list of badges that the challenger has accrued so far
    badges: [
      {
        avatarString: "Boy-1.png",
        name: "placeholder",
      },
      {
        avatarString: "Girl-1.png",
        name: "placeholder",
      },
    ],
  };

  // Calculates days remaining in challenge
  const processDays = (date) => {
    const DAY_CONVERSION = 24 * 60 * 60 * 1000;
    const currentDay = new Date();
    if (date > currentDay) {
      return Math.round((date - currentDay) / DAY_CONVERSION);
    } else {
      return 0;
    }
  };

  // stores days remaining
  // could not figure out how to do this without temp constant
  const temp = processDays(data["challengeEndTimestamp"]);
  const [dayCounter, changeDayCounter] = useState(temp);

  // Takes array from data object and fills it to length 8
  // may be redundant depending on database structure
  const padArray = (arr) => {
    if (arr.length < 8) {
      return arr.concat(new Array(8 - arr.length).fill(false));
    }
    return arr;
  };

  // saves badges to state
  const [progressArr, updateProgress] = useState([...padArray(data["badges"])]);

  // Processes emoji send to selected user
  const sendEmoji = () => {
    console.log("sent");
  };

  // Will handle the situation where 8 badges are achieved
  const winFunction = () => {
    console.log("You won!");
  };

  // Searches for win condition when progressArr does not contain falsey value
  useEffect(() => {
    let completed = true;
    for (let i = 0; i < progressArr.length; i++) {
      if (!progressArr[i]) {
        completed = false;
        break;
      }
    }
    if (completed) {
      winFunction();
    }
  }, [dayCounter, progressArr]);

  const toggleInvite = React.useRef();

  // Passed as callback function to create badge elements based on server call
  // startNumber is used to number the badges
  const generateBadges = (startNumber) => (element, index) => {
    return (
      <div className="badge-box">
        {element ? (
          <div className="badge-aligner">
            {element["avatarString"] ? (
              <div className="avatar yellow-background">
                <img
                  src={
                    require(`../assets/avatars/${element["avatarString"]}`)
                      .default
                  }
                  alt="avatar"
                />
              </div>
            ) : (
              <div className="no-avatar">
                <div className="up-down-arm"></div>
                <div className="down-up-arm"></div>
                <p className="bebase-neue black badge-counter">
                  {index + startNumber}
                </p>
              </div>
            )}
            <p className="name-text lato black spacing">{element["name"]}</p>
            <Button
              className="send-emoji yellow-background lato black"
              style={{
                fontSize: "9px",
                whiteSpace: "nowrap",
                textAlign: "center",
                padding: "0px",
              }}
              onClick={sendEmoji}
            >
              Send Emoji
            </Button>
          </div>
        ) : (
          <div className="no-avatar">
            <div className="up-down-arm"></div>
            <div className="down-up-arm"></div>
            <p className="bebase-neue black badge-counter">
              {index + startNumber}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div id="progress-container">
        <p className="bebas-neue black spacing" id="challenge-badge-header">
          YOUR CHALLENGE BADGES
        </p>
        <div id="day-counter-container">
          <div className="day-box yellow-background" id="yellow-day-box"></div>
          <div className="day-box black-background">
            <p className="bebas-neue white" id="day-number">
              {dayCounter}
            </p>
            <p className="lato white spacing" id="days-left">
              days left
            </p>
          </div>
        </div>
        <p className="black" id="thanks-message">
          Thanks for taking the challenge! Invite friends to join your challenge
          to earn badges.
        </p>
        <div className="badge-row" id="first-row">
          {progressArr.slice(0, 4).map(generateBadges(1))}
        </div>
        <div className="badge-row" id="second-row">
          {progressArr.slice(4).map(generateBadges(5))}
        </div>
        <button
          className="black spacing"
          id="inviteToggleBtn"
          onClick={() => toggleInvite.current()}
        >
          Invite friends
        </button>
        <p className="black spacing" id="register-message">
          Not registered to vote yet? <a href="../voterreg">Register now</a> and
          earn your first badge!
        </p>
      </div>
      <Invite toggleInvite={toggleInvite} />
    </>
  );
}
