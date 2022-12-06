import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHeart,
  faUserFriends,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import giticon from "./img/github.png";
import styles from "./Main.module.css";

function Main() {
  const ACCESS_TOKEN = "token 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";
  const headers = {
    Accept: "application/vnd.github.nightshade-preview+json",
    Authorization: ACCESS_TOKEN,
  };
  let [username, setUsername] = useState("");
  let [userProfile, setUserProfile] = useState({
    avatar_url: "",
    name: "",
  });
  let [isInput, setInput] = useState(false);

  let [show, setShow] = useState(false);

  return (
    <div className={styles.background}>
      <div>
        <img src={giticon} className={styles.giticon} />
        <h1 className={styles.title}>Recommend GitHub Repository</h1>
      </div>
      <Container className={styles.inputgroup}>
        <Row>
          <Col md={{ span: 1 }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />
          </Col>
          <Col md={{ span: 11 }}>
            <InputGroup
              onKeyPress={(e) => {
                if (e.key == "Enter") {
                  console.log("entered");

                  axios
                    // .get(`https://api.github.com/users/${username}/repos`,headers)
                    .get(`https://api.github.com/users/${username}`, headers)
                    .then((res) => {
                      console.log(res.data);
                      setUserProfile(res.data);
                      setInput(true);
                    })
                    .catch(function (error) {
                      if (error.response) {
                        setInput(false);
                        alert("아이디를 정확하게 입력해주세요!");
                      }
                    });
                }
              }}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            >
              <Form.Control
                placeholder="깃허브 아이디를 입력해주세요!"
                aria-label="search"
                aria-describedby="search"
              />
            </InputGroup>
          </Col>
        </Row>
      </Container>
      {isInput ? (
        <>
          <Profile profile={userProfile} headers={headers} />
          <Button id={styles.Button} onClick={()=>{setShow(true)}}>Go recommendation</Button>
        </>
      ) : (
        <></>
      )}
      {isInput ? (
        <RecommendRepo
          show={show}
          setShow={setShow}
          profile={userProfile}
          headers={headers}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

function Profile({ profile, headers }) {
  let [repo, setRepo] = useState([]);
  useEffect(() => {
    axios.get(`${profile.repos_url}?per_page=100`, headers).then((res) => {
      console.log(res.data);
      setRepo(res.data);
    });
  }, [profile]);

  return (
    <div className={styles.grid}>
      <div className={styles.profilegrid} style={{ marginTop: "50px" }}>
        <img className={styles.img} src={profile.avatar_url}></img>
        <div style={{ paddingLeft: "20px" }}>
          <h4>{profile.name}</h4>
          <h5>{profile.login}</h5>
        </div>
      </div>
      <div>
        <Container>
          <Row>
            <Col md={{ span: 4 }} style={{ margin: "auto" }}>
              <h3>Repository</h3>
            </Col>
            <Col md={{ span: 6 }} style={{ margin: "auto" }}>
              <h3>Description</h3>
            </Col>

            <Col md={{ span: 2 }} style={{ margin: "auto" }}>
              <h3>url</h3>
            </Col>
          </Row>
        </Container>
        <Container className={styles.repos}>
          {repo.map(function (e) {
            return (
              <>
                <Row
                  style={{
                    background: "#DDDDDD",
                    marginTop: "10px",
                    borderRadius: "20px",
                  }}
                >
                  <Col
                    className={`${styles.area} ${styles.ellipsis} ${styles.seroalign}`}
                    md={{ span: 4 }}
                    style={{ margin: "auto" }}
                  >
                    <p>{e.name}</p>
                  </Col>
                  <Col
                    className={`${styles.area} ${styles.ellipsis} ${styles.seroalign}`}
                    md={{ span: 6 }}
                    style={{ margin: "auto" }}
                  >
                    <marquee>{e.description}</marquee>
                  </Col>
                  {/* <Col md={{span:2}}></Col> */}
                  <Col md={{ span: 2 }} style={{ margin: "auto" }}>
                    <a href={e.html_url}>
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  </Col>
                </Row>
              </>
            );
          })}
        </Container>
      </div>
    </div>
  );
}

function Repo() {
  return <></>;
}

function RecommendRepo({ show, setShow, profile, headers }) {
  let [repo, setRepo] = useState([]);
  useEffect(() => {
    axios.get(`${profile.repos_url}?per_page=100`, headers).then((res) => {
      console.log(res.data);
      setRepo(res.data);
    });

    axios.get('http://127.0.0.1:8000/recommend/12').then((res)=>{
      console.log(res.data)
    })
  }, [profile]);

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        dialogClassName={styles.mymodal}
      >
        <Modal.Header closeButton style={{ background: "#FFF7E9" }}>
          <Modal.Title>
            <h2>추천된 Repository </h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#FFF7E9" }}>
          추천된 저장소 정보
          <div>
            <Container>
              <Row>
                <Col md={{ span: 4 }} style={{ margin: "auto" }}>
                  <h3>Repository</h3>
                </Col>
                <Col md={{ span: 6 }} style={{ margin: "auto" }}>
                  <h3>Description</h3>
                </Col>

                <Col md={{ span: 2 }} style={{ margin: "auto" }}>
                  <h3>url</h3>
                </Col>
              </Row>
            </Container>
            <Container className={styles.repos}>
              {repo.map(function (e) {
                return (
                  <>
                    <Row
                      style={{
                        background: "#DDDDDD",
                        marginTop: "10px",
                        borderRadius: "20px",
                      }}
                    >
                      <Col
                        className={`${styles.area} ${styles.ellipsis} ${styles.seroalign}`}
                        md={{ span: 4 }}
                        style={{ margin: "auto" }}
                      >
                        <p>{e.name}</p>
                      </Col>
                      <Col
                        className={`${styles.area} ${styles.ellipsis} ${styles.seroalign}`}
                        md={{ span: 6 }}
                        style={{ margin: "auto" }}
                      >
                        <marquee>{e.description}</marquee>
                      </Col>
                      {/* <Col md={{span:2}}></Col> */}
                      <Col md={{ span: 2 }} style={{ margin: "auto" }}>
                        <a href={e.html_url}>
                          <FontAwesomeIcon icon={faLink} />
                        </a>
                      </Col>
                    </Row>
                  </>
                );
              })}
            </Container>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Main;
