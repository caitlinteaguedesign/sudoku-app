import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import classnames from "classnames";

import formatDate from "../util/formatDate";

import Loading from "../components/Loading";
import CreatePrompt from "../components/CreatePrompt";

import Easy from "../img/easy.svg?react";
import Medium from "../img/medium.svg?react";
import Hard from "../img/hard.svg?react";
import Expert from "../img/expert.svg?react";
import InProgress from "../img/inprogress.svg?react";
import Completed from "../img/completed.svg?react";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      puzzles: [],
      loading: true,
    };
  }

  getPuzzles = (usersPuzzles) => {
    axios
      .get("/puzzles/")
      .then((res) => {
        const puzzleLibrary = res.data;
        let puzzleList = [];

        for (let i = 0; i < usersPuzzles.length; i++) {
          const puzzle = usersPuzzles[i];

          const lookup = puzzleLibrary.find((x) => x._id === puzzle.id);

          const entry = {
            _id: puzzle.id,
            name: lookup.name,
            difficulty: lookup.difficulty,
            date_created: lookup.date_created,
            completed: puzzle.completed,
          };
          puzzleList.push(entry);
        }

        this.setState({
          puzzles: puzzleList,
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    const { user } = this.props.auth;

    axios
      .get("/users/id/" + user.id)
      .then((res) => {
        const puzzles = res.data.result.puzzles;

        if (puzzles.length > 0) {
          this.getPuzzles(puzzles);
        } else {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { loading, puzzles } = this.state;

    if (loading) return Loading();
    else {
      if (puzzles.length > 0) return listPuzzles(puzzles);
      else return <CreatePrompt />;
    }
  }
}

function listPuzzles(puzzles) {
  const inprogress = puzzles
    .filter((puzzle) => !puzzle.completed)
    .sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
  const completed = puzzles
    .filter((puzzle) => puzzle.completed)
    .sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      {inprogress.length > 0 && (
        <section className="section">
          <div className="section-title-icon">
            <InProgress
              role="img"
              aria-label="these puzzles are in-progress"
              width="26"
              height="26"
              className="section-title-icon__icon"
            />
            <h2 className="section-title">In-Progress</h2>
          </div>
          <ul className="puzzle-list">
            {inprogress.map((obj) => singlePuzzle(obj))}
          </ul>
        </section>
      )}

      {completed.length > 0 && (
        <section className="section">
          <div className="section-title-icon">
            <Completed
              role="img"
              aria-label="these puzzles are completed"
              width="26"
              height="26"
              className="section-title-icon__icon"
            />
            <h2 className="section-title">Completed</h2>
          </div>
          <ul className="puzzle-list">
            {completed.map((obj) => singlePuzzle(obj))}
          </ul>
        </section>
      )}
    </div>
  );
}

function singlePuzzle(puzzle) {
  let IconName = "";

  switch (puzzle.difficulty) {
    case "easy":
      IconName = Easy;
      break;
    case "medium":
      IconName = Medium;
      break;
    case "hard":
      IconName = Hard;
      break;
    case "expert":
      IconName = Expert;
      break;
    default:
      break;
  }

  return (
    <li key={puzzle._id} className="puzzle-list__item">
      <IconName
        role="img"
        aria-label={`This puzzle has a difficulty of ${puzzle.difficulty}`}
        width="52"
        height="52"
        className={classnames(
          "puzzle-list__icon",
          { "puzzle-list__icon--easy": puzzle.difficulty === "easy" },
          { "puzzle-list__icon--medium": puzzle.difficulty === "medium" },
          { "puzzle-list__icon--hard": puzzle.difficulty === "hard" },
          { "puzzle-list__icon--expert": puzzle.difficulty === "expert" },
        )}
      />
      <Link to={`/puzzle/${puzzle._id}`} className="link link_style-text">
        {puzzle.name}
      </Link>
      <span className="puzzle-list__date">
        Added on{" "}
        <span className="text_bold">
          {formatDate(puzzle.date_created, "M/D/YYYY")}
        </span>
      </span>
    </li>
  );
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(Dashboard));
