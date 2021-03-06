import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import Logo from "../../assets/800px-Hyundai_Transys_logo.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";
import cookie from "react-cookies";
import jwt_decode from "jwt-decode";
// import { logOutUser } from "../../actions/auth";
import styled from "styled-components";

const StyledSpan = styled.span`
  display: flex;
  align-items: center;
  margin-right: 40px;
  color: rgb(116, 116, 123);
  font-size: 16px;
  letter-spacing: -0.3px;
`;
const Bold = styled.div`
  font-weight: 700;
  color: #0069c0;
`;

function NavBar() {
  let history = useHistory();
  const [LoginModalVisible, setLoginModalVisible] = useState(false);
  const [RegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userLastLogin, setUserLastLogin] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const userInfos = useSelector((state) => state.auth.userInfos);

  const location = useLocation();

  useEffect(() => {
    if (cookie.load("token")) {
      setAuthenticated(true);
      setUserName(
        JSON.stringify(jwt_decode(cookie.load("token")).User_name).split('"')[1]
      );
      setUserLastLogin(
        JSON.stringify(jwt_decode(cookie.load("token")).User_lastlogin).split(
          '"'
        )[1]
      );

      if (
        JSON.stringify(jwt_decode(cookie.load("token")).User_position) === "1"
      ) {
        setUserLevel(1); // user
      } else if (
        JSON.stringify(jwt_decode(cookie.load("token")).User_position) === "2"
      ) {
        setUserLevel(2); // agent
      } else {
        setUserLevel(3); // admin
      }
    }
  }, [userInfos]);

  const loginOpenModal = () => {
    setLoginModalVisible(true);
  };
  const loginCloseModal = () => {
    setLoginModalVisible(false);
  };
  const registerOpenModal = () => {
    setRegisterModalVisible(true);
  };
  const registerCloseModal = () => {
    setRegisterModalVisible(false);
  };
  const logOut = () => {
    cookie.remove("token");
    setAuthenticated(false);
    //  dispatch(logOutUser());

    if (location.pathname === "/") {
      window.location.reload();
    }
    history.push("/");
  };

  return (
    <>
      <div>
        <Navbar variant="dark" className="NavFirstRow">
          <Navbar.Brand href="/" className="NavLogo">
            <img
              src={Logo}
              width="140"
              height="30"
              className="d-inline-block align-top"
            />
            <label className="logo-text">IT Service Portal</label>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              {authenticated ? (
                <>
                  <StyledSpan>
                    {userLevel === 1
                      ? "??????"
                      : userLevel === 2
                      ? "??????"
                      : "?????????"}
                  </StyledSpan>
                  <StyledSpan>
                    <Bold>{userName}</Bold>???
                  </StyledSpan>
                  <StyledSpan>
                    ?????? ?????????:
                    <h6
                      style={{
                        color: "#0069c0",
                        marginTop: "5.5px",
                        marginLeft: "5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {userLastLogin}
                    </h6>
                  </StyledSpan>
                </>
              ) : (
                <Button
                  variant="outline-secondary"
                  onClick={registerOpenModal}
                  style={{ marginRight: "5px" }}
                >
                  ????????????
                </Button>
              )}

              {authenticated ? (
                <Button variant="outline-secondary" onClick={logOut}>
                  ????????????
                </Button>
              ) : (
                <Button variant="outline-secondary" onClick={loginOpenModal}>
                  ?????????
                </Button>
              )}

              {LoginModalVisible && (
                <LoginModal
                  visible={LoginModalVisible}
                  closable={true}
                  maskClosable={true}
                  onClose={loginCloseModal}
                />
              )}

              {RegisterModalVisible && (
                <RegisterModal
                  visible={RegisterModalVisible}
                  closable={true}
                  maskClosable={true}
                  onClose={registerCloseModal}
                />
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <div>
        <Navbar collapseOnSelect expand="lg" variant="dark" id="NavSecondRow">
          {authenticated ? (
            <Nav.Link id="collasible-nav">
              <Link to="/servicerequest" id="textcolorwhite">
                ??????/??????
              </Link>
            </Nav.Link>
          ) : (
            <Nav.Link
              id="collasible-nav"
              onClick={loginOpenModal}
              style={{ color: "white" }}
            >
              ??????/??????
            </Nav.Link>
          )}

          {authenticated && userLevel === 1 ? (
            <Nav.Link id="collasible-nav">
              <Link to="/mysr" id="textcolorwhite">
                ?????? ????????????
              </Link>
            </Nav.Link>
          ) : userLevel === 2 ? (
            <NavDropdown title="?????????" id="dropDown-nav">
              <NavDropdown.Item>
                <Link to="/mysr" style={{ color: "black" }}>
                  ?????? ????????????
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="sragent">?????? ????????????</NavDropdown.Item>
            </NavDropdown>
          ) : userLevel === 3 ? (
            <NavDropdown title="????????????" id="dropDown-nav">
              <NavDropdown.Item>
                <Link to="/mysr" style={{ color: "black" }}>
                  ?????? ????????????
                </Link>
                {/* <Link style={{ color: "black" }}>???????????? ??????</Link> */}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Link to="/intentmain" style={{ color: "black" }}>
                  ?????? ???????????? ??????
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Link to="/sradmin" style={{ color: "black" }}>
                  ?????? ????????????
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link
              id="collasible-nav"
              onClick={loginOpenModal}
              style={{ color: "white" }}
            >
              ?????? ????????????
            </Nav.Link>
          )}

          <Nav.Link id="collasible-nav"></Nav.Link>
        </Navbar>
      </div>
    </>
  );
}

export default NavBar;
