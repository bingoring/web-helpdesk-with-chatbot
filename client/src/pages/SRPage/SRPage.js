import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import styled, { css } from "styled-components";
import "./SRPage.css";
import Datepicker from "../../components/Datepicker";
import { Link } from "react-router-dom";
import axios from "axios";
import searchImg from "../../assets/Search.png";
import SRModal from "../../components/SRModal";
import cookie from "react-cookies";
import dotenv from "dotenv";
dotenv.config();

const TopContainer = styled.div`
  display: flex;
  height: 140px;
  background-color: aliceblue;
  color: #0069c0;
  font-weight: bold;
  flex-direction: column;
`;
const PageNameWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 33%;
  align-items: center;
`;
const TopFirstRowhWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 33%;
  color: black;
`;
const SecondRowWrapper = styled.div`
  display: flex;
  height: 33%;
  color: black;
`;
const SearchBlock = styled.div`
  display: flex;
  margin-top: 10px;
  margin-left: 15px;
`;
const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border-top: solid #0069c0;
`;
const BetweenDate = styled.span`
  padding-left: 10px;
  padding-top: 3px;
  font-size: 14px;
`;
const Select = styled.select`
  margin-left: 10px;
  height: 27px;
`;
const Input = styled.input`
  margin-left: 8px;
  height: 28px;
`;

function SRPage() {
  // const [FilteredRequests, setFilterdRequests] = useState([]);
  const [Requests, setRequests] = useState([]);
  const [Query, setQuery] = useState(
    `${process.env.REACT_APP_API_HOST}/requests/search` //get All request
  );
  // const [FilteredRequests, setFilterdRequests] = useState([]);
  const [sRModalVisible, setSRModalVisible] = useState(false);
  const [modalSRInfos, setModalSRInfos] = useState([]);

  const [StartDate, setStartDate] = useState("");
  const [FinishDate, setFinishDate] = useState("");
  const [CSRStatus, setCSRStatus] = useState("");
  const [TargetCode, setTargetCode] = useState("");
  const [SearchType, setSearchType] = useState("title");
  const [Keyword, setKeyword] = useState("");

  const SearchHandler = () => {
    const queryKeyword =
      SearchType === "title"
        ? Keyword === ""
          ? ``
          : `&title=${encodeURIComponent(Keyword)}`
        : Keyword === ""
        ? ``
        : `&user=${encodeURIComponent(Keyword)}`;

    //  console.log(queryKeyword);
    const queryTargetCode = `&targetcode=${encodeURIComponent(TargetCode)}`;
    const queryCSRStatus = `&csrstatus=${encodeURIComponent(CSRStatus)}`;
    const queryDate =
      StartDate === ""
        ? FinishDate === ""
          ? ``
          : `&endDate=${FinishDate}`
        : FinishDate === ""
        ? `&startDate=${StartDate}`
        : `&startDate=${StartDate}&endDate=${FinishDate}`;
    //  console.log(queryDate);

    const searchAPI = `${process.env.REACT_APP_API_HOST}/requests/search?${queryKeyword}${queryTargetCode}${queryCSRStatus}${queryDate}`;
    setQuery(searchAPI);
    console.log(searchAPI);
    // http://localhost:5000/requests/searchRequest/?user=sehwagod&title=??????&targetcode=QA??????&csrstatus=??????&startDate=20210311&endDate=20210317
  };

  useEffect(() => {
    // const endpoint = "http://localhost:5000/requests/getAllRequest?";
    fetchRequests(Query);
  }, [Query]);

  const sROpenModal = (requestInfos) => {
    setSRModalVisible(true);
    setModalSRInfos(requestInfos);
    //  console.log(index);
    //  console.log(Requests[0]["TITLE"]);
  };
  const sRCloseModal = () => {
    setSRModalVisible(false);
  };

  const fetchRequests = (Query) => {
    axios
      .get(Query, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        setRequests([...response.data]);
      });
  };

  const StartdatedHandler = (date) => {
    setStartDate(date);
    // console.log(StartDate);
  };
  const FinishDateHandler = (date) => {
    setFinishDate(date);
    //  console.log(FinishDate);
  };
  const keywordHandler = (e) => {
    setKeyword(e.target.value);
  };
  const searchTypeHandler = (e) => {
    setSearchType(e.target.value);
  };
  const csrStatusSearchHandler = (e) => {
    setCSRStatus(e.target.value);
    //  console.log(e.target.value);
  };

  const targetCodeSearchHandler = (e) => {
    setTargetCode(e.target.value);
    //  console.log(e.target.value);
  };

  return (
    <>
      <TopContainer>
        <PageNameWrapper>
          <div
            style={{
              display: "flex",
              width: "90%",
            }}
          >
            <span style={{ marginLeft: "16px", fontSize: "18px" }}>
              ??? ??????/??????
            </span>
          </div>
          <div
            style={{
              display: "flex",
              width: "10%",
              justifyContent: "flex-end",
            }}
          >
            <Link to="/itsr">
              <Button variant="primary" size="sm" id="itsrButton">
                IT ????????? ??????
              </Button>
            </Link>
          </div>
        </PageNameWrapper>
        <TopFirstRowhWrapper>
          <SearchBlock>
            ?? ????????? ??????
            <Select onChange={csrStatusSearchHandler}>
              <option value="" selected>
                ??????
              </option>
              <option value="????????????">????????????</option>
              <option value="????????????">????????????</option>
              <option value="???????????????">???????????????</option>
              <option value="????????????">????????????</option>
              <option value="????????????">????????????</option>
            </Select>
          </SearchBlock>
          <SearchBlock>
            ?? ??????/?????? ??????
            <Datepicker change={StartdatedHandler} />
            <BetweenDate>~</BetweenDate>
            <Datepicker change={FinishDateHandler} />
          </SearchBlock>
        </TopFirstRowhWrapper>
        <SecondRowWrapper>
          <SearchBlock>
            ?? ?????? ??????
            <Select onChange={targetCodeSearchHandler}>
              <option value="" selected>
                ??????
              </option>
              <option value="???????????????">???????????????</option>
              <option value="IT?????????">IT?????????</option>
              <option value="OA??????">OA??????</option>
            </Select>
          </SearchBlock>
          <SearchBlock>
            ??
            <Select onChange={searchTypeHandler}>
              <option value="title">??????</option>
              <option value="user">?????????</option>
            </Select>
            <Input size="40" onChange={keywordHandler} />
            <Button
              variant="secondary"
              size="sm"
              id="searchButton"
              onClick={SearchHandler}
              style={{ marginLeft: "55px", height: "30px" }}
            >
              <img src={searchImg} width="18" height="17" />
              ??????
            </Button>
          </SearchBlock>
        </SecondRowWrapper>
      </TopContainer>
      <TableContainer>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th rowSpan="2" id="centerAlign">
                No
              </th>
              <th rowSpan="2" id="centerAlign">
                ???????????????
              </th>
              <th rowSpan="2" id="centerAlign">
                ????????????
              </th>

              <th rowSpan="2" id="centerAlign">
                ??????
              </th>
              <th colSpan="2" id="centerAlign">
                ????????? ??????
              </th>
              <th colSpan="2" id="centerAlign">
                ????????? ??????
              </th>
              <th colSpan="2" id="centerAlign">
                ????????? ??????/??????
              </th>
            </tr>
            <tr>
              <th id="centerAlign">?????????</th>
              <th id="centerAlign">???????????????</th>

              <th id="centerAlign">?????????</th>
              <th id="centerAlign">???????????????</th>
              <th id="centerAlign">???????????????</th>
            </tr>
          </thead>

          <tbody>
            {Requests.map((request, index) => (
              <tr
                key={index}
                onClick={() => {
                  sROpenModal(request);
                }}
              >
                <td id="centerAlign">{request.REQ_SEQ}</td>
                <td id="centerAlign">{request.CSR_STATUS}</td>
                <td id="centerAlign">{request.TARGET_CODE}</td>
                <td id="centerAlign">{request.TITLE}</td>
                <td id="centerAlign">{request.REG_USER.User_name}</td>
                <td id="centerAlign">{request.createdAt.split(" ")[0]}</td>
                <td id="centerAlign">{request.MOD_USER_ID}</td>
                <td id="centerAlign">{request.EXPRECTED_FINISH_DATE}</td>
                <td id="centerAlign">{request.REAL_FINISH_DATE}</td>
              </tr>
            ))}
          </tbody>
          {sRModalVisible && (
            <SRModal
              requestInfos={modalSRInfos}
              visible={sRModalVisible}
              closable={true}
              maskClosable={true}
              onClose={sRCloseModal}
            />
          )}
        </Table>
      </TableContainer>
    </>
  );
}

export default SRPage;
